<?php
// Autorisations d'accès
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->code_projet)) {
    $code_projet = htmlspecialchars(strip_tags($data->code_projet));
    
    $query = "DELETE FROM projets_electrification WHERE code_projet = :code_projet";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":code_projet", $code_projet);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Projet supprimé avec succès."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la suppression."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Code projet manquant."]);
}
