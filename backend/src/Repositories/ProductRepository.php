<?php

namespace App\Repositories;

use App\Database\Database;
use App\Models\Concrete\ConcreteProduct;
use App\Models\Concrete\ConcreteAttribute;

class ProductRepository
{
    private Database $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    public function getAllProducts(): array
    {
        $conn = $this->db->getConnection();
        $stmt = $conn->query("SELECT * FROM products");
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $products = [];
        foreach ($rows as $row) {
            $products[] = $this->hydrateProduct($row);
        }

        return $products;
    }

    public function getProductById(string $id): ?ConcreteProduct
    {
        $conn = $this->db->getConnection();
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return $this->hydrateProduct($row);
    }

    private function hydrateProduct(array $row): ConcreteProduct
    {
        $product = new ConcreteProduct(
            $row['id'],
            $row['name'],
            (int)$row['in_stock'],
            $row['description'],
            (int)$row['category_id'],
            $row['brand'] ?? '',
            $row['category_name'] ?? ''
        );

        $conn = $this->db->getConnection();

        $attrStmt = $conn->prepare("
            SELECT id, product_id, attribute_name, value
            FROM product_attributes
            WHERE product_id = ?
        ");
        $attrStmt->execute([$row['id']]);
        $attrRows = $attrStmt->fetchAll(\PDO::FETCH_ASSOC);

        $attributes = [];
        foreach ($attrRows as $ar) {
            $attributes[] = new ConcreteAttribute(
                (int)$ar['id'],
                $ar['product_id'],
                $ar['attribute_name'],
                $ar['value']
            );
        }
        $product->setAttributes($attributes);

        $galleryStmt = $conn->prepare("
            SELECT image_url
            FROM product_gallery
            WHERE product_id = ?
        ");
        $galleryStmt->execute([$row['id']]);
        $galleryUrls = $galleryStmt->fetchAll(\PDO::FETCH_COLUMN);
        $product->setGallery($galleryUrls);

        $priceStmt = $conn->prepare("
            SELECT amount, currency_label, currency_symbol
            FROM product_prices
            WHERE product_id = ?
        ");
        $priceStmt->execute([$row['id']]);
        $priceRows = $priceStmt->fetchAll(\PDO::FETCH_ASSOC);

        $product->setPrices($priceRows);

        return $product;
    }
}
