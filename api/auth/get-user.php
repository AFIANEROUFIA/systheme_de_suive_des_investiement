<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "username" => $_SESSION['username'],
            "role" => $_SESSION['role'],
            "email" => $_SESSION['email'] ?? ''
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié"]);
}
?>
