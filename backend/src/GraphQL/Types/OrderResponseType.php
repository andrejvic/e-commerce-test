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
                    'description' => 'Poruka o uspešnom kreiranju narudžbine',
                ],
                'unavailableProducts' => [
                    'type' => Type::listOf(Type::string()),
                    'description' => 'Lista proizvoda koji nisu dostupni',
                ],
            ],
        ]);
    }
}
