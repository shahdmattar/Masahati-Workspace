<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// API Endpoint: User registration
// Steps:
// - Validate input JSON
// - Validate required fields
// - Check email format
// - Check password rules
// - Check duplicate email
// - Hash password
// - Insert user into database

// Shows all PHP errors for debugging
error_reporting(E_ALL);

// Sets response type to JSON
header("Content-Type: application/json");

// Loads database connection and CORS settings
require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../helpers/response.php";

// Creates database connection object
$conn = (new Database())->getConnection();

// Read raw JSON from request body and convert it to PHP array
$data = json_decode(file_get_contents("php://input"), true);


// =====================
// 1. VALIDATE INPUT
// =====================

// Validate JSON
if (!$data) {
    response(false, "Invalid JSON", null, "INVALID_JSON", 400);
}

// Get fields
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$confirm_password = $data['confirm_password'] ?? null;

// Check required fields
if (!$name || !$email || !$password || !$confirm_password) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}


// =====================
// 2. VALIDATION RULES
// =====================

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(false, "Invalid email format", null, "INVALID_EMAIL", 422);
}

// Check password match
if ($password !== $confirm_password) {
    response(false, "Passwords do not match", null, "PASSWORD_MISMATCH", 422);
}

// Minimum password length
if (strlen($password) < 8) {
    response(false, "Password must be at least 8 characters", null, "WEAK_PASSWORD", 422);
}

// Password strength: uppercase letter
if (!preg_match("/[A-Z]/", $password)) {
    response(false, "Password must contain at least one uppercase letter", null, "WEAK_PASSWORD", 422);
}

// Password strength: number
if (!preg_match("/[0-9]/", $password)) {
    response(false, "Password must contain at least one number", null, "WEAK_PASSWORD", 422);
}


// =====================
// 3. CHECK EXISTING USER
// =====================

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);

if ($check->fetch()) {
    response(false, "Email already exists", null, "EMAIL_EXISTS", 409);
}


// =====================
// 4. CREATE USER
// =====================

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Set user role
$role = !empty($data['is_owner']) ? "owner" : "user";

// Insert user into database
$sql = "INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);


// =====================
// 5. RESPONSE
// =====================

// Execute insert
if ($stmt->execute([$name, $email, $hashedPassword, $role])) {

    // Success response
    response(true, "Account created successfully", [
        "name" => $name,
        "email" => $email,
        "role" => $role,
        "avatar" => "avatar.png"
    ], null, 201);
} else {

    // Failure response
    response(false, "Registration failed", null, "REGISTER_FAILED", 500);
}
