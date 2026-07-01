<?php
// API Endpoint: Delete user review
// Steps:
// - Validate JWT token
// - Extract user ID
// - Get workspace_id
// - Delete user's review for that workspace
// - Return response

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();


// =====================
// 1. TOKEN
// =====================
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


// =====================
// 2. GET DATA
// =====================
$data = json_decode(file_get_contents("php://input"), true);

$workspaceId = $data['workspace_id'] ?? null;

if (!$workspaceId) {
    response(false, "Workspace id required", null, "VALIDATION_ERROR", 422);
}


// =====================
// 3. DELETE REVIEW (ONLY OWNER)
// =====================
$stmt = $conn->prepare("
    DELETE FROM reviews
    WHERE user_id = ? AND workspace_id = ?
");

$stmt->execute([$userId, $workspaceId]);

// check if anything deleted
if ($stmt->rowCount() === 0) {
    response(false, "Review not found", null, "NOT_FOUND", 404);
}


// =====================
// 4. RESPONSE
// =====================
response(
    true,
    "Review deleted successfully",
    null,
    null,
    200
);