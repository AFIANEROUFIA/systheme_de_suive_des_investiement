<?php
// Affichage des erreurs (développement uniquement)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers pour JSON + CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Charger la BDD
require_once __DIR__ . '/../../config/Database.php';

session_start();

// Lire les données envoyées en JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les données
if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Champs manquants."]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);

// Connexion à la base
$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérification du mot de passe
        if (password_verify($password, $user['password'])) {
            // Connexion réussie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            // Mettre à jour la date de dernière connexion
            $update = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
            $update->bindParam(":id", $user['id']);
            $update->execute();

            echo json_encode(["success" => true]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "Mot de passe incorrect."]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur.", "error" => $e->getMessage()]);
    exit;
}
