<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";
$conn = (new Database())->getConnection();
$jwt = new JwtHandler();


// =====================================
// AUTH
// =====================================

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "Token required", null, "TOKEN_REQUIRED", 401);
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = $jwt->validate($token);

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
// GET PENDING WORKSPACES
// =====================================

$stmt = $conn->prepare("
    SELECT 
        w.id,
        w.owner_id,
        u.name AS owner_name,
        w.workspace_name,
        w.city,
        w.area,
        w.internet_quality AS internet,
        w.electricity_status AS electricity,
        w.seating,
        w.hours_from,
        w.hours_to,
        w.quietness_level AS quietness,
        w.ladies_area,
        w.price_per_hour AS price,
        w.whatsapp,
        w.created_at
    FROM workspaces w
    JOIN users u ON u.id = w.owner_id
    WHERE w.status = 'pending'
    ORDER BY w.id DESC
");

$stmt->execute();
$workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);


// =====================================
// IF EMPTY
// =====================================

if (empty($workspaces)) {
    response(true, "No pending workspaces", [], null, 200);
}


// =====================================
// GET IMAGES
// =====================================

$ids = array_column($workspaces, 'id');

$in = str_repeat('?,', count($ids) - 1) . '?';

$imgStmt = $conn->prepare("
    SELECT workspace_id, image_path 
    FROM workspace_images 
    WHERE workspace_id IN ($in)
");

$imgStmt->execute($ids);
$images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);


// =====================================
// BASE URL
// =====================================

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";


// =====================================
// GROUP IMAGES
// =====================================

$imagesMap = [];

foreach ($images as $img) {
    $imagesMap[$img['workspace_id']][] = $baseUrl . $img['image_path'];
}


// =====================================
// ATTACH IMAGES
// =====================================

foreach ($workspaces as &$ws) {
    $ws['images'] = $imagesMap[$ws['id']] ?? [];
}


// =====================================
// RESPONSE
// =====================================

response(true, "Pending workspaces fetched successfully", $workspaces, null, 200);
