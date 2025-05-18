<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Inclure les fichiers nécessaires
include_once '../../controllers/ElectrificationController.php';

// Initialiser le contrôleur
$controller = new ElectrificationController();

// Vérifier si l'ID est spécifié dans l'URL
if(isset($_GET['id']) && !empty($_GET['id'])) {
    // Obtenir le projet d'électrification spécifique
    $controller->getOne($_GET['id']);
} else {
    // Définir le code de réponse - 400 mauvaise requête
    http_response_code(400);
    
    // Informer l'utilisateur
    echo json_encode(["message" => "L'ID du projet est requis."]);
}
?>
