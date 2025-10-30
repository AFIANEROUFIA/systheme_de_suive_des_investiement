<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/database.php';


$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo json_encode(["success" => true, "message" => "Connexion réussie à la base de données !"]);
} else {
    echo json_encode(["success" => false, "message" => "Échec de la connexion à la base de données."]);
}
?>
