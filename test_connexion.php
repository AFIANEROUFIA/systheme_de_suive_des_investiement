<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    echo "Connexion à la base de données réussie !";
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}