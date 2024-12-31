<?php
// CORS Policy
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';
// require_once __DIR__ . '/../src/GraphQL/GraphQL.php'; 
use \App\GraphQL\GraphQL;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();


$scriptName = $_SERVER['SCRIPT_NAME'];
$basePath = str_replace('\\', '/', dirname($scriptName));


$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);


$path = substr($requestUri, strlen($basePath));
$path = '/' . ltrim($path, '/');


$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit;
}


if ($requestMethod === 'GET' && ($path === '/' || $path === '')) {
    echo json_encode([
        'status' => 'success',
        'message' => 'API is running',
    ]);
    exit;
}

if ($requestMethod === 'POST' && $path === '/graphql') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
        exit;
    }

    try {
        $handler = new GraphQL();
        $response = $handler->handle($input);
        header('Content-Type: application/json');
        echo json_encode($response);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);