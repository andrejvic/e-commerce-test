<?php
// src/GraphQL/Schema.php
namespace App\GraphQL\Types;

use GraphQL\Type\Schema as GraphQLSchema;
use App\GraphQL\Types\MutationType;
use App\GraphQL\Types\OrderResponseType;
use App\GraphQL\Types\QueryType;
use App\Database\Database;

class Schema
{
    private GraphQLSchema $schema;

    public function __construct()
    {
        $db = new Database(); 
        $orderResponseType = new OrderResponseType();

        $mutationType = new MutationType($db);
        $queryType = new QueryType($db); 

        $this->schema = new GraphQLSchema([
            'query' => $queryType,
            'mutation' => $mutationType,
        ]);
    }

    public function getSchema(): GraphQLSchema
    {
        return $this->schema;
    }
}
