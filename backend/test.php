<?php
/**
 * Connection test — visit http://localhost/backend/test.php
 * Remove this file before going to production.
 */
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json');

try {
    $pdo  = getDB();
    $ver  = $pdo->query('SELECT VERSION() AS v')->fetchColumn();
    $tbls = $pdo->query("SHOW TABLES FROM fixbhai")->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success'  => true,
        'message'  => 'Database connected successfully',
        'mysql'    => $ver,
        'database' => 'fixbhai',
        'tables'   => $tbls,
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed',
        'error'   => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
