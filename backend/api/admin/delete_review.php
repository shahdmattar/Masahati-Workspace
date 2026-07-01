<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Admin - delete any review by id (moderation)
// Steps:
// - Validate JWT token
// - Check role = admin
// - Get review_id
// - Delete review
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
// GET REVIEW ID
// =====================================

$data = json_decode(file_get_contents("php://input"), true) ?? [];
$reviewId = $data['review_id'] ?? ($_POST['review_id'] ?? null);

if (!$reviewId) {
    response(false, "Review id required", null, "VALIDATION_ERROR", 422);
}


// =====================================
// DELETE
// =====================================

$stmt = $conn->prepare("DELETE FROM reviews WHERE id = ?");
$stmt->execute([$reviewId]);

if ($stmt->rowCount() === 0) {
    response(false, "Review not found", null, "NOT_FOUND", 404);
}

response(true, "Review deleted successfully", null, null, 200);
