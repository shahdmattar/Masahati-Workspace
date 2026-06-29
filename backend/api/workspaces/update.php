<?php

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

if (!isset($user->role) || $user->role !== 'owner') {
    response(false, "Access denied", null, "ACCESS_DENIED", 403);
}

$owner_id = $user->id;


// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Method not allowed", null, "METHOD_NOT_ALLOWED", 405);
}


// =====================================
// GET DATA
// =====================================

$workspace_id   = $_POST['workspace_id'] ?? null;
$workspace_name = $_POST['workspace_name'] ?? null;
$city           = $_POST['city'] ?? null;
$area           = $_POST['area'] ?? null;
$internet       = $_POST['internet'] ?? null;
$electricity    = $_POST['electricity'] ?? null;
$seating        = $_POST['seating'] ?? null;
$hours_from     = $_POST['hours_from'] ?? null;
$hours_to       = $_POST['hours_to'] ?? null;
$quietness      = $_POST['quietness'] ?? null;
$ladies_area    = $_POST['ladies_area'] ?? null;
$price          = $_POST['price'] ?? null;
$whatsapp       = $_POST['whatsapp'] ?? null;


// =====================================
// VALIDATION
// =====================================

if (
    !$workspace_id || !$workspace_name || !$city || !$area ||
    !$internet || !$electricity || !$seating ||
    !$hours_from || !$hours_to || !$quietness ||
    !$ladies_area || !$price || !$whatsapp
) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}


// =====================================
// NORMALIZATION
// =====================================

// Internet
$internet_quality = match ($internet) {
    'Very Fast' => 'very_fast',
    'Fast' => 'fast',
    'Good' => 'good',
    default => 'good'
};

// Electricity
$electricity_status = match ($electricity) {
    'Available' => 'available',
    '24/7' => '24_7',
    'Backup Available' => 'backup',
    default => 'available'
};

// Quietness
$quietness_level = match ($quietness) {
    'Very Quiet' => 'very_quiet',
    'Quiet' => 'quiet',
    'Normal' => 'normal',
    default => 'normal'
};

// Ladies area
$ladies_area = ($ladies_area === 'Available') ? 1 : 0;

// Price
$price_per_hour = $price;


// =====================================
// CHECK OWNERSHIP
// =====================================

$check = $conn->prepare("
SELECT id FROM workspaces 
WHERE id = ? AND owner_id = ?
");

$check->execute([$workspace_id, $owner_id]);

if (!$check->fetch()) {
    response(false, "Workspace not found", null, "NOT_FOUND", 404);
}


// =====================================
// UPDATE WORKSPACE
// =====================================

$update = $conn->prepare("
UPDATE workspaces SET
    workspace_name = ?,
    city = ?,
    area = ?,
    internet_quality = ?,
    electricity_status = ?,
    seating = ?,
    hours_from = ?,
    hours_to = ?,
    quietness_level = ?,
    ladies_area = ?,
    price_per_hour = ?,
    whatsapp = ?
WHERE id = ?
");

$update->execute([
    $workspace_name,
    $city,
    $area,
    $internet_quality,
    $electricity_status,
    $seating,
    $hours_from,
    $hours_to,
    $quietness_level,
    $ladies_area,
    $price_per_hour,
    $whatsapp,
    $workspace_id
]);


// =====================================
// IMAGE HANDLING
// =====================================

$uploadDir = __DIR__ . "/../../uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}


if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {

    $del = $conn->prepare("DELETE FROM workspace_images WHERE workspace_id = ?");
    $del->execute([$workspace_id]);

    $images = $_FILES['images'];
    $count = is_array($images['name']) ? count($images['name']) : 1;

    for ($i = 0; $i < $count; $i++) {

        $name = is_array($images['name']) ? $images['name'][$i] : $images['name'];
        $tmp  = is_array($images['tmp_name']) ? $images['tmp_name'][$i] : $images['tmp_name'];

        if (!$tmp) continue;

        $ext = pathinfo($name, PATHINFO_EXTENSION);
        $fileName = time() . "_" . $i . "." . $ext;

        $targetPath = $uploadDir . $fileName;

        if (!move_uploaded_file($tmp, $targetPath)) {
            response(false, "Image upload failed", null, "UPLOAD_FAILED", 500);
        }

        $img = $conn->prepare("
            INSERT INTO workspace_images (workspace_id, image_path)
            VALUES (?, ?)
        ");

        $img->execute([$workspace_id, $fileName]);
    }
}


// =====================================
// RESPONSE
// =====================================

response(true, "Workspace updated successfully", [
    "workspace_id" => $workspace_id
], null, 200);
