<?php
/**
 * GET /api/technicians
 * Query params: service, available (1/0), maxPrice, q, sort
 * Returns: { success, data: Technician[], total }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$pdo    = getDB();
$where  = ['u.is_active = 1'];
$params = [];

// Filter by service name
if (!empty($_GET['service']) && $_GET['service'] !== 'All') {
    $where[]  = 's.name = ?';
    $params[] = $_GET['service'];
}

// Filter by availability
if (isset($_GET['available']) && $_GET['available'] !== 'all') {
    $where[]  = 't.is_available = ?';
    $params[] = $_GET['available'] === 'available' ? 1 : 0;
}

// Filter by max price
if (!empty($_GET['maxPrice'])) {
    $where[]  = 't.hourly_rate <= ?';
    $params[] = (float) $_GET['maxPrice'];
}

// Search by name / service / location
if (!empty($_GET['q'])) {
    $q        = '%' . $_GET['q'] . '%';
    $where[]  = '(u.name LIKE ? OR s.name LIKE ? OR t.location LIKE ?)';
    $params   = array_merge($params, [$q, $q, $q]);
}

// Sort
$orderMap = [
    'rating'     => 't.rating DESC',
    'price_asc'  => 't.hourly_rate ASC',
    'price_desc' => 't.hourly_rate DESC',
    'reviews'    => 't.review_count DESC',
];
$order = $orderMap[$_GET['sort'] ?? ''] ?? 't.rating DESC';

$sql = "
    SELECT t.id, u.name, u.avatar_url AS avatar, s.name AS service,
           t.experience, t.location, t.is_available AS available,
           t.is_verified AS verified, t.rating, t.review_count AS reviews,
           t.hourly_rate AS price
    FROM technicians t
    JOIN users    u ON u.id = t.user_id
    JOIN services s ON s.id = t.service_id
    WHERE " . implode(' AND ', $where) . "
    ORDER BY {$order}
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$techs = $stmt->fetchAll();

// Cast types
foreach ($techs as &$t) {
    $t['id']        = (int)  $t['id'];
    $t['available'] = (bool) $t['available'];
    $t['verified']  = (bool) $t['verified'];
    $t['rating']    = (float)$t['rating'];
    $t['reviews']   = (int)  $t['reviews'];
    $t['price']     = (int)  $t['price'];
}

json(['success' => true, 'data' => $techs, 'total' => count($techs)]);
