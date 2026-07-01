<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();


// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    response(false, "Method not allowed", null, "METHOD_NOT_ALLOWED", 405);
}


// =====================================
// GET WORKSPACE ID
// =====================================

$workspace_id = $_GET['workspace_id'] ?? null;

if (!$workspace_id || !is_numeric($workspace_id)) {
    response(false, "Invalid Workspace ID", null, "WORKSPACE_ID_REQUIRED", 422);
}


// =====================================
// GET WORKSPACE (PUBLIC)
// =====================================

$stmt = $conn->prepare("
SELECT 
    id,
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
    whatsapp,
    created_at
FROM workspaces
WHERE id = ?
");

$stmt->execute([$workspace_id]);

$workspace = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$workspace) {
    response(false, "Workspace not found", null, "NOT_FOUND", 404);
}


// =====================================
// GET IMAGES
// =====================================

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

$imgStmt = $conn->prepare("
SELECT id, image_path
FROM workspace_images
WHERE workspace_id = ?
");

$imgStmt->execute([$workspace_id]);

$images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

if (!empty($images)) {
    foreach ($images as &$img) {
        $img['image_path'] = $baseUrl . $img['image_path'];
    }
}

$workspace['images'] = $images;


// =====================================
// GET RATING
// =====================================

$ratingStmt = $conn->prepare("
SELECT 
    AVG(rating) AS avg_rating,
    COUNT(*) AS total_reviews
FROM reviews
WHERE workspace_id = ?
");

$ratingStmt->execute([$workspace_id]);

$rating = $ratingStmt->fetch(PDO::FETCH_ASSOC);

$workspace['rating'] = [
    "average" => $rating['avg_rating'] ? round((float)$rating['avg_rating'], 1) : 0,
    "total_reviews" => (int)$rating['total_reviews']
];


// =====================================
// GET REVIEWS
// =====================================

$reviewsStmt = $conn->prepare("
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

$reviewsStmt->execute([$workspace_id]);

$reviews = $reviewsStmt->fetchAll(PDO::FETCH_ASSOC);

$workspace['reviews'] = $reviews;


// =====================================
// SUCCESS RESPONSE
// =====================================

response(true, "Workspace fetched successfully", [
    "workspace" => $workspace
], null, 200);
