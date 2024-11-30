<?php

require_once 'vendor/autoload.php';
require_once __DIR__ . '/Database/Database.php';
require_once __DIR__ . '/Models/Concrete/ConcreteCategory.php';

use App\Database\Database;
use App\Models\ConcreteCategory;


$db = new Database('localhost', 'ecommerce', 'root', 'password');


$query = $db->getConnection()->query('SELECT * FROM categories');
$categories = $query->fetchAll();

foreach ($categories as $category) {
    $cat = new ConcreteCategory($category['id'], $category['name']);
    print_r($cat->toArray());
}
