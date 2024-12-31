<?php

namespace App\Services;

use App\Database\Database;

class OrderService {
    private Database $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function createOrder(string $customerName, array $items): array {
        $conn = $this->db->getConnection();

        try {
            $conn->beginTransaction();

            $unavailableProducts = [];
            $orderItems = [];
            $totalAmount = 0;

            foreach ($items as $item) {
                $stmt = $conn->prepare("SELECT in_stock FROM products WHERE id = ?");
                $stmt->execute([$item['productId']]);
                $product = $stmt->fetch();

                if (!$product) {
                    $unavailableProducts[] = "Product with ID {$item['productId']} does not exist.";
                    continue;
                }

                if (!(bool)$product['in_stock']) {
                    $unavailableProducts[] = "Product with ID {$item['productId']} is out of stock.";
                    continue;
                }

                $orderItems[] = $item;
                $totalAmount += $item['quantity'] * $item['price'];
            }

            if (empty($orderItems)) {
                $conn->rollBack();
                return [
                    'successMessage' => "No products available for the order.",
                    'unavailableProducts' => $unavailableProducts,
                ];
            }

            // Create an order
            $stmt = $conn->prepare("INSERT INTO orders (customer_name, total_amount) VALUES (?, ?)");
            $stmt->execute([$customerName, $totalAmount]);
            $orderId = $conn->lastInsertId();

            // Add order items
            foreach ($orderItems as $item) {
                $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, attributes) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$orderId, $item['productId'], $item['quantity'], $item['price'], $item['attributes']]);
            }

            $conn->commit();

            $successMessage = "Order created successfully with ID: $orderId";
            if (!empty($unavailableProducts)) {
                $successMessage .= ". However, some products were unavailable: " . implode(", ", $unavailableProducts);
            }

            return [
                'successMessage' => $successMessage,
                'unavailableProducts' => $unavailableProducts,
            ];
        } catch (\Exception $e) {
            $conn->rollBack();
            throw new \Exception("Failed to create order: " . $e->getMessage());
        }
    }
}
