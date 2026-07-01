<?php
// ===============================
// API Endpoint: Home (FULL FIXED VERSION)
// Returns:
// - Platform stats
// - Top approved workspaces
// - Workspace images (array fixed)
// - Favorite state per user
// ===============================

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// ===============================
// IMPORTS
// ===============================
require_once "../config/Database.php";
require_once "../helpers/response.php";
require_once "../config/jwt.php";

$conn = (new Database())->getConnection();
$jwt = new JwtHandler();


// ===============================
// 0. GET USER (OPTIONAL)
// ===============================
$userId = null;

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

if ($authHeader) {
    $token = str_replace("Bearer ", "", $authHeader);

    try {
        $decoded = $jwt->validate($token);
        $userId = $decoded->id ?? null;
    } catch (Throwable $e) {
        $userId = null;
    }
}


// ===============================
// 1. PLATFORM STATS
// ===============================

// Total workspaces
$stmt = $conn->prepare("
    SELECT COUNT(*) AS total_workspaces 
    FROM workspaces 
    WHERE status = 'approved'
");
$stmt->execute();
$workspaces = $stmt->fetch(PDO::FETCH_ASSOC);

// Total users
$stmt = $conn->prepare("SELECT COUNT(*) AS total_users FROM users");
$stmt->execute();
$users = $stmt->fetch(PDO::FETCH_ASSOC);

// Average rating
$stmt = $conn->prepare("SELECT AVG(rating) AS avg_rating FROM reviews");
$stmt->execute();
$rating = $stmt->fetch(PDO::FETCH_ASSOC);

$avgRating = (float)($rating['avg_rating'] ?? 0);

// Satisfaction %
$stmt = $conn->prepare("
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE (SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) / COUNT(*)) * 100
        END AS satisfaction
    FROM reviews
");
$stmt->execute();

$satisfactionData = $stmt->fetch(PDO::FETCH_ASSOC);
$satisfaction = round((float)($satisfactionData['satisfaction'] ?? 0));


// ===============================
// 2. TOP WORKSPACES
// ===============================

$stmt = $conn->prepare("
    SELECT 
        w.id,
        w.workspace_name,
        w.city,
        w.area,
        w.internet_quality,
        w.electricity_status,
        w.seating,
        w.hours_from,
        w.hours_to,
        w.price_per_hour,

        AVG(r.rating) AS avg_rating,
        COUNT(r.id) AS total_reviews,

        CASE 
            WHEN :user_id IS NOT NULL 
            AND EXISTS (
                SELECT 1 
                FROM favorites f 
                WHERE f.workspace_id = w.id 
                AND f.user_id = :user_id
            )
            THEN 1 ELSE 0
        END AS is_favorite

    FROM workspaces w
    LEFT JOIN reviews r ON w.id = r.workspace_id
    WHERE w.status = 'approved'
    GROUP BY w.id
    ORDER BY avg_rating DESC
    LIMIT 4
");

$stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
$stmt->execute();

$topWorkspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);


// ===============================
// 3. WORKSPACE IMAGES (FIXED MULTI-IMAGE BUG)
// ===============================

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

$stmt = $conn->prepare("
    SELECT workspace_id, image_path
    FROM workspace_images
");
$stmt->execute();

$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

$imageMap = [];

foreach ($images as $img) {
    $imageMap[$img['workspace_id']][] = $baseUrl . $img['image_path'];
}


// ===============================
// 4. FORMAT RESPONSE DATA
// ===============================

foreach ($topWorkspaces as &$workspace) {

    $id = $workspace['id'];

    // Attach images (ARRAY)
    $workspace['images'] = $imageMap[$id] ?? [];

    // First image fallback
    $workspace['image'] = $workspace['images'][0] ?? null;

    // Numbers formatting
    $workspace['avg_rating'] = round((float)$workspace['avg_rating'], 1);
    $workspace['total_reviews'] = (int)$workspace['total_reviews'];
    $workspace['seating'] = (int)$workspace['seating'];

    // UI helper
    $workspace['hours'] =
        $workspace['hours_from'] . " - " . $workspace['hours_to'];

    // Favorite
    $workspace['is_favorite'] = (int)$workspace['is_favorite'];
}


// ===============================
// 5. RESPONSE
// ===============================

response(
    true,
    "Home data fetched successfully",
    [
        "stats" => [
            "workspaces" => (int)$workspaces['total_workspaces'],
            "users" => (int)$users['total_users'],
            "average_rating" => round($avgRating, 1),
            "satisfaction" => $satisfaction
        ],
        "top_workspaces" => $topWorkspaces
    ],
    null,
    200
);