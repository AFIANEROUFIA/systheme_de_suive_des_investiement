<?php
// Headers requis
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inclure les fichiers nécessaires
include_once '../../controllers/ElectrificationController.php';

// Initialiser le contrôleur
$controller = new ElectrificationController();

// Obtenir tous les projets d'électrification
$controller->getAll();
?>
