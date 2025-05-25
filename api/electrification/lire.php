<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inclure les fichiers de base de données et de modèle
include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

// Instancier la base de données et le modèle
$database = new Database();
$db = $database->getConnection();

$projet = new ProjetElectrification($db);

// Lire les projets
$stmt = $projet->lire();
$num = $stmt->rowCount();

// Vérifier s'il y a plus de 0 enregistrement
if ($num > 0) {
    // Tableau de projets
    $projets_arr = array();
    $projets_arr["records"] = array();

    // Récupérer le contenu de la table
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $projet_item = array(
            "id" => $id,
            "intitule" => $intitule,
            "code_projet" => $code_projet,
            "nature_juridique" => $nature_juridique,
            "localisation" => $localisation,
            "daira" => $daira,
            "commune" => $commune,
            "type_installation" => $type_installation,
            "budget" => $budget,
            "entrepreneur" => $entrepreneur,
            "statut" => $statut,
            "date_debut" => $date_debut,
            "date_prevue_fin" => $date_prevue_fin,
            "created_by" => $created_by_name,
            "created_at" => $created_at
        );

        array_push($projets_arr["records"], $projet_item);
    }

    // Définir le code de réponse à 200 OK
    http_response_code(200);

    // Afficher les données en JSON
    echo json_encode($projets_arr);
} else {
    // Définir le code de réponse à 404 Not Found
    http_response_code(404);

    // Informer l'utilisateur qu'aucun projet n'a été trouvé
    echo json_encode(array("message" => "Aucun projet d'électrification trouvé."));
}
