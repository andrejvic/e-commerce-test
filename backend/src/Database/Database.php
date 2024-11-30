<?php

namespace App\Database;

use PDO;
use PDOException;

class Database {
    private PDO $connection;

    public function __construct() {
        $host = '127.0.0.1';
        $dbName = 'ecommerce';
        $user = 'root';
        $password = '';

        $dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
        try {
            $this->connection = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }

    public function getConnection(): PDO {
        return $this->connection;
    }
}
