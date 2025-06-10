<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
file_put_contents("debug_update.json", json_encode($data, JSON_PRETTY_PRINT));


if (!empty($data->projet_id) && !empty($data->observation_text) && !empty($data->date_observation)) {
    $query = "INSERT INTO electrification_observations 
              (projet_id, date_observation, observation_text, created_by)
              VALUES (:projet_id, :date_observation, :observation_text, :created_by)";
    
    $stmt = $db->prepare($query);

    $stmt->bindParam(":projet_id", $data->projet_id);
    $stmt->bindParam(":date_observation", $data->date_observation);
    $stmt->bindParam(":observation_text", $data->observation_text);
    $stmt->bindParam(":created_by", $data->created_by);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Observation ajoutée avec succès."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de l'ajout de l'observation."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
}
