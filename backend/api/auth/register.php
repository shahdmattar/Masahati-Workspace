<?php

ob_start(); // buffer output so stray PHP warnings never break the JSON response
// Shows all PHP errors  for debugging
error_reporting(E_ALL);
// sets response type to JSON
header("Content-Type: application/json");

// Loads database connection and CORS settings
require_once "../config/Database.php";
require_once "../config/cors.php";
require_once "../helpers/response.php";

// Creates database connection object
$conn = (new Database())->getConnection();

// Read raw JSON from request body and convert it to PHP array
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
// Stops if JSON is invalid
if (!$data) {
    response(false, "Invalid JSON", null, "INVALID_JSON", 400);
}

// Get fields
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$confirm_password = $data['confirm_password'] ?? null;

// Ensures all fields are filled
if (!$name || !$email || !$password || !$confirm_password) {
    response(false, "Missing fields", null, "MISSING_FIELDS", 422);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(false, "Invalid email format", null, "INVALID_EMAIL", 422);
}

// Passwords must be identical
if ($password !== $confirm_password) {
    response(false, "Passwords do not match", null, "PASSWORD_MISMATCH", 422);
}

// Minimum 8 characters required
if (strlen($password) < 8) {
    response(false, "Password must be at least 8 characters", null, "WEAK_PASSWORD", 422);
}

//Password strength check 
// Must contain uppercase + number
if (!preg_match("/[A-Z]/", $password)) {
    response(false, "Password must contain at least one uppercase letter", null, "WEAK_PASSWORD", 422);
}

if (!preg_match("/[0-9]/", $password)) {
    response(false, "Password must contain at least one number", null, "WEAK_PASSWORD", 422);
}

// Checks if email already exists in DB
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);

if ($check->fetch()) {
    response(false, "Email already exists", null, "EMAIL_EXISTS", 409);
}

// Encrypts password before saving
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Sets role based on request
$role = !empty($data['is_owner']) ? "owner" : "user";

//Insert user 
$sql = "INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

// Success response
if ($stmt->execute([$name, $email, $hashedPassword, $role])) {
    response(true, "Account created successfully", [
        "name" => $name,
        "email" => $email,
        "role" => $role,
        "avatar" => "avatar.png"
    ], null, 201);
} else {
    response(false, "Registration failed", null, "REGISTER_FAILED", 500);
}
