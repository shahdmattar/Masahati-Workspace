<?php
// API Endpoint: Add review (rating + comment)
// Steps:
// - Validate JWT token
// - Extract user ID
// - Get workspace_id, rating, comment
// - Insert review only (no update)
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
$rating = $data['rating'] ?? null;
$comment = $data['comment'] ?? null;

if (!$workspaceId || !$rating) {
    response(false, "Missing required fields", null, "VALIDATION_ERROR", 422);
}

if ($rating < 1 || $rating > 5) {
    response(false, "Rating must be 1-5", null, "INVALID_RATING", 422);
}


// =====================
// 3. INSERT ONLY REVIEW
// =====================
$stmt = $conn->prepare("
    INSERT INTO reviews (user_id, workspace_id, rating, comment)
    VALUES (?, ?, ?, ?)
");

try {
    $stmt->execute([$userId, $workspaceId, $rating, $comment]);

    response(true, "Review added successfully", null, null, 201);
} catch (PDOException $e) {

    // if duplicate review exists
    if ($e->getCode() == 23000) {
        response(false, "You already reviewed this workspace", null, "DUPLICATE_REVIEW", 409);
    }

    response(false, "Server error", null, "SERVER_ERROR", 500);
}