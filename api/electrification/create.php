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

// Obtenir les données envoyées
$data = json_decode(file_get_contents("php://input"));

// Vérifier si un fichier a été téléchargé
if(isset($_FILES['fichier_justificatif'])) {
    $file_path = $controller->uploadFile($_FILES['fichier_justificatif']);
    if($file_path) {
        $data->fichier_justificatif = $file_path;
    }
}

// Créer le projet
$controller->create($data);
?>
