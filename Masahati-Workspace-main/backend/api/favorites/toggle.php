<?php
// API Endpoint: Toggle workspace favorite (Add or Remove)
// Steps:
// - Validate JWT token
// - Extract user ID
// - Read workspace_id from request
// - Check if favorite exists
// - If exists → remove it
// - If not exists → add it
// - Return JSON response

require_once "../config/Database.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();
// =====================
// 1. TOKEN
// Retrieve Authorization header and extract JWT token
// =====================
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    response(false, "No token provided", null, "NO_TOKEN", 401);
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
// =====================
// 2. VALIDATE TOKEN
// Validate JWT token and get user data
// =====================
$decoded = $jwt->validate($token);

if (!$decoded) {
    response(false, "Invalid token", null, "INVALID_TOKEN", 401);
}

$userId = $decoded->id;

// =====================
// 3. GET DATA
// Parse request body and get workspace_id
// =====================
$input = file_get_contents("php://input");
$data = json_decode($input, true);
$workspaceId = $data['workspace_id'] ?? null;

if (!$workspaceId) {
    response(false, "Workspace id required", null, "VALIDATION_ERROR", 422);
}
// =====================
// 4. Check if workspace is already in user favorites
// =====================
$stmt = $conn->prepare("
    SELECT id 
    FROM favorites 
    WHERE user_id = ? AND workspace_id = ?
");

$stmt->execute([$userId, $workspaceId]);

$favorite = $stmt->fetch(PDO::FETCH_ASSOC);


// =====================
// 5. TOGGLE LOGIC
// =====================

// If favorite exists → remove it
if ($favorite) {

    $stmt = $conn->prepare("
        DELETE FROM favorites 
        WHERE user_id = ? AND workspace_id = ?
    ");

    $stmt->execute([$userId, $workspaceId]);

    response(
        true,
        "Removed from favorites",
        ["status" => "removed"],
        null,
        200
    );
}


// If not exists → add it
$stmt = $conn->prepare("
    INSERT INTO favorites (user_id, workspace_id)
    VALUES (?, ?)
");
// Insert new favorite
$stmt->execute([$userId, $workspaceId]);

response(
    true,
    "Added to favorites",
    ["status" => "added"],
    null,
    201
);