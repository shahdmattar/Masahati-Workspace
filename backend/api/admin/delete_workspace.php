<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Admin - delete any workspace by id (moderation)
// Steps:
// - Validate JWT token
// - Check role = admin
// - Get workspace_id
// - Delete workspace (cascades to images/reviews/favorites)
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
// GET WORKSPACE ID
// =====================================

$data = json_decode(file_get_contents("php://input"), true) ?? [];
$workspaceId = $data['workspace_id'] ?? ($_POST['workspace_id'] ?? null);

if (!$workspaceId) {
    response(false, "Workspace id required", null, "VALIDATION_ERROR", 422);
}


// =====================================
// DELETE
// =====================================

$stmt = $conn->prepare("DELETE FROM workspaces WHERE id = ?");
$stmt->execute([$workspaceId]);

if ($stmt->rowCount() === 0) {
    response(false, "Workspace not found", null, "NOT_FOUND", 404);
}

response(true, "Workspace deleted successfully", null, null, 200);
