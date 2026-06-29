<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();

// =====================================
// AUTH (JWT)
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
// ROLE CHECK
// =====================================

if (!isset($user->role) || $user->role !== 'owner') {
    response(false, "Only owners can create workspaces", null, "ACCESS_DENIED", 403);
}

$owner_id = $user->id;


// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Method not allowed", null, "METHOD_NOT_ALLOWED", 405);
}


// =====================================
// GET FORM DATA (NOT JSON)
// =====================================

$workspace_name = $_POST['workspace_name'] ?? null;
$description = $_POST['description'] ?? null;
$city = $_POST['city'] ?? null;
$area = $_POST['area'] ?? null;
$internet = $_POST['internet'] ?? null;
$electricity = $_POST['electricity'] ?? null;
$seating = $_POST['seating'] ?? null;
$hours_from = $_POST['hours_from'] ?? null;
$hours_to = $_POST['hours_to'] ?? null;
$quietness = $_POST['quietness'] ?? null;
$ladies_area = $_POST['ladies_area'] ?? null;
$price = $_POST['price'] ?? null;
$whatsapp = $_POST['whatsapp'] ?? null;


// =====================================
// VALIDATION
// =====================================

if (
    !$workspace_name || !$description || !$city || !$area ||
    !$internet || !$electricity || !$seating ||
    !$hours_from || !$hours_to || !$quietness ||
    !$ladies_area || !$price || !$whatsapp
) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}


// Internet ENUM
$internet_quality = match ($internet) {
    'Very Fast' => 'very_fast',
    'Fast' => 'fast',
    'Good' => 'good',
    default => 'good'
};


//  Electricity 
$electricity_status = match ($electricity) {
    'Available' => 'available',
    '24/7' => '24_7',
    'Backup Available' => 'backup',
    default => 'available'
};


// Quietness ENUM
$quietness = match ($quietness) {
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
// INSERT WORKSPACE
// =====================================

$stmt = $conn->prepare("
INSERT INTO workspaces (
    owner_id,
    workspace_name,
    description,
    city,
    area,
    internet_quality,
    electricity_status,
    seating,
    hours_from,
    hours_to,
    quietness_level,
    ladies_area,
    price_per_hour,
    whatsapp
)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
");

$stmt->execute([
    $owner_id,
    $workspace_name,
    $description,
    $city,
    $area,
    $internet_quality,
    $electricity_status,
    $seating,
    $hours_from,
    $hours_to,
    $quietness,
    $ladies_area,
    $price_per_hour,
    $whatsapp
]);

$workspace_id = $conn->lastInsertId();


// =====================================
// UPLOAD IMAGES ($_FILES)
// =====================================

$uploadDir = __DIR__ . "/../../uploads/";

if (!isset($_FILES['images'])) {
    response(false, "Images required", null, "NO_IMAGES", 422);
}

$images = $_FILES['images'];

$fileCount = is_array($images['name']) ? count($images['name']) : 1;

if ($fileCount > 5) {
    response(false, "Maximum 5 images allowed", null, "MAX_IMAGES", 422);
}

$allowed = ['jpg', 'jpeg', 'png', 'webp'];

for ($i = 0; $i < $fileCount; $i++) {

    $name = is_array($images['name']) ? $images['name'][$i] : $images['name'];
    $tmp  = is_array($images['tmp_name']) ? $images['tmp_name'][$i] : $images['tmp_name'];

    if (!$tmp) continue;

    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        response(false, "Invalid image type", null, "INVALID_FILE", 422);
    }

    $fileName = time() . "_" . $i . "." . $ext;

    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($tmp, $targetPath)) {
        response(false, "Failed to upload image", null, "UPLOAD_FAILED", 500);
    }

    $imgStmt = $conn->prepare("
        INSERT INTO workspace_images (workspace_id, image_path)
        VALUES (?, ?)
    ");

    $imgStmt->execute([$workspace_id, $fileName]);
}


// =====================================
// SUCCESS
// =====================================

response(true, "Workspace created successfully", [
    "workspace_id" => $workspace_id
], null, 201);
