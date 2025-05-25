<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclure les fichiers nécessaires
include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Créer une instance de projet
$projet = new ProjetElectrification($db);

// Récupérer les données envoyées
$data = json_decode(file_get_contents("php://input"));

// Vérification des champs obligatoires
if (
    !empty($data->intitule) &&
    !empty($data->code_projet) &&
    !empty($data->nature_juridique) &&
    !empty($data->daira) &&
    !empty($data->commune) &&
    !empty($data->type_installation) &&
    !empty($data->budget) &&
    !empty($data->date_debut) &&
    !empty($data->date_prevue_fin)
) {
    // Affecter les valeurs au modèle
    $projet->intitule = $data->intitule;
    $projet->code_projet = $data->code_projet;
    $projet->nature_juridique = $data->nature_juridique;
    $projet->localisation = $data->localisation ?? null;
    $projet->daira = $data->daira;
    $projet->commune = $data->commune;
    $projet->adresse = $data->adresse ?? null;
    $projet->type_installation = $data->type_installation;
    $projet->description_technique = $data->description_technique ?? null;
    $projet->budget = $data->budget;
    $projet->entrepreneur = $data->entrepreneur ?? null;
    $projet->statut = $data->statut ?? 'planned';
    $projet->date_debut = $data->date_debut;
    $projet->date_prevue_fin = $data->date_prevue_fin;
    $projet->date_reception_demande = $data->date_reception_demande ?? null;
    $projet->date_envoi_sonelgaz = $data->date_envoi_sonelgaz ?? null;
    $projet->date_accord_sonelgaz = $data->date_accord_sonelgaz ?? null;
    $projet->observations = $data->observations ?? null;
    $projet->fichier_justificatif = $data->fichier_justificatif ?? null;
    $projet->created_by = $data->created_by ?? 1;

    // Créer le projet
    if ($projet->creer()) {
        http_response_code(201);
        echo json_encode(["message" => "Projet d'électrification créé avec succès."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Impossible de créer le projet."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
}
