<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get all workspaces belonging to the logged-in owner (any status)
// Steps:
// - Validate JWT token
// - Check role = owner
// - Fetch owner's workspaces with rating average + review count
// - Attach images
// - Return response

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt  = new JwtHandler();


// =====================
// 1. AUTH (JWT)
// =====================
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token   = str_replace("Bearer ", "", $headers['Authorization']);
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid or expired token", null, "INVALID_TOKEN", 401);
}


// =====================
// 2. ROLE CHECK
// =====================
if (!isset($decoded->role) || $decoded->role !== 'owner') {
    response(false, "Access denied", null, "FORBIDDEN", 403);
}

$ownerId = $decoded->id;


// =====================
// 3. GET WORKSPACES
// =====================
$stmt = $conn->prepare("
    SELECT
        w.id,
        w.workspace_name,
        w.description,
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
    LEFT JOIN reviews r ON r.workspace_id = w.id
    WHERE w.owner_id = ?
    GROUP BY w.id
    ORDER BY w.created_at DESC
");
$stmt->execute([$ownerId]);
$workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($workspaces)) {
    response(true, "No workspaces found", [], null, 200);
}


// =====================
// 4. ATTACH IMAGES
// =====================
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


// =====================
// 5. RESPONSE
// =====================
response(true, "Owner workspaces fetched successfully", $workspaces, null, 200);
