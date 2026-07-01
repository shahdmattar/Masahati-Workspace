<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get logged-in owner's dashboard stats
// Steps:
// - Validate JWT token
// - Check role = owner
// - Count workspaces by status (total / pending / approved / rejected)
// - Count total reviews + average rating across owner's workspaces
// - Return response

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt  = new JwtHandler();


// =====================
// 1. AUTH (JWT)
// =====================
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token   = str_replace("Bearer ", "", $headers['Authorization']);
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid or expired token", null, "INVALID_TOKEN", 401);
}


// =====================
// 2. ROLE CHECK
// =====================
if (!isset($decoded->role) || $decoded->role !== 'owner') {
    response(false, "Access denied", null, "FORBIDDEN", 403);
}

$ownerId = $decoded->id;


// =====================
// 3. WORKSPACE COUNTS BY STATUS
// =====================
$stmt = $conn->prepare("
    SELECT
        COUNT(*) AS total,
        SUM(status = 'pending')  AS pending,
        SUM(status = 'approved') AS approved,
        SUM(status = 'rejected') AS rejected
    FROM workspaces
    WHERE owner_id = ?
");
$stmt->execute([$ownerId]);
$counts = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================
// 4. REVIEWS + AVERAGE RATING
// =====================
$stmt = $conn->prepare("
    SELECT
        COUNT(r.id)      AS total_reviews,
        AVG(r.rating)    AS avg_rating
    FROM reviews r
    JOIN workspaces w ON r.workspace_id = w.id
    WHERE w.owner_id = ?
");
$stmt->execute([$ownerId]);
$reviewStats = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================
// 5. RESPONSE
// =====================
response(true, "Owner stats fetched successfully", [
    "total_workspaces"    => (int)$counts['total'],
    "pending_workspaces"  => (int)$counts['pending'],
    "approved_workspaces" => (int)$counts['approved'],
    "rejected_workspaces" => (int)$counts['rejected'],
    "total_reviews"       => (int)$reviewStats['total_reviews'],
    "average_rating"      => $reviewStats['avg_rating'] ? round((float)$reviewStats['avg_rating'], 1) : 0,
], null, 200);
