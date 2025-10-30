<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM projects WHERE status = 'archived' ORDER BY archived_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $projects
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur", "error" => $e->getMessage()]);
}
?>
