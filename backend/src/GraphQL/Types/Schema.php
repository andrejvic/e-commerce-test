<?php
// src/GraphQL/Schema.php
namespace App\GraphQL;

use GraphQL\Type\Schema;
use App\GraphQL\Types\MutationType;
use App\GraphQL\Types\OrderResponseType;
use App\GraphQL\Types\QueryType;
use App\Database\Database;

class MySchema
{
    private Schema $schema;

    public function __construct()
    {
        $db = new Database(); 
        $orderResponseType = new OrderResponseType();

        $mutationType = new MutationType($db, $orderResponseType);
        $queryType = new QueryType(); 

        $this->schema = new Schema([
            'query' => $queryType,
            'mutation' => $mutationType,
        ]);
    }

    public function getSchema(): Schema
    {
        return $this->schema;
    }
}
