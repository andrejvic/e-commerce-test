<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderResponseType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderResponse',
            'fields' => [
                'successMessage' => [
                    'type' => Type::string(),
                    'description' => 'Order successfully created',
                ],
                'unavailableProducts' => [
                    'type' => Type::listOf(Type::string()),
                    'description' => 'List of unavailable products',
                ],
            ],
        ]);
    }
}