<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../../config/Database.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Champs manquants."]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['email'] = $user['email'] ?? '';
            $_SESSION['logged_in'] = true;

            $update = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
            $update->bindParam(":id", $user['id']);
            $update->execute();

            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "role" => $user['role'],
                    "email" => $user['email'] ?? ''
                ]
            ]);
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
?>
