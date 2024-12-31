<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Repositories\ProductRepository;
use App\Database\Database;

class QueryType extends ObjectType
{
    private ProductRepository $productRepository;

    public function __construct(Database $db)
    {
        $this->productRepository = new ProductRepository($db);

        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'test' => [
                    'type' => Type::string(),
                    'resolve' => function () {
                        return 'Hello, GraphQL!';
                    },
                ],
                'categories' => [
                    'type' => Type::listOf(TypeRegistry::categoryType()),
                    'resolve' => function () use ($db) {
                        $conn = $db->getConnection();
                        $query = $conn->query("SELECT * FROM categories");
                        return $query->fetchAll();
                    },
                ],
                'products' => [
                    'type' => Type::listOf(TypeRegistry::productType()),
                    'resolve' => function () {
                        return $this->productRepository->getAllProducts();
                    },
                ],
                'product' => [
                    'type' => TypeRegistry::productType(),
                    'args' => [
                        'id' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function ($root, $args) {
                        return $this->productRepository->getProductById($args['id']);
                    },
                ],
                'productAttributes' => [
                    'type' => Type::listOf(
                        new ObjectType([
                            'name' => 'ProductAttributePlain',
                            'fields' => [
                                'attribute_name' => Type::string(),
                                'value' => Type::string(),
                            ],
                        ])
                    ),
                    'args' => [
                        'productId' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function ($root, $args) {
                        return $this->productRepository->getProductAttributes($args['productId']);
                    },
                ],
            ],
        ]);
    }
}
