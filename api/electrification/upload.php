<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclure les fichiers nécessaires
include_once '../../controllers/ElectrificationController.php';

// Initialiser le contrôleur
$controller = new ElectrificationController();

// Vérifier si un fichier a été téléchargé
if(isset($_FILES['file'])) {
    $controller->uploadFile($_FILES['file']);
} else {
    // Définir le code de réponse - 400 mauvaise requête
    http_response_code(400);
    
    // Informer l'utilisateur
    echo json_encode(["message" => "Aucun fichier n'a été téléchargé."]);
}
?>
