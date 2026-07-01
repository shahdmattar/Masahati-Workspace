<?php
// API Endpoint: User login
// Steps:
// - Validate JSON input
// - Check required fields
// - Find user by email
// - Verify password
// - Generate JWT token
// - Return user data + token

// Shows all PHP errors for debugging
error_reporting(E_ALL);

// Sets response type to JSON
header("Content-Type: application/json");

// Loads database connection, CORS, JWT and helpers
require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";
require_once __DIR__ . '/../config/env.php';

// Creates database connection object and JWT handler
$conn = (new Database())->getConnection();
$jwt = new JwtHandler();


// =====================
// 1. READ INPUT
// =====================

// Read raw JSON from request body and convert it to PHP array
$data = json_decode(file_get_contents("php://input"), true);

// Validate JSON
if (!$data) {
    response(false, "Invalid JSON", null, "INVALID_JSON", 400);
}

// Get fields
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// Check required fields
if (!$email || !$password) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}


// =====================
// 2. FIND USER
// =====================

// Find user by email
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// User not found
if (!$user) {
    response(false, "Invalid credentials", null, "INVALID_CREDENTIALS", 401);
}


// =====================
// 3. VERIFY PASSWORD
// =====================

// Check password
if (!password_verify($password, $user['password'])) {
    response(false, "Invalid credentials", null, "INVALID_CREDENTIALS", 401);
}


// =====================
// 4. GENERATE TOKEN
// =====================

// Generate JWT
$token = $jwt->generate([
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email'],
    "role" => $user['role']
]);


// =====================
// 5. RESPONSE
// =====================

// Base URL for assets
$baseUrl = BASE_URL;

// Success response
response(true, "Login successful", [
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role'],
        "avatar" => $baseUrl . $user['avatar']
    ]
], null, 200);
