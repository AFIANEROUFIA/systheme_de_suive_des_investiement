<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/ProjetElectrification.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM projets_electrification ORDER BY date_debut DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$projets = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($projets);
