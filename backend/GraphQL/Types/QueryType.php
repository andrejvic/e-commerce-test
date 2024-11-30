<?php

namespace App\GraphQL\Types;

require_once __DIR__ . '/../../Database/Database.php';
require_once __DIR__ . '/../../Repositories/ProductRepository.php';

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Repositories\ProductRepository;
use App\Database\Database;

class QueryType extends ObjectType {
    private ProductRepository $productRepository;

    public function __construct(Database $db) {
        $this->productRepository = new ProductRepository($db);

        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'test' => [
                    'type' => Type::string(),
                    'resolve' => function() {
                        return 'Hello, GraphQL!';
                    },
                ],
                'categories' => [
                    'type' => Type::listOf(TypeRegistry::categoryType()),
                    'resolve' => function() use ($db) {
                        $conn = $db->getConnection();
                        $query = $conn->query("SELECT * FROM categories");
                        $categories = $query->fetchAll();

                        // Converting to objects or arrays if necessary

                        return $categories;
                    },
                ],
                'products' => [
                    'type' => Type::listOf(TypeRegistry::productType()),
                    'resolve' => function() {
                        return $this->productRepository->getAllProducts();
                    },
                ],
                'product' => [
                    'type' => TypeRegistry::productType(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function($root, $args) {
                        return $this->productRepository->getProductById($args['id']);
                    },
                ],
            ],
        ]);
    }
}
