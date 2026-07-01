<?php
// API Endpoint: Update user profile

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/env.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();

/* =====================
   1. AUTH (JWT)
===================== */

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid token", null, "INVALID_TOKEN", 401);
}

$userId = $decoded->id;

/* =====================
   INPUT
===================== */

$input = $_POST;

if (empty($input)) {
    $raw = file_get_contents("php://input");
    $json = json_decode($raw, true);
    if (is_array($json)) {
        $input = $json;
    }
}

/* =====================
   FETCH USER
===================== */

$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    response(false, "User not found", null, "NOT_FOUND", 404);
}

/* =====================
   PASSWORD UPDATE (optional)
===================== */

$current_password = $input['current_password'] ?? null;
$new_password = $input['new_password'] ?? null;
$confirm_new_password = $input['confirm_new_password'] ?? null;

if ($current_password || $new_password || $confirm_new_password) {

    if (!$current_password || !$new_password || !$confirm_new_password) {
        response(false, "Missing password fields", null, "MISSING_FIELDS", 422);
    }

    if (!password_verify($current_password, $user['password'])) {
        response(false, "Current password is incorrect", null, "WRONG_PASSWORD", 400);
    }

    if ($new_password !== $confirm_new_password) {
        response(false, "Passwords do not match", null, "PASSWORD_MISMATCH", 400);
    }

    if (strlen($new_password) < 8) {
        response(false, "Password too short", null, "WEAK_PASSWORD", 400);
    }

    if (!preg_match("/[A-Z]/", $new_password)) {
        response(false, "Must contain uppercase letter", null, "WEAK_PASSWORD", 400);
    }

    if (!preg_match("/[0-9]/", $new_password)) {
        response(false, "Must contain number", null, "WEAK_PASSWORD", 400);
    }

    $hashed = password_hash($new_password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashed, $userId]);
}

/* =====================
   UPDATE NAME + AVATAR
===================== */

$fields = [];
$params = [];

/* NAME */
if (!empty($input['name'])) {
    $fields[] = "name = ?";
    $params[] = $input['name'];
}

/* AVATAR */
if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {

    $uploadDir = __DIR__ . "/../../uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $file = $_FILES['avatar'];

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = "user_" . $userId . "_" . time() . "." . $ext;

    $target = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        response(false, "Upload failed", null, "UPLOAD_FAILED", 500);
    }

    $fields[] = "avatar = ?";
    $params[] = $fileName;
}
/* =====================
   EXECUTE UPDATE (IMPORTANT FIX)
===================== */

if (!empty($fields)) {

    $params[] = $userId;

    $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
}

/* =====================
   GET UPDATED USER
===================== */

$stmt = $conn->prepare("SELECT id, name, email, avatar FROM users WHERE id = ?");
$stmt->execute([$userId]);
$updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
$baseUrl = BASE_URL;

$updatedUser['avatar'] = $updatedUser['avatar']
    ? $baseUrl . $updatedUser['avatar']
    : null;

/* =====================
   RESPONSE
===================== */
response(true, "Profile updated successfully", [
    "user" => $updatedUser
], null, 200);
