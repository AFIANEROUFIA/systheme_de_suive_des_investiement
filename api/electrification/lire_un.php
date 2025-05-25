<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Inclure les fichiers de base de données et de modèle
include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

// Instancier la base de données et le modèle
$database = new Database();
$db = $database->getConnection();

$projet = new ProjetElectrification($db);

// Récupérer l'ID du projet à lire
$projet->id = isset($_GET['id']) ? $_GET['id'] : die();

// Lire les détails du projet
$projet->lireUn();

// Vérifier si le projet existe
if ($projet->intitule != null) {
    // Créer un tableau pour le projet
    $projet_arr = array(
        "id" => $projet->id,
        "intitule" => $projet->intitule,
        "code_projet" => $projet->code_projet,
        "nature_juridique" => $projet->nature_juridique,
        "localisation" => $projet->localisation,
        "daira" => $projet->daira,
        "commune" => $projet->commune,
        "adresse" => $projet->adresse,
        "type_installation" => $projet->type_installation,
        "description_technique" => $projet->description_technique,
        "budget" => $projet->budget,
        "entrepreneur" => $projet->entrepreneur,
        "statut" => $projet->statut,
        "date_debut" => $projet->date_debut,
        "date_prevue_fin" => $projet->date_prevue_fin,
        "date_reception_demande" => $projet->date_reception_demande,
        "date_envoi_sonelgaz" => $projet->date_envoi_sonelgaz,
        "date_accord_sonelgaz" => $projet->date_accord_sonelgaz,
        "observations" => $projet->observations,
        "fichier_justificatif" => $projet->fichier_justificatif,
        "created_by" => $projet->created_by,
        "created_at" => $projet->created_at,
        "updated_at" => $projet->updated_at
    );

    // Obtenir les observations du projet
    $observations = array();
    $stmt = $projet->getObservations();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $observation_item = array(
            "id" => $row['id'],
            "date_observation" => $row['date_observation'],
            "observation_text" => $row['observation_text'],
            "created_by" => $row['created_by_name']
        );
        array_push($observations, $observation_item);
    }
    $projet_arr["observations_list"] = $observations;

    // Définir le code de réponse à 200 OK
    http_response_code(200);

    // Afficher les données en JSON
    echo json_encode($projet_arr);
} else {
    // Définir le code de réponse à 404 Not Found
    http_response_code(404);

    // Informer l'utilisateur que le projet n'existe pas
    echo json_encode(array("message" => "Le projet d'électrification n'existe pas."));
}