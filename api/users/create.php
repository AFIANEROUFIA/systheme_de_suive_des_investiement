<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../../config/Database.php';

session_start();

// Check if user is admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Accès refusé"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'], $data['email'], $data['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

try {
    // Check if username already exists
    $checkQuery = "SELECT id FROM users WHERE username = :username";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":username", $data['username']);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Cet utilisateur existe déjà"]);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    // Insert new user
    $query = "INSERT INTO users (username, password, email, role, created_at) VALUES (:username, :password, :email, :role, NOW())";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data['username']);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":email", $data['email']);
    $stmt->bindParam(":role", $data['role']);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Utilisateur créé avec succès"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur", "error" => $e->getMessage()]);
}
?>
