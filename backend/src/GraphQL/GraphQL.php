<?php

namespace App\GraphQL;

use App\GraphQL\Types\Schema;
use App\Database\Database;
use App\GraphQL\Types\QueryType;
use App\GraphQL\Types\MutationType;

class GraphQL {
    public function __construct() {
        $db = new Database; 

        $schema = new Schema();
        $this->schema = $schema->getSchema();
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
