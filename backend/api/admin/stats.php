<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get admin dashboard stats
// Steps:
// - Validate JWT token
// - Check role = admin
// - Count total users, total owners, total workspaces, pending approvals, total reviews
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
// USERS / OWNERS
// =====================================

$stmt = $conn->prepare("
    SELECT
        COUNT(*)              AS total_users,
        SUM(role = 'owner')   AS total_owners,
        SUM(role = 'admin')   AS total_admins
    FROM users
");
$stmt->execute();
$userStats = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================================
// WORKSPACES
// =====================================

$stmt = $conn->prepare("
    SELECT
        COUNT(*)                 AS total_workspaces,
        SUM(status = 'pending')  AS pending_approvals,
        SUM(status = 'approved') AS approved_workspaces,
        SUM(status = 'rejected') AS rejected_workspaces
    FROM workspaces
");
$stmt->execute();
$workspaceStats = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================================
// REVIEWS
// =====================================

$stmt = $conn->prepare("SELECT COUNT(*) AS total_reviews FROM reviews");
$stmt->execute();
$reviewStats = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================================
// RESPONSE
// =====================================

response(true, "Admin stats fetched successfully", [
    "total_users"         => (int)$userStats['total_users'],
    "total_owners"        => (int)$userStats['total_owners'],
    "total_admins"        => (int)$userStats['total_admins'],
    "total_workspaces"    => (int)$workspaceStats['total_workspaces'],
    "pending_approvals"   => (int)$workspaceStats['pending_approvals'],
    "approved_workspaces" => (int)$workspaceStats['approved_workspaces'],
    "rejected_workspaces" => (int)$workspaceStats['rejected_workspaces'],
    "total_reviews"       => (int)$reviewStats['total_reviews'],
], null, 200);
