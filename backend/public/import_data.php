<?php

// Podešavanje konekcije
$host = 'localhost'; // Obično je localhost na Hostingeru
$dbName = 'u695683512_ecommerce'; // Ime vaše baze
$user = 'u695683512_user'; // MySQL korisničko ime
$password = '07955Hj324'; // MySQL lozinka


try {
    // Kreiranje PDO konekcije
    $dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
    $conn = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Prijavljivanje grešaka
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Rezultati kao asocijativni niz
    ]);
    echo "Uspješno povezan na bazu!\n";
} catch (PDOException $e) {
    die("Greška prilikom povezivanja: " . $e->getMessage());
}

// Učitavanje podataka iz data.json
$jsonData = file_get_contents('data.json');
if ($jsonData === false) {
    die("Greška: Nije moguće otvoriti data.json");
}
$data = json_decode($jsonData, true);
if ($data === null) {
    die("Greška: Nije moguće dekodirati JSON podatke");
}

// Unos kategorija
foreach ($data['data']['categories'] as $category) {
    $sql = "INSERT INTO categories (name) VALUES (:name)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['name' => $category['name']]);
}

// Unos proizvoda
foreach ($data['data']['products'] as $product) {
    $sql = "SELECT id FROM categories WHERE name = :name";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['name' => $product['category']]);
    $categoryId = $stmt->fetchColumn();

    if (!$categoryId) {
        echo "Greška: Kategorija nije pronađena za proizvod: {$product['name']}\n";
        continue;
    }

    // Unos proizvoda
    $sql = "INSERT INTO products (id, name, in_stock, description, category_id, brand) 
            VALUES (:id, :name, :in_stock, :description, :category_id, :brand)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'id' => $product['id'],
        'name' => $product['name'],
        'in_stock' => $product['inStock'] ? 1 : 0,
        'description' => $product['description'],
        'category_id' => $categoryId,
        'brand' => $product['brand']
    ]);

    // Unos galerije proizvoda
    foreach ($product['gallery'] as $imageUrl) {
        $sql = "INSERT INTO product_gallery (product_id, image_url) VALUES (:product_id, :image_url)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            'product_id' => $product['id'],
            'image_url' => $imageUrl
        ]);
    }

    // Unos atributa proizvoda
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

    // Unos cijena proizvoda
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

echo "Podaci su uspešno ubačeni u bazu.\n";
