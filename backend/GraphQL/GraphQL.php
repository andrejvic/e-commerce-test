<?php

namespace App\GraphQL;

require_once __DIR__ . '/../Database/Database.php';
require_once __DIR__ . '/Types/QueryType.php';
require_once __DIR__ . '/Types/MutationType.php';
require_once __DIR__ . '/Types/TypeRegistry.php'; 

use GraphQL\Type\Schema;
use App\Database\Database;
use App\GraphQL\Types\QueryType;
use App\GraphQL\Types\MutationType;

class GraphQLHandler {
    private Schema $schema;

    public function __construct() {
        $db = new Database('localhost', 'ecommerce', 'root', ''); 

        $this->schema = new Schema([
            'query' => new QueryType($db),
            'mutation' => new MutationType($db),
        ]);
    }

    public function handle(array $input): array {
        try {
            $query = $input['query'] ?? null;
            $variables = $input['variables'] ?? null;
    
            if (!$query) {
                throw new \Exception('No query provided');
            }
    
            $result = \GraphQL\GraphQL::executeQuery(
                $this->schema,
                $query,
                null,
                null,
                $variables
            );
    
            header("Content-Type: application/json");
            return $result->toArray();
        } catch (\Exception $e) {
            return [
                'errors' => [
                    ['message' => $e->getMessage()],
                ],
            ];
        }
    }
}
