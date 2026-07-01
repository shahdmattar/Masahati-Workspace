<?php
// API Endpoint: Get workspace reviews + average rating
// Steps:
// - Validate request method (GET)
// - Get workspace_id from query
// - Fetch all reviews with user info
// - Calculate average rating
// - Return response

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();


// =====================
// 1. METHOD CHECK
// =====================
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    response(false, "Method not allowed", null, "METHOD_NOT_ALLOWED", 405);
}


// =====================
// 2. GET WORKSPACE ID
// =====================
$workspaceId = $_GET['workspace_id'] ?? null;

if (!$workspaceId || !is_numeric($workspaceId)) {
    response(false, "Workspace id required", null, "VALIDATION_ERROR", 422);
}


// =====================
// 3. GET REVIEWS
// =====================
$stmt = $conn->prepare("
    SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.id AS user_id,
        u.name,
        u.avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.workspace_id = ?
    ORDER BY r.created_at DESC
");

$stmt->execute([$workspaceId]);

$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);


// =====================
// 4. CALCULATE AVERAGE RATING
// =====================
$stmt = $conn->prepare("
    SELECT 
        AVG(rating) AS avg_rating,
        COUNT(*) AS total_reviews
    FROM reviews
    WHERE workspace_id = ?
");

$stmt->execute([$workspaceId]);

$stats = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================
// 5. RESPONSE
// =====================
response(
    true,
    "Workspace reviews fetched successfully",
    [
        "average_rating" => round((float)$stats['avg_rating'], 1),
        "total_reviews" => (int)$stats['total_reviews'],
        "reviews" => $reviews
    ],
    null,
    200
);