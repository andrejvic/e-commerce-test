<?php

namespace App\Database;

use PDO;
use PDOException;

class Database {
    private PDO $connection;

    public function __construct() {
        $host = $_ENV['DB_HOST'];
        $dbName = $_ENV['DB_NAME'];
        $user = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASSWORD'];
        

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
