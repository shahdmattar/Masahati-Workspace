<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get all workspaces for admin (optionally filtered by status)
// Steps:
// - Validate JWT token
// - Check role = admin
// - Fetch workspaces (+ owner name + rating + review count + images)
// - Optional ?status=pending|approved|rejected filter
// - Return response

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt  = new JwtHandler();


// =====================================
// AUTH
// =====================================

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "Token required", null, "TOKEN_REQUIRED", 401);
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
$user  = $jwt->validate($token);

if (!$user) {
    response(false, "Invalid token", null, "INVALID_TOKEN", 401);
}


// =====================================
// ADMIN CHECK
// =====================================

if (!isset($user->role) || $user->role !== 'admin') {
    response(false, "Only admin allowed", null, "ACCESS_DENIED", 403);
}


// =====================================
// STATUS FILTER
// =====================================

$status = $_GET['status'] ?? 'all';
$allowedStatus = ['all', 'pending', 'approved', 'rejected'];

if (!in_array($status, $allowedStatus)) {
    response(false, "Invalid status filter", null, "INVALID_STATUS", 422);
}

$sql = "
    SELECT
        w.id,
        w.owner_id,
        u.name AS owner_name,
        w.workspace_name,
        w.city,
        w.area,
        w.internet_quality,
        w.electricity_status,
        w.seating,
        w.hours_from,
        w.hours_to,
        w.quietness_level,
        w.ladies_area,
        w.price_per_hour,
        w.whatsapp,
        w.status,
        w.created_at,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.id) AS total_reviews
    FROM workspaces w
    JOIN users u ON u.id = w.owner_id
    LEFT JOIN reviews r ON r.workspace_id = w.id
";

$params = [];

if ($status !== 'all') {
    $sql .= " WHERE w.status = ? ";
    $params[] = $status;
}

$sql .= " GROUP BY w.id ORDER BY w.id DESC ";

$stmt = $conn->prepare($sql);
$stmt->execute($params);
$workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($workspaces)) {
    response(true, "No workspaces found", [], null, 200);
}


// =====================================
// ATTACH IMAGES
// =====================================

$ids = array_column($workspaces, 'id');
$in  = str_repeat('?,', count($ids) - 1) . '?';

$imgStmt = $conn->prepare("
    SELECT workspace_id, image_path
    FROM workspace_images
    WHERE workspace_id IN ($in)
");
$imgStmt->execute($ids);
$images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

$imagesMap = [];
foreach ($images as $img) {
    $imagesMap[$img['workspace_id']][] = $baseUrl . $img['image_path'];
}

foreach ($workspaces as &$ws) {
    $ws['images']         = $imagesMap[$ws['id']] ?? [];
    $ws['average_rating'] = $ws['average_rating'] ? (float)$ws['average_rating'] : 0;
    $ws['total_reviews']  = (int)$ws['total_reviews'];
}


// =====================================
// RESPONSE
// =====================================

response(true, "Workspaces fetched successfully", $workspaces, null, 200);
