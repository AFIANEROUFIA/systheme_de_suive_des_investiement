<?php
// 🔧 CORS headers pour autoriser les appels depuis 127.0.0.1:5500
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if ($origin === 'null') $origin = '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Réponse à la requête préflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Connexion DB
include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Lire les données JSON reçues
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->code_projet)) {
    $query = "DELETE FROM projets_electrification WHERE code_projet = :code_projet";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":code_projet", $data->code_projet);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Projet supprimé avec succès."]);
        } else {
            echo json_encode(["message" => "Aucun projet trouvé avec ce code."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la suppression."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Code projet manquant."]);
}
