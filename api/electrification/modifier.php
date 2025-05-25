<?php
// Affiche les erreurs pour le debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// En-têtes
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Connexion à la base
include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Lecture du corps JSON
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->code_projet)) {
    // Préparer la requête SQL
    $query = "UPDATE projets_electrification SET
        intitule = :intitule,
        nature_juridique = :nature_juridique,
        daira = :daira,
        commune = :commune,
        type_installation = :type_installation,
        budget = :budget,
        statut = :statut,
        date_debut = :date_debut,
        date_prevue_fin = :date_prevue_fin,
        description_technique = :description_technique,
        entrepreneur = :entrepreneur
        WHERE code_projet = :code_projet";

    $stmt = $db->prepare($query);

    // Lier les paramètres
    $stmt->bindParam(":code_projet", $data->code_projet);
    $stmt->bindParam(":intitule", $data->intitule);
    $stmt->bindParam(":nature_juridique", $data->nature_juridique);
    $stmt->bindParam(":daira", $data->daira);
    $stmt->bindParam(":commune", $data->commune);
    $stmt->bindParam(":type_installation", $data->type_installation);
    $stmt->bindParam(":budget", $data->budget);
    $stmt->bindParam(":statut", $data->statut);
    $stmt->bindParam(":date_debut", $data->date_debut);
    $stmt->bindParam(":date_prevue_fin", $data->date_prevue_fin);
    $stmt->bindParam(":description_technique", $data->description_technique);
    $stmt->bindParam(":entrepreneur", $data->entrepreneur);

    // Exécuter la requête
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Projet mis à jour avec succès."]);
        } else {
            http_response_code(200);
            echo json_encode(["message" => "Aucune ligne mise à jour. Vérifiez le code_projet ou les données."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la mise à jour."]);
    }

} else {
    http_response_code(400);
    echo json_encode(["message" => "Code projet manquant."]);
}
