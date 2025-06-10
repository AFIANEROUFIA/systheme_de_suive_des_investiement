<?php
// Required headers

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database and object files
require_once dirname(__DIR__, 2) . '/config/Database.php';
require_once dirname(__DIR__, 2) . '/models/ProjetInvestissement.php';

// Create log directory if it doesn't exist
$logDir = dirname(__DIR__, 2) . "/logs";
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

try {
    // Get data from the request
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Log incoming data for debugging
    file_put_contents($logDir . "/api_debug.log", 
        date('Y-m-d H:i:s') . " - AJOUTER - " . print_r($data, true) . "\n", 
        FILE_APPEND);
    
    // Check if data was successfully decoded
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON format: " . json_last_error_msg());
    }
    
    // Check required fields
    if (!isset($data['intitule']) || empty($data['intitule'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Le titre du projet est requis"]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Initialize project model
    $projet = new ProjetInvestissement($db);
    
    // Add the project
    $success = $projet->ajouter($data);
    
    // Check if successful
    if ($success) {
        // Set response code - 201 Created
        http_response_code(201);
        
        // Tell the user
        echo json_encode(["success" => true, "message" => "Projet ajouté avec succès"]);
    } else {
        // Set response code - 503 Service Unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(["success" => false, "message" => "Impossible d'ajouter le projet"]);
    }
} catch (Exception $e) {
    // Log error
    file_put_contents($logDir . "/api_errors.log", 
        date('Y-m-d H:i:s') . " - AJOUTER - Error: " . $e->getMessage() . "\n", 
        FILE_APPEND);
    
    // Set response code - 500 Internal Server Error
    http_response_code(500);
    
    // Tell the user
    echo json_encode([
        "success" => false, 
        "message" => "Une erreur est survenue lors de l'ajout du projet",
        "error" => $e->getMessage()
    ]);
}