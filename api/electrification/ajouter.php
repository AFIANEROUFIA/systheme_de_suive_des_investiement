<?php 
// Afficher les erreurs pour debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if ($origin === 'null') $origin = '*';

header("Access-Control-Allow-Origin: $origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

$database = new Database();
$db = $database->getConnection();

$projet = new ProjetElectrification($db);

$data = json_decode(file_get_contents("php://input"));
file_put_contents(__DIR__ . "/../../logs/debug_input_electrification.log", print_r($data, true));

// Vérifie les champs obligatoires
if (
    !empty($data->intitule) &&
    !empty($data->code_projet) &&
    !empty($data->nature_juridique) &&
    !empty($data->daira) &&
    !empty($data->commune) &&
    !empty($data->type_installation) &&
    !empty($data->budget) &&
    !empty($data->statut) &&
    !empty($data->date_debut) &&
    !empty($data->date_prevue_fin)
) {
    // Affectation des champs
    $projet->intitule = $data->intitule;
    $projet->code_projet = $data->code_projet;
    $projet->nature_juridique = $data->nature_juridique;
    $projet->localisation = $data->localisation ?? '';
    $projet->daira = $data->daira;
    $projet->commune = $data->commune;
    $projet->adresse = $data->adresse ?? '';
    $projet->type_installation = $data->type_installation;
    $projet->description_technique = $data->description_technique ?? '';
    $projet->budget = $data->budget;
    $projet->entrepreneur = $data->entrepreneur ?? '';
    $projet->statut = $data->statut;
    $projet->date_debut = $data->date_debut;
    $projet->date_prevue_fin = $data->date_prevue_fin;
    $projet->date_reception_demande = $data->date_reception_demande ?? null;
    $projet->date_envoi_sonelgaz = $data->date_envoi_sonelgaz ?? null;
    $projet->date_accord_sonelgaz = $data->date_accord_sonelgaz ?? null;
    $projet->observations = $data->observations ?? null;
    $projet->fichier_justificatif = $data->fichier_justificatif ?? null;
    $projet->created_by = $data->created_by ?? 1;

    // Essai d'insertion
    if ($projet->creer()) {
        http_response_code(201);
        echo json_encode([
            "success" => true, // ✅ BOOLÉEN, pas string
            "message" => "Projet d’électrification ajouté avec succès"
        ]);
    } else {
        http_response_code(503);
        echo json_encode([
            "success" => false,
            "message" => "Échec lors de l’insertion du projet"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Champs requis manquants ou invalides"
    ]);
}
