<?php
// Page d'accueil simple pour tester l'API
echo "<h1>API de Gestion des Projets d'Électrification</h1>";
echo "<p>Bienvenue dans l'API de gestion des projets d'électrification.</p>";
echo "<h2>Points d'entrée disponibles :</h2>";
echo "<ul>";
echo "<li><a href='api/electrification/read.php'>Lire tous les projets</a></li>";
echo "<li>Lire un projet spécifique : api/electrification/read_one.php?id=1</li>";
echo "<li>Rechercher des projets : api/electrification/search.php?s=mot_clé</li>";
echo "<li>Obtenir des statistiques : <a href='api/electrification/stats.php'>Statistiques</a></li>";
echo "</ul>";
echo "<p>Les autres points d'entrée (create, update, delete, upload) nécessitent des requêtes POST, PUT ou DELETE.</p>";
?>
