<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

set_exception_handler(function ($e) {
    response(false, "Server error: " . $e->getMessage(), null, "SERVER_ERROR", 500);
});

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


// =====================================
// CITY / AREA VALIDATION
// =====================================

$areasData = [
    "North"  =>  ["All", "Jabalia", "Beit Lahia", "Beit Hanoun", "Tal Al-Hawa", "Sheikh Radwan", "Al-Saftawi", "Al-Rimal", "Al-Saraya", "Salah Al-Din Street"],
    "Center" => ["Nuseirat", "Deir Al-Balah", "Bureij", "Maghazi", "Zawaida"],
    "South"  => ["Khan Younis", "Rafah", "Mawasi Khan Younis", "Mawasi Al-Qarara"],
];

if (!array_key_exists($city, $areasData)) {
    response(false, "Invalid city", null, "INVALID_CITY", 422);
}

if (!in_array($area, $areasData[$city])) {
    response(false, "Invalid area for selected city", null, "INVALID_AREA", 422);
}


// =====================================
// INTERNET QUALITY
// =====================================

$allowedInternet = ['Very Fast', 'Fast', 'Good'];

if (!in_array($internet, $allowedInternet)) {
    response(false, "Invalid internet quality", null, "INVALID_INTERNET", 422);
}

$internet_quality = $internet;


// =====================================
// ELECTRICITY STATUS
// =====================================

$allowedElectricity = ['Available', '24/7', 'Backup Available'];

if (!in_array($electricity, $allowedElectricity)) {
    response(false, "Invalid electricity status", null, "INVALID_ELECTRICITY", 422);
}

$electricity_status = $electricity;


// =====================================
// QUIETNESS LEVEL
// =====================================

$allowedQuietness = ['very_quiet', 'quiet', 'normal'];

if (!in_array($quietness, $allowedQuietness)) {
    response(false, "Invalid quietness level", null, "INVALID_QUIETNESS", 422);
}

$quietness_level = $quietness;


// =====================================
// LADIES AREA
// =====================================

if ($ladies_area !== 'Available' && $ladies_area !== 'Not Available') {
    response(false, "Invalid ladies area value", null, "INVALID_LADIES_AREA", 422);
}

$ladies_area = ($ladies_area === 'Available') ? 1 : 0;


// =====================================
// PRICE
// =====================================

$price_per_hour = $price;


// =====================================
// INSERT WORKSPACE
// =====================================

try {
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
        $quietness_level,
        $ladies_area,
        $price_per_hour,
        $whatsapp
    ]);

    $workspace_id = $conn->lastInsertId();
} catch (PDOException $e) {
    response(false, "Database error while creating workspace: " . $e->getMessage(), null, "DB_ERROR", 500);
}


// =====================================
// UPLOAD IMAGES ($_FILES)
// =====================================

$uploadDir = __DIR__ . "/../../uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['images'])) {
    response(false, "Images required", null, "NO_IMAGES", 422);
}

$images = $_FILES['images'];

$fileCount = is_array($images['name']) ? count($images['name']) : 1;

if ($fileCount > 5) {
    response(false, "Maximum 5 images allowed", null, "MAX_IMAGES", 422);
}

$allowed = ['jpg', 'jpeg', 'png', 'webp'];

try {
    for ($i = 0; $i < $fileCount; $i++) {

        $name = is_array($images['name']) ? $images['name'][$i] : $images['name'];
        $tmp  = is_array($images['tmp_name']) ? $images['tmp_name'][$i] : $images['tmp_name'];

        $errorCode = is_array($images['error']) ? $images['error'][$i] : $images['error'];

        if ($errorCode !== UPLOAD_ERR_OK) {
            response(false, "Image upload error (PHP code {$errorCode}) for file: {$name}", null, "UPLOAD_ERROR_CODE", 422);
        }

        if (!$tmp) continue;

        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            response(false, "Invalid image type", null, "INVALID_FILE", 422);
        }

        $fileName = time() . "_" . $i . "." . $ext;

        $targetPath = $uploadDir . $fileName;

        if (!is_dir($uploadDir)) {
            response(false, "Upload folder does not exist: {$uploadDir}", null, "UPLOAD_DIR_MISSING", 500);
        }

        if (!is_writable($uploadDir)) {
            response(false, "Upload folder is not writable: {$uploadDir}", null, "UPLOAD_DIR_NOT_WRITABLE", 500);
        }

        if (!move_uploaded_file($tmp, $targetPath)) {
            $lastError = error_get_last();
            $detail = $lastError ? $lastError['message'] : 'unknown reason';
            response(false, "Failed to upload image ({$name}): {$detail}", null, "UPLOAD_FAILED", 500);
        }

        $imgStmt = $conn->prepare("
            INSERT INTO workspace_images (workspace_id, image_path)
            VALUES (?, ?)
        ");

        $imgStmt->execute([$workspace_id, $fileName]);
    }
} catch (PDOException $e) {
    response(false, "Database error while saving images: " . $e->getMessage(), null, "DB_ERROR", 500);
}


// =====================================
// SUCCESS
// =====================================

response(true, "Workspace created successfully", [
    "workspace_id" => $workspace_id
], null, 201);
