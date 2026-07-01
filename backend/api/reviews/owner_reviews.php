<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get all reviews for workspaces owned by the logged-in owner
// Steps:
// - Validate JWT token
// - Check role = owner
// - Fetch all reviews for this owner's workspaces
// - Return reviews with workspace name and user info

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt  = new JwtHandler();


// =====================
// 1. TOKEN
// =====================
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token   = str_replace("Bearer ", "", $headers['Authorization']);
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid token", null, "INVALID_TOKEN", 401);
}

if ($decoded->role !== 'owner') {
    response(false, "Access denied", null, "ACCESS_DENIED", 403);
}

$ownerId = $decoded->id;


// =====================
// 2. FETCH REVIEWS
// =====================
$stmt = $conn->prepare("
    SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.id   AS user_id,
        u.name AS user_name,
        u.avatar,
        w.id   AS workspace_id,
        w.workspace_name,
        w.city,
        w.area,
        (SELECT wi.image_path FROM workspace_images wi
            WHERE wi.workspace_id = w.id ORDER BY wi.id ASC LIMIT 1) AS workspace_image
    FROM reviews r
    JOIN users      u ON r.user_id      = u.id
    JOIN workspaces w ON r.workspace_id = w.id
    WHERE w.owner_id = ?
    ORDER BY r.created_at DESC
");

$stmt->execute([$ownerId]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

$uploadsBaseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";
foreach ($reviews as &$rev) {
    $rev['workspace_image'] = $rev['workspace_image']
        ? $uploadsBaseUrl . $rev['workspace_image']
        : null;
}
unset($rev);


// =====================
// 3. STATS
// =====================
$statsStmt = $conn->prepare("
    SELECT
        COUNT(*)        AS total_reviews,
        AVG(r.rating)   AS avg_rating,
        SUM(r.rating=5) AS five_star,
        SUM(r.rating=4) AS four_star,
        SUM(r.rating=3) AS three_star,
        SUM(r.rating=2) AS two_star,
        SUM(r.rating=1) AS one_star
    FROM reviews r
    JOIN workspaces w ON r.workspace_id = w.id
    WHERE w.owner_id = ?
");
$statsStmt->execute([$ownerId]);
$stats = $statsStmt->fetch(PDO::FETCH_ASSOC);


// =====================
// 3b. ALL OWNER WORKSPACES (for the filter dropdown, even ones with no reviews yet)
// =====================
$wsStmt = $conn->prepare("
    SELECT id AS workspace_id, workspace_name
    FROM workspaces
    WHERE owner_id = ? AND status = 'approved'
    ORDER BY workspace_name ASC
");
$wsStmt->execute([$ownerId]);
$workspaces = $wsStmt->fetchAll(PDO::FETCH_ASSOC);


// =====================
// 4. RESPONSE
// =====================
response(true, "Owner reviews fetched successfully", [
    "stats"      => [
        "total_reviews" => (int)$stats['total_reviews'],
        "avg_rating"    => round((float)$stats['avg_rating'], 1),
        "five_star"     => (int)$stats['five_star'],
        "four_star"     => (int)$stats['four_star'],
        "three_star"    => (int)$stats['three_star'],
        "two_star"      => (int)$stats['two_star'],
        "one_star"      => (int)$stats['one_star'],
    ],
    "reviews"    => $reviews,
    "workspaces" => $workspaces,
], null, 200);
