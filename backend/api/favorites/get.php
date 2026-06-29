<?php
// API Endpoint: Get user favorite workspaces
// Steps:
// - Validate JWT token
// - Extract user ID
// - Fetch all favorite workspaces for the user
// - Join with workspaces table to get full details
// - Fetch workspace images
// - Return JSON response

// Set headers explicitly to avoid issues
header("Content-Type: application/json");

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../config/jwt.php";
require_once "../helpers/response.php";

try {
    $conn = (new Database())->getConnection();
    // Enable PDO error exceptions just in case they are turned off
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $jwt = new JwtHandler();

    // =====================
    // 1. TOKEN
    // Retrieve Authorization header and extract JWT token
    // =====================
    $headers = getallheaders();

    $authHeader = $headers['Authorization']
        ?? $headers['authorization']
        ?? null;

    if (!$authHeader) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "No token provided",
            "code" => "NO_TOKEN"
        ]);
        exit;
    }

    $token = str_replace("Bearer ", "", $authHeader);

    // =====================
    // 2. VALIDATE TOKEN
    // Validate JWT token and get user data
    // =====================
    try {
        $decoded = $jwt->validate($token);
    } catch (Throwable $e) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Token validation failed",
            "error" => $e->getMessage()
        ]);
        exit;
    }

    if (!$decoded) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid token structure",
            "code" => "INVALID_TOKEN"
        ]);
        exit;
    }

    $userId = $decoded->id;

    // =====================
    // 3. GET FAVORITES (WITH WORKSPACE DATA)
    // Fetch all favorite workspaces for the user with correct database columns
    // =====================
    $stmt = $conn->prepare("
    SELECT 
        w.id,
        w.owner_id,
        w.workspace_name,
        w.city,
        w.area,
        w.internet_quality,
        w.electricity_status,
        w.seating,
        w.hours_from,
        w.hours_to,
        w.quietness_level,
        w.ladies_area,
        w.price_per_hour,
        w.whatsapp,
        w.created_at
    FROM favorites f
    JOIN workspaces w ON f.workspace_id = w.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
    ");

    $stmt->execute([$userId]);
    $workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // =====================
    // 4. ATTACH IMAGES
    // Fetch images for each workspace
    // =====================
    $baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

    foreach ($workspaces as &$workspace) {

        $imgStmt = $conn->prepare("
            SELECT id, image_path
            FROM workspace_images
            WHERE workspace_id = ?
        ");

        $imgStmt->execute([$workspace['id']]);
        $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($images as &$img) {
            $img['image_path'] = $baseUrl . $img['image_path'];
        }

        $workspace['images'] = $images;
    }

    // =====================
    // 5. RESPONSE
    // Return all favorite workspaces with full details and images
    // =====================

    // If your helper response() fails to echo, this standard output acts as a secure backup
    if (function_exists('response')) {
        response(true, "Favorites fetched successfully", $workspaces, null, 200);
    } else {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Favorites fetched successfully",
            "data" => $workspaces
        ]);
        exit;
    }
} catch (PDOException $e) {
    // Captures structural database failures (e.g. unknown columns, wrong table names)
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database execution failed",
        "error" => $e->getMessage()
    ]);
    exit;
} catch (Throwable $e) {
    // Captures any other general PHP errors or file path crashes
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "General server error occurred",
        "error" => $e->getMessage()
    ]);
    exit;
}
