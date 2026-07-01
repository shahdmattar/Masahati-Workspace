<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../config/cors.php";

$conn = (new Database())->getConnection();


// =====================================
// INPUTS
// =====================================

$search      = $_GET['search'] ?? '';
$region      = $_GET['region'] ?? '';
$area        = $_GET['area'] ?? '';

$internet    = $_GET['internet'] ?? '';
$electricity = $_GET['electricity'] ?? '';
$price       = $_GET['price'] ?? '';
$seating     = $_GET['seating'] ?? '';
$quietness   = $_GET['quietness'] ?? '';
$ladies      = $_GET['ladies'] ?? '';

$sort        = $_GET['sort'] ?? 'Newest';


// =====================================
// BASE QUERY
// =====================================

$sql = "
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
        w.created_at,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.id) AS total_reviews
    FROM workspaces w
    LEFT JOIN reviews r ON r.workspace_id = w.id
    WHERE w.status = 'approved'
";

$params = [];


// =====================================
// SEARCH FILTER
// =====================================

if (!empty($search)) {
    $sql .= " AND (
        w.workspace_name LIKE ?
        OR w.city LIKE ?
        OR w.area LIKE ?
    )";

    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}


// =====================================
// REGION FILTER
// =====================================

if (!empty($region) && $region !== "All") {
    $sql .= " AND w.city = ? ";
    $params[] = $region;
}


// =====================================
// AREA FILTER
// =====================================

if (!empty($area) && $area !== "All") {
    $sql .= " AND w.area = ? ";
    $params[] = $area;
}


// =====================================
// INTERNET FILTER
// =====================================

if (!empty($internet)) {
    $values = explode(",", $internet);
    $conditions = [];

    foreach ($values as $val) {
        $conditions[] = "w.internet_quality LIKE ?";
        $params[] = "%" . trim($val) . "%";
    }

    $sql .= " AND (" . implode(" OR ", $conditions) . ") ";
}


// =====================================
// ELECTRICITY FILTER
// =====================================

if (!empty($electricity)) {
    $values = explode(",", $electricity);
    $conditions = [];

    foreach ($values as $val) {
        $conditions[] = "w.electricity_status LIKE ?";
        $params[] = "%" . trim($val) . "%";
    }

    $sql .= " AND (" . implode(" OR ", $conditions) . ") ";
}


// =====================================
// PRICE FILTER
// =====================================

if (!empty($price)) {
    $sql .= " AND w.price_per_hour <= ? ";
    $params[] = $price;
}


// =====================================
// SEATING FILTER
// =====================================

if (!empty($seating) && $seating !== "Any" && $seating !== "Any Capacity") {

    if ($seating === "Less than 10") {
        $sql .= " AND w.seating < 10 ";
    } elseif ($seating === "10 - 30") {
        $sql .= " AND w.seating BETWEEN 10 AND 30 ";
    } elseif ($seating === "More than 30") {
        $sql .= " AND w.seating > 30 ";
    }
}


// =====================================
// QUIETNESS FILTER
// =====================================

if (!empty($quietness)) {
    $values = explode(",", $quietness);
    $conditions = [];

    foreach ($values as $val) {
        $conditions[] = "w.quietness_level LIKE ?";
        $params[] = "%" . trim($val) . "%";
    }

    $sql .= " AND (" . implode(" OR ", $conditions) . ") ";
}


// =====================================
// LADIES FILTER
// =====================================

if (isset($_GET['ladies']) && $_GET['ladies'] !== '') {
    $ladies = explode(',', $_GET['ladies']);
    $ladies = array_map('intval', $ladies);
    $in = implode(',', $ladies);
    $sql .= " AND w.ladies_area IN ($in)";
}


// =====================================
// GROUP BY
// =====================================

$sql .= " GROUP BY w.id ";


// =====================================
// SORTING
// =====================================

switch ($sort) {

    case "Lowest Price":
        $sql .= " ORDER BY w.price_per_hour ASC ";
        break;

    case "Highest Rated":
        $sql .= " ORDER BY average_rating DESC ";
        break;

    case "Newest":
    default:
        $sql .= " ORDER BY w.id DESC ";
        break;
}


// =====================================
// EXECUTE
// =====================================

$stmt = $conn->prepare($sql);
$stmt->execute($params);

$workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);


// =====================================
// EMPTY RESPONSE
// =====================================

if (empty($workspaces)) {
    echo json_encode([
        "success" => true,
        "message" => "No workspaces found",
        "data" => []
    ]);
    exit;
}


// =====================================
// IMAGES
// =====================================

$ids = array_column($workspaces, 'id');

if (!empty($ids)) {

    $in = str_repeat('?,', count($ids) - 1) . '?';

    $imgStmt = $conn->prepare("
        SELECT workspace_id, image_path
        FROM workspace_images
        WHERE workspace_id IN ($in)
    ");

    $imgStmt->execute($ids);

    $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    $images = [];
}


// =====================================
// MAP IMAGES
// =====================================

$baseUrl = "http://localhost/Masahati-Workspace/backend/uploads/";

$imagesMap = [];

foreach ($images as $img) {
    $imagesMap[$img['workspace_id']][] = $baseUrl . $img['image_path'];
}


// =====================================
// ATTACH IMAGES
// =====================================

foreach ($workspaces as &$ws) {
    $ws['images'] = $imagesMap[$ws['id']] ?? [];
}


// =====================================
// RESPONSE
// =====================================

echo json_encode([
    "success" => true,
    "message" => "Workspaces fetched successfully",
    "data" => $workspaces
]);