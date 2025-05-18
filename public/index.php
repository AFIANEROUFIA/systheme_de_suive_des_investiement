<?php
require_once '../config/database.php';
require_once '../controllers/ElectrificationController.php';

$action = $_GET['action'] ?? 'index';
$controller = new ElectrificationController();

switch ($action) {
    case 'ajouter':
        $controller->ajouter();
        break;
    case 'index':
    default:
        $controller->index();
        break;
}