<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Delete a workspace (owner only, must own the workspace)
// Steps:
// - Validate JWT token
// - Check role = owner
// - Get workspace_id
// - Verify ownership
// - Delete workspace (images/reviews/favorites cascade via FK)
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
// AUTH (JWT)
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
// ROLE CHECK
// =====================================

if (!isset($user->role) || $user->role !== 'owner') {
    response(false, "Only owners can delete workspaces", null, "ACCESS_DENIED", 403);
}

$owner_id = $user->id;


// =====================================
// GET WORKSPACE ID (JSON or form-data)
// =====================================

$workspace_id = $_POST['workspace_id'] ?? null;

if (!$workspace_id) {
    $data = json_decode(file_get_contents("php://input"), true);
    $workspace_id = $data['workspace_id'] ?? null;
}

if (!$workspace_id) {
    response(false, "Workspace id required", null, "VALIDATION_ERROR", 422);
}


// =====================================
// CHECK OWNERSHIP
// =====================================

$check = $conn->prepare("SELECT id FROM workspaces WHERE id = ? AND owner_id = ?");
$check->execute([$workspace_id, $owner_id]);

if (!$check->fetch()) {
    response(false, "Workspace not found", null, "NOT_FOUND", 404);
}


// =====================================
// DELETE (images / reviews / favorites cascade)
// =====================================

$delete = $conn->prepare("DELETE FROM workspaces WHERE id = ? AND owner_id = ?");
$delete->execute([$workspace_id, $owner_id]);


// =====================================
// SUCCESS
// =====================================

response(true, "Workspace deleted successfully", [
    "workspace_id" => $workspace_id
], null, 200);
