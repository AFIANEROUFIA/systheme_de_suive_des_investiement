<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../../config/Database.php';

session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Accès refusé"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID utilisateur manquant"]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

try {
    $query = "DELETE FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data['user_id']);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Utilisateur supprimé"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur", "error" => $e->getMessage()]);
}
?>
