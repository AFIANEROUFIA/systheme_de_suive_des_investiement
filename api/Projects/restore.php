<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['project_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID du projet manquant"]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

try {
    // Restore project by changing status back
    $query = "UPDATE projects SET status = :status, archived_at = NULL WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data['project_id']);
    $stmt->bindParam(":status", $data['status'] ?? 'planned');
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Projet restauré avec succès"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur", "error" => $e->getMessage()]);
}
?>
