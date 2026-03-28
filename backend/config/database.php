<?php
/**
 * database.php — PDO connection factory
 * Returns a shared PDO instance (singleton pattern).
 */

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $host   = 'localhost';
    $dbname = 'fixbhai';
    $user   = 'root';
    $pass   = '';          // change if your MySQL has a password
    $dsn    = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);
    return $pdo;
}
