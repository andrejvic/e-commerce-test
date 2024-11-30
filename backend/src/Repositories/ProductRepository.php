<?php

namespace App\Repositories;

require_once __DIR__ . '/../Database/Database.php';


use App\Database\Database;

class ProductRepository {
    private Database $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getAllProducts(): array {
        $conn = $this->db->getConnection();
        $query = $conn->query("SELECT * FROM products");
        $products = $query->fetchAll();

        foreach ($products as &$product) {
            $this->hydrateProduct($product);
        }

        return $products;
    }

    public function getProductById(string $id): ?array {
        $conn = $this->db->getConnection();
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if ($product) {
            $this->hydrateProduct($product);
            return $product;
        }

        return null;
    }

    private function hydrateProduct(array &$product) {
        $conn = $this->db->getConnection();

        $product['inStock'] = (bool) $product['in_stock'];
        $product['category_id'] = isset($product['category_id']) ? (int) $product['category_id'] : null;

        
        $attrQuery = $conn->prepare("
            SELECT attribute_name AS name, value 
            FROM product_attributes 
            WHERE product_id = ?
        ");
        $attrQuery->execute([$product['id']]);
        $product['attributes'] = $attrQuery->fetchAll();

        
        $galleryQuery = $conn->prepare("SELECT image_url FROM product_gallery WHERE product_id = ?");
        $galleryQuery->execute([$product['id']]);
        $product['gallery'] = $galleryQuery->fetchAll(\PDO::FETCH_COLUMN);

        
        $priceQuery = $conn->prepare("
            SELECT amount, currency_label, currency_symbol 
            FROM product_prices 
            WHERE product_id = ?
        ");

        $priceQuery->execute([$product['id']]);
        $product['prices'] = $priceQuery->fetchAll();
    }
}
