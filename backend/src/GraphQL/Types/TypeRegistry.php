<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;

class TypeRegistry {
    private static $categoryType;
    private static $productType;
    private static $attributeType;
    private static $priceType;
    private static $orderItemInputType;
    private static $orderResponseType;

    public static function categoryType(): Type {
        if (!self::$categoryType) {
            self::$categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'id' => Type::nonNull(Type::int()),
                    'name' => Type::nonNull(Type::string()),
                ],
            ]);
        }
        return self::$categoryType;
    }

    public static function productType(): Type {
        if (!self::$productType) {
            self::$productType = new ObjectType([
                'name' => 'Product',
                'fields' => function () {
                    return [
                        'id' => Type::string(),
                        'name' => Type::string(),
                        'description' => Type::string(),
                        'category_id' => Type::int(),
                        'category_name' => Type::string(), // Dodato polje
                        'inStock' => Type::boolean(),
                        'attributes' => Type::listOf(self::attributeType()),
                        'gallery' => Type::listOf(Type::string()),
                        'prices' => Type::listOf(self::priceType()),
                    ];
                },
            ]);
        }
        return self::$productType;
    }
    

    public static function attributeType(): Type {
        if (!self::$attributeType) {
            self::$attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'name' => Type::string(),
                    'value' => Type::string(),
                ],
            ]);
        }
        return self::$attributeType;
    }
    public static function priceType(): Type {
        if (!self::$priceType) {
            self::$priceType = new ObjectType([
                'name' => 'Price',
                'fields' => [
                    'amount' => Type::float(),
                    'currency' => Type::string(),
                    'currency_label' => Type::string(), 
                    'currency_symbol' => Type::string(), 
                ],
            ]);
        }
        return self::$priceType;
    }
    

    public static function orderItemInputType(): Type {
        if (!self::$orderItemInputType) {
            self::$orderItemInputType = new InputObjectType([
                'name' => 'OrderItemInput',
                'fields' => [
                    'productId' => Type::nonNull(Type::string()),
                    'quantity' => Type::nonNull(Type::int()),
                    'price' => Type::nonNull(Type::float()),
                    'attributes' => Type::nonNull(Type::string()),
                ],
            ]);
        }
        return self::$orderItemInputType;
    }

    public static function orderResponseType(): Type {
        if (!self::$orderResponseType) {
            self::$orderResponseType = new ObjectType([
                'name' => 'OrderResponse',
                'fields' => [
                    'successMessage' => Type::string(),
                    'unavailableProducts' => Type::listOf(Type::string()),
                ],
            ]);
        }
        return self::$orderResponseType;
    }
}
