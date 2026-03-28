<?php
/**
 * GET /api/services
 * Query params: category (slug), q (search)
 * Returns: { success, data: Service[], total }
 *
 * GET /api/services?id=1
 * Returns: { success, data: Service }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$pdo = getDB();

// Single service by ID
if (!empty($_GET['id'])) {
    $stmt = $pdo->prepare('
        SELECT s.*, c.slug AS category, c.name AS category_name
        FROM services s
        JOIN service_categories c ON c.id = s.category_id
        WHERE s.id = ? AND s.is_active = 1
    ');
    $stmt->execute([(int) $_GET['id']]);
    $service = $stmt->fetch();
    if (!$service) error('Service not found', 404);
    json(['success' => true, 'data' => $service]);
}

// Build query with optional filters
$where  = ['s.is_active = 1'];
$params = [];

if (!empty($_GET['category'])) {
    $where[]  = 'c.slug = ?';
    $params[] = $_GET['category'];
}

if (!empty($_GET['q'])) {
    $where[]  = 's.name LIKE ?';
    $params[] = '%' . $_GET['q'] . '%';
}

$sql = '
    SELECT s.id, s.name, s.slug, s.description, s.icon, s.color, s.icon_color,
           s.base_price AS price, c.slug AS category, c.name AS category_name
    FROM services s
    JOIN service_categories c ON c.id = s.category_id
    WHERE ' . implode(' AND ', $where) . '
    ORDER BY c.sort_order, s.name
';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$services = $stmt->fetchAll();

// Add static rating/bookings count (replace with real aggregates when reviews exist)
foreach ($services as &$s) {
    $s['rating']   = 4.8;
    $s['bookings'] = 0;
    $s['iconColor'] = $s['icon_color'];
    unset($s['icon_color']);
}

json(['success' => true, 'data' => $services, 'total' => count($services)]);
