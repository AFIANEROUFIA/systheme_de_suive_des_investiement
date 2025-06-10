<?php
// Required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database and object files
require_once dirname(__DIR__, 2) . '/config/Database.php';
require_once dirname(__DIR__, 2) . '/models/ProjetInvestissement.php';

// Create log directory if it doesn't exist
$logDir = dirname(__DIR__, 2) . "/logs";
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Initialize project model
    $projet = new ProjetInvestissement($db);
    
    // Get projects
    $stmt = $projet->lireTous();
    $num = $stmt->rowCount();
    
    // Check if more than 0 records found
    if ($num > 0) {
        // Projects array
        $projets_arr = [];
        
        // Retrieve table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $projet_item = [
                "id" => $id,
                "numero" => $code_projet,
                "intitule" => $intitule,
                "localisation" => $localisation,
                "programme" => $type_programme,
                "annee" => $annee_budget,
                "budget" => (float)$budget_alloue,
                "engage" => (float)$montant_engage,
                "paye" => (float)$montant_payee,
                "avancement" => $etat_avancement,
                "entreprise" => $entreprise,
                "statut" => mapSituationToStatut($situation),

                "description" => $cause_non_lancement,
                "dateDebut" => $date_debut,
                "dateFin" => $date_prevue_fin,
                "type_budget" => $type_budget,
                "beneficiaire" => $maitre_ouvrage
            ];
            
            $projets_arr[] = $projet_item;
        }
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Return data
        echo json_encode($projets_arr);
    } else {
        // No projects found
        http_response_code(200);
        echo json_encode([]);
    }
} catch (Exception $e) {
    // Log error
    file_put_contents($logDir . "/api_errors.log", 
        date('Y-m-d H:i:s') . " - LIRE - Error: " . $e->getMessage() . "\n", 
        FILE_APPEND);
    
    // Set response code - 500 Internal Server Error
    http_response_code(500);
    
    // Tell the user
    echo json_encode([
        "success" => false, 
        "message" => "Une erreur est survenue lors de la récupération des projets.",
        "error" => $e->getMessage()
    ]);
}

// Helper function to map database situation to frontend status
function mapSituationToStatut($situation) {
    switch ($situation) {
        case 'lancé':
            return 'en-cours';
        case 'non lancé':
            return 'planifie';
        case 'clôturé':
            return 'termine';
        case 'abandonné':
            return 'annule';
        default:
            return $situation; // Return the original value if no mapping exists
    }
}