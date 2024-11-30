<?php

namespace App\GraphQL\Types;

require_once __DIR__ . '/../../Services/OrderService.php';


use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use App\Services\OrderService;
use App\GraphQL\Types\TypeRegistry;
use App\Database\Database;

class MutationType extends ObjectType
{
    private OrderService $orderService;

    public function __construct(Database $db)
    {
        $this->orderService = new OrderService($db);

        parent::__construct([
            'name' => 'Mutation',
            'fields' => function () {
                return [
                    'createOrder' => [
                        'type' => TypeRegistry::orderResponseType(),
                        'args' => [
                            'customerName' => Type::nonNull(Type::string()),
                            'items' => Type::nonNull(Type::listOf(TypeRegistry::orderItemInputType())),
                        ],
                        'resolve' => function($root, $args) {
                            return $this->orderService->createOrder($args['customerName'], $args['items']);
                        },
                    ],
                ];
            },
        ]);
    }
}
