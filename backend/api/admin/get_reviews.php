<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Admin - list all reviews across the platform (for moderation)
// Steps:
// - Validate JWT token
// - Check role = admin
// - Fetch all reviews with user + workspace info
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
// GET REVIEWS
// =====================================

$stmt = $conn->prepare("
    SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.id   AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.avatar,
        w.id   AS workspace_id,
        w.workspace_name,
        w.city,
        w.area
    FROM reviews r
    JOIN users      u ON r.user_id      = u.id
    JOIN workspaces w ON r.workspace_id = w.id
    ORDER BY r.created_at DESC
");
$stmt->execute();
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

if (!empty($reviews)) {
    $wsIds = array_unique(array_column($reviews, 'workspace_id'));
    $in = str_repeat('?,', count($wsIds) - 1) . '?';

    $imgStmt = $conn->prepare("
        SELECT workspace_id, MIN(image_path) AS image_path
        FROM workspace_images
        WHERE workspace_id IN ($in)
        GROUP BY workspace_id
    ");
    $imgStmt->execute(array_values($wsIds));
    $imgRows = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

    $imageMap = [];
    foreach ($imgRows as $row) {
        $imageMap[$row['workspace_id']] = $baseUrl . $row['image_path'];
    }

    foreach ($reviews as &$review) {
        $review['avatar'] = $review['avatar'] ? $baseUrl . $review['avatar'] : null;
        $review['workspace_image'] = $imageMap[$review['workspace_id']] ?? null;
    }
    unset($review);
}


// =====================================
// STATS
// =====================================

$statsStmt = $conn->prepare("
    SELECT
        COUNT(*)      AS total_reviews,
        AVG(rating)   AS avg_rating
    FROM reviews
");
$statsStmt->execute();
$stats = $statsStmt->fetch(PDO::FETCH_ASSOC);


// =====================================
// RESPONSE
// =====================================

response(true, "Reviews fetched successfully", [
    "stats" => [
        "total_reviews" => (int)$stats['total_reviews'],
        "avg_rating"    => $stats['avg_rating'] ? round((float)$stats['avg_rating'], 1) : 0,
    ],
    "reviews" => $reviews,
], null, 200);
