<?php
// test_connection.php - Fichier à placer à la racine de votre projet

// 1. Paramètres de connexion (à adapter selon votre configuration)
$host = 'localhost';
$dbname = 'suivre_investessement'; // Sans espace à la fin
 // Nom de votre base de données
$username = 'root';   // Votre utilisateur MySQL
$password = '';       // Votre mot de passe MySQL

// 2. Tentative de connexion
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Configurer PDO pour afficher les erreurs SQL
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8'");
    
    echo "<h2 style='color: green;'>Connexion réussie ! 🎉</h2>";
    echo "<p>Connexion établie avec la base de données <strong>$dbname</strong> sur <strong>$host</strong></p>";
    
    // Tester une requête simple
    $query = "SHOW TABLES";
    $stmt = $conn->query($query);
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h3>Tables disponibles :</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
} catch(PDOException $e) {
    // En cas d'erreur
    echo "<h2 style='color: red;'>Erreur de connexion ❌</h2>";
    echo "<p><strong>Message d'erreur :</strong> " . $e->getMessage() . "</p>";
    echo "<h3>Vérifiez :</h3>";
    echo "<ol>";
    echo "<li>Que MySQL est bien lancé</li>";
    echo "<li>Les identifiants dans le fichier test_connection.php</li>";
    echo "<li>Que la base 'dsa1_db' existe bien</li>";
    echo "<li>Les droits de l'utilisateur MySQL</li>";
    echo "</ol>";
}

// 3. Style pour améliorer l'affichage
echo "
<style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 2rem;
        max-width: 800px;
    }
    h2, h3 {
        margin-top: 1.5rem;
    }
    ul, ol {
        margin-left: 2rem;
    }
</style>
";
?>
