<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inclusion des fichiers nécessaires
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/ProjetInvestissement.php';
require_once __DIR__ . '/../../models/ProjetElectrification.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Vérifier la connexion
if ($db === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Impossible de se connecter à la base de données"
    ]);
    exit;
}

try {
    $projets = [];

    // Lire les projets d'investissement
    $projetInvest = new ProjetInvestissement($db);
    $stmtInvest = $projetInvest->lireTous();

    while ($row = $stmtInvest->fetch(PDO::FETCH_ASSOC)) {
        // Filtrer les entrées incomplètes (optionnel)
        if (empty($row['code_projet']) || empty($row['intitule'])) continue;

        $projets[] = [
            "id" => $row['id'],
            "type" => "investment",
            "code" => $row['code_projet'],
            "title" => $row['intitule'],
            "location" => $row['localisation'],
            "daira" => $row['daira'],
            "commune" => $row['commune'],
            "budget" => (float)$row['budget_alloue'],
            "contractor" => $row['entreprise'],
            "status" => mapStatus($row['situation']),
            "startDate" => $row['date_debut'],
            "endDate" => $row['date_prevue_fin'],
            "progress" => (int)$row['etat_avancement']
        ];
    }

    // Lire les projets d'électrification
    $projetElect = new ProjetElectrification($db);
    $stmtElect = $projetElect->lireTous();

    while ($row = $stmtElect->fetch(PDO::FETCH_ASSOC)) {
        if (empty($row['code_projet']) || empty($row['intitule'])) continue;

        $projets[] = [
            "id" => $row['id'],
            "type" => "electrification",
            "code" => $row['code_projet'],
            "title" => $row['intitule'],
            "location" => $row['localisation'],
            "daira" => $row['daira'],
            "commune" => $row['commune'],
            "budget" => (float)$row['budget'],
            "contractor" => $row['entrepreneur'],
            "status" => $row['statut'],
            "startDate" => $row['date_debut'],
            "endDate" => $row['date_prevue_fin'],
            "installationType" => $row['type_installation']
        ];
    }

    // ✅ Réponse JSON attendue par le frontend JS
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $projets
    ]);

} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données",
        "error" => $exception->getMessage()
    ]);
} catch (Exception $exception) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur",
        "error" => $exception->getMessage()
    ]);
}

// Fonction pour mapper le statut
function mapStatus($situation) {
    switch (strtolower($situation)) {
        case 'lancé':
            return 'in-progress';
        case 'non lancé':
            return 'planned';
        case 'clôturé':
            return 'completed';
        default:
            return strtolower($situation);
    }
}
