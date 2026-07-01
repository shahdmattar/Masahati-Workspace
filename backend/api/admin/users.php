<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: Admin - list users (GET) / update a user's role (POST)
// Steps:
// - Validate JWT token
// - Check role = admin
// - GET: list all users with workspace count for owners
// - POST: update target user's role (admin/owner/user)
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
// POST: UPDATE ROLE
// =====================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true) ?? [];

    $targetId = $data['user_id'] ?? null;
    $newRole  = $data['role'] ?? null;

    $allowedRoles = ['user', 'owner', 'admin'];

    if (!$targetId || !$newRole) {
        response(false, "Missing fields", null, "MISSING_FIELDS", 422);
    }

    if (!in_array($newRole, $allowedRoles)) {
        response(false, "Invalid role", null, "INVALID_ROLE", 422);
    }

    $check = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $check->execute([$targetId]);

    if (!$check->fetch()) {
        response(false, "User not found", null, "NOT_FOUND", 404);
    }

    $update = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
    $update->execute([$newRole, $targetId]);

    response(true, "User role updated successfully", [
        "user_id" => (int)$targetId,
        "role"    => $newRole
    ], null, 200);
}


// =====================================
// GET: LIST USERS
// =====================================

$stmt = $conn->prepare("
    SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar,
        u.created_at,
        (SELECT COUNT(*) FROM workspaces w WHERE w.owner_id = u.id) AS workspace_count
    FROM users u
    ORDER BY u.created_at DESC
");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

foreach ($users as &$u) {
    $u['workspace_count'] = (int)$u['workspace_count'];
    $u['avatar'] = $u['avatar'] ? $baseUrl . $u['avatar'] : null;
}

response(true, "Users fetched successfully", $users, null, 200);
