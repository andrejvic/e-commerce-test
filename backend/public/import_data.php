<?php

$host = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];

try {
    // Creating a PDO connection
    $dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
    $conn = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
    ]);
    echo "Successfully connected to the database!\n";
} catch (PDOException $e) {
    die("Connection error: " . $e->getMessage());
}

// Loading data from data.json
$jsonData = file_get_contents('data.json');
if ($jsonData === false) {
    die("Error: Unable to open data.json");
}
$data = json_decode($jsonData, true);
if ($data === null) {
    die("Error: Unable to decode JSON data");
}

// Inserting categories
foreach ($data['data']['categories'] as $category) {
    $sql = "INSERT INTO categories (name) VALUES (:name)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['name' => $category['name']]);
}

// Inserting products
foreach ($data['data']['products'] as $product) {
    $sql = "SELECT id, name FROM categories WHERE name = :name";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['name' => $product['category']]);
    $categoryData = $stmt->fetch();

    if (!$categoryData) {
        echo "Error: Category not found for product: {$product['name']}\n";
        continue;
    }

    $categoryId = $categoryData['id'];
    $categoryName = $categoryData['name'];

    // Inserting product
    $sql = "INSERT INTO products (id, name, in_stock, description, category_id, category_name, brand) 
            VALUES (:id, :name, :in_stock, :description, :category_id, :category_name, :brand)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'id' => $product['id'],
        'name' => $product['name'],
        'in_stock' => $product['inStock'] ? 1 : 0,
        'description' => $product['description'],
        'category_id' => $categoryId,
        'category_name' => $categoryName,
        'brand' => $product['brand']
    ]);

    // Inserting product gallery
    foreach ($product['gallery'] as $imageUrl) {
        $sql = "INSERT INTO product_gallery (product_id, image_url) VALUES (:product_id, :image_url)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            'product_id' => $product['id'],
            'image_url' => $imageUrl
        ]);
    }

    // Inserting product attributes
    foreach ($product['attributes'] as $attribute) {
        foreach ($attribute['items'] as $item) {
            $sql = "INSERT INTO product_attributes (product_id, attribute_name, value) 
                    VALUES (:product_id, :attribute_name, :value)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                'product_id' => $product['id'],
                'attribute_name' => $attribute['name'],
                'value' => $item['value']
            ]);
        }
    }

    // Inserting product prices
    foreach ($product['prices'] as $price) {
        $sql = "INSERT INTO product_prices (product_id, amount, currency_label, currency_symbol) 
                VALUES (:product_id, :amount, :currency_label, :currency_symbol)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            'product_id' => $product['id'],
            'amount' => $price['amount'],
            'currency_label' => $price['currency']['label'],
            'currency_symbol' => $price['currency']['symbol']
        ]);
    }
}

echo "Data successfully inserted into the database.\n";