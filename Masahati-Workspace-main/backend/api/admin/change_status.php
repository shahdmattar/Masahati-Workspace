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


// =====================================
// ADMIN CHECK
// =====================================

if (!isset($user->role) || $user->role !== 'admin') {
    response(false, "Only admin allowed", null, "ACCESS_DENIED", 403);
}


// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Method not allowed", null, "METHOD_NOT_ALLOWED", 405);
}


// =====================================
// INPUT
// =====================================

$workspace_id = $_POST['workspace_id'] ?? null;
$status       = $_POST['status'] ?? null;


// =====================================
// VALIDATION
// =====================================

if (!$workspace_id || !$status) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}

$allowed = ['pending', 'approved', 'rejected'];

if (!in_array($status, $allowed)) {
    response(false, "Invalid status", null, "INVALID_STATUS", 422);
}


// =====================================
// CHECK WORKSPACE EXISTS
// =====================================

$check = $conn->prepare("SELECT id FROM workspaces WHERE id = ?");
$check->execute([$workspace_id]);

if (!$check->fetch()) {
    response(false, "Workspace not found", null, "NOT_FOUND", 404);
}


// =====================================
// UPDATE STATUS
// =====================================

$update = $conn->prepare("
    UPDATE workspaces 
    SET status = ?
    WHERE id = ?
");

$update->execute([$status, $workspace_id]);


// =====================================
// SUCCESS
// =====================================

response(true, "Status updated successfully", [
    "workspace_id" => $workspace_id,
    "status" => $status
], null, 200);
