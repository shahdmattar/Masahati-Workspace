<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Get logged-in user stats (favorites count + reviews written count)

error_reporting(E_ALL);
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();

/* =====================
   1. AUTH (JWT)
===================== */

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid or expired token", null, "INVALID_TOKEN", 401);
}

$userId = $decoded->id;

/* =====================
   2. COUNT FAVORITES
===================== */

$stmt = $conn->prepare("SELECT COUNT(*) FROM favorites WHERE user_id = ?");
$stmt->execute([$userId]);
$favoritesCount = (int) $stmt->fetchColumn();

/* =====================
   3. COUNT REVIEWS WRITTEN
===================== */

$stmt = $conn->prepare("SELECT COUNT(*) FROM reviews WHERE user_id = ?");
$stmt->execute([$userId]);
$reviewsCount = (int) $stmt->fetchColumn();

/* =====================
   4. RESPONSE
===================== */

response(true, "Stats fetched successfully", [
    "favorites_count" => $favoritesCount,
    "reviews_count" => $reviewsCount
], null, 200);
