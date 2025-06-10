<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/ProjetInvestissement.php';

$database = new Database();
$pdo = $database->getConnection();

$projet = new ProjetInvestissement($pdo);

$stmt = $projet->readAll();
$num = $stmt->rowCount();

if ($num > 0) {
    $projets_arr = array();
    $projets_arr["data"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $projet_item = array(
            "id" => $id,
            "code_projet" => $code_projet,
            "intitule" => $intitule,
            "type_programme" => $type_programme,
            "annee_budget" => $annee_budget,
            "budget_alloue" => $budget_alloue,
            "montant_engage" => $montant_engage,
            "montant_payee" => $montant_payee,
            "etat_avancement" => $etat_avancement,
            "situation" => $situation,
            "daira" => $daira,
            "commune" => $commune,
            "beneficiaire" => $beneficiaire,
            "date_debut" => $date_debut,
            "date_prevue_fin" => $date_prevue_fin,
            "description" => $description
        );

        array_push($projets_arr["data"], $projet_item);
    }

    http_response_code(200);
    echo json_encode($projets_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Aucun projet trouvé."));
}