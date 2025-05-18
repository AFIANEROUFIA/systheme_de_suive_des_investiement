<?php
class Electrification {
    // Connexion à la base de données et nom de la table
    private $conn;
    private $table_name = "projets_electrification";

    // Propriétés de l'objet
    public $id;
    public $intitule;
    public $code_projet;
    public $localisation;
    public $adresse;
    public $type_installation;
    public $description_technique;
    public $date_debut;
    public $date_prevue_fin;
    public $fichier_justificatif;
    public $created_by;

    // Constructeur avec $db comme connexion à la base de données
    public function __construct($db) {
        $this->conn = $db;
    }

    // Lire tous les projets d'électrification
    public function readAll() {
        // Requête SELECT
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Exécution de la requête
        $stmt->execute();
        
        return $stmt;
    }

    // Lire un seul projet d'électrification
    public function readOne() {
        // Requête pour lire un seul enregistrement
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Liaison de l'ID
        $stmt->bindParam(1, $this->id);
        
        // Exécution de la requête
        $stmt->execute();
        
        // Récupération de la ligne
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            // Définition des valeurs des propriétés
            $this->intitule = $row['intitule'];
            $this->code_projet = $row['code_projet'];
            $this->localisation = $row['localisation'];
            $this->adresse = $row['adresse'];
            $this->type_installation = $row['type_installation'];
            $this->description_technique = $row['description_technique'];
            $this->date_debut = $row['date_debut'];
            $this->date_prevue_fin = $row['date_prevue_fin'];
            $this->fichier_justificatif = $row['fichier_justificatif'];
            $this->created_by = $row['created_by'];
            
            return true;
        }
        
        return false;
    }

    // Créer un projet d'électrification
    public function create() {
        // Requête d'insertion
        $query = "INSERT INTO " . $this->table_name . " 
                  SET intitule=:intitule, code_projet=:code_projet, localisation=:localisation, 
                      adresse=:adresse, type_installation=:type_installation, 
                      description_technique=:description_technique, date_debut=:date_debut, 
                      date_prevue_fin=:date_prevue_fin, fichier_justificatif=:fichier_justificatif, 
                      created_by=:created_by";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyage des données
        $this->intitule = htmlspecialchars(strip_tags($this->intitule));
        $this->code_projet = htmlspecialchars(strip_tags($this->code_projet));
        $this->localisation = htmlspecialchars(strip_tags($this->localisation));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->type_installation = htmlspecialchars(strip_tags($this->type_installation));
        $this->description_technique = htmlspecialchars(strip_tags($this->description_technique));
        $this->date_debut = htmlspecialchars(strip_tags($this->date_debut));
        $this->date_prevue_fin = htmlspecialchars(strip_tags($this->date_prevue_fin));
        $this->fichier_justificatif = htmlspecialchars(strip_tags($this->fichier_justificatif));
        
        // Liaison des valeurs
        $stmt->bindParam(":intitule", $this->intitule);
        $stmt->bindParam(":code_projet", $this->code_projet);
        $stmt->bindParam(":localisation", $this->localisation);
        $stmt->bindParam(":adresse", $this->adresse);
        $stmt->bindParam(":type_installation", $this->type_installation);
        $stmt->bindParam(":description_technique", $this->description_technique);
        $stmt->bindParam(":date_debut", $this->date_debut);
        $stmt->bindParam(":date_prevue_fin", $this->date_prevue_fin);
        $stmt->bindParam(":fichier_justificatif", $this->fichier_justificatif);
        $stmt->bindParam(":created_by", $this->created_by);
        
        // Exécution de la requête
        if($stmt->execute()) {
            // Enregistrer la modification dans la table des modifications
            $this->logModification('ajout', $this->conn->lastInsertId());
            return true;
        }
        
        return false;
    }

    // Mettre à jour un projet d'électrification
    public function update() {
        // Requête de mise à jour
        $query = "UPDATE " . $this->table_name . " 
                  SET intitule=:intitule, code_projet=:code_projet, localisation=:localisation, 
                      adresse=:adresse, type_installation=:type_installation, 
                      description_technique=:description_technique, date_debut=:date_debut, 
                      date_prevue_fin=:date_prevue_fin, fichier_justificatif=:fichier_justificatif 
                  WHERE id=:id";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyage des données
        $this->intitule = htmlspecialchars(strip_tags($this->intitule));
        $this->code_projet = htmlspecialchars(strip_tags($this->code_projet));
        $this->localisation = htmlspecialchars(strip_tags($this->localisation));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->type_installation = htmlspecialchars(strip_tags($this->type_installation));
        $this->description_technique = htmlspecialchars(strip_tags($this->description_technique));
        $this->date_debut = htmlspecialchars(strip_tags($this->date_debut));
        $this->date_prevue_fin = htmlspecialchars(strip_tags($this->date_prevue_fin));
        $this->fichier_justificatif = htmlspecialchars(strip_tags($this->fichier_justificatif));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Liaison des valeurs
        $stmt->bindParam(":intitule", $this->intitule);
        $stmt->bindParam(":code_projet", $this->code_projet);
        $stmt->bindParam(":localisation", $this->localisation);
        $stmt->bindParam(":adresse", $this->adresse);
        $stmt->bindParam(":type_installation", $this->type_installation);
        $stmt->bindParam(":description_technique", $this->description_technique);
        $stmt->bindParam(":date_debut", $this->date_debut);
        $stmt->bindParam(":date_prevue_fin", $this->date_prevue_fin);
        $stmt->bindParam(":fichier_justificatif", $this->fichier_justificatif);
        $stmt->bindParam(":id", $this->id);
        
        // Exécution de la requête
        if($stmt->execute()) {
            // Enregistrer la modification dans la table des modifications
            $this->logModification('modification', $this->id);
            return true;
        }
        
        return false;
    }

    // Supprimer un projet d'électrification
    public function delete() {
        // Requête de suppression
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyage de l'ID
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Liaison de l'ID
        $stmt->bindParam(1, $this->id);
        
        // Exécution de la requête
        if($stmt->execute()) {
            // Enregistrer la modification dans la table des modifications
            $this->logModification('suppression', $this->id);
            return true;
        }
        
        return false;
    }

    // Rechercher des projets d'électrification
    public function search($keywords) {
        // Requête de recherche
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE intitule LIKE ? OR code_projet LIKE ? OR localisation LIKE ? 
                  ORDER BY id DESC";
        
        // Préparation de la requête
        $stmt = $this->conn->prepare($query);
        
        // Nettoyage des mots-clés
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        
        // Liaison des mots-clés
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        
        // Exécution de la requête
        $stmt->execute();
        
        return $stmt;
    }

    // Compter tous les projets d'électrification
    public function count() {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $row['total_rows'];
    }

    // Enregistrer une modification dans la table des modifications
    private function logModification($action, $id_enregistrement) {
        $query = "INSERT INTO modifications 
                  SET user_id=:user_id, table_modifiee=:table_modifiee, 
                      id_enregistrement=:id_enregistrement, action=:action";
        
        $stmt = $this->conn->prepare($query);
        
        // Utiliser l'ID de l'utilisateur connecté (à adapter selon votre système d'authentification)
        $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
        
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":table_modifiee", $this->table_name);
        $stmt->bindParam(":id_enregistrement", $id_enregistrement);
        $stmt->bindParam(":action", $action);
        
        $stmt->execute();
    }

    // Obtenir les statistiques des projets d'électrification
    public function getStats() {
        $stats = [];
        
        // Total des projets
        $stats['total'] = $this->count();
        
        // Projets par statut (en cours, terminés, etc.)
        $query = "SELECT 
                    CASE 
                        WHEN CURDATE() < date_debut THEN 'en_attente'
                        WHEN CURDATE() BETWEEN date_debut AND date_prevue_fin THEN 'en_cours'
                        WHEN CURDATE() > date_prevue_fin THEN 'termine'
                    END as statut,
                    COUNT(*) as nombre
                  FROM " . $this->table_name . "
                  GROUP BY statut";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $stats['par_statut'] = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $stats['par_statut'][$row['statut']] = $row['nombre'];
        }
        
        // Projets par type d'installation
        $query = "SELECT type_installation, COUNT(*) as nombre
                  FROM " . $this->table_name . "
                  GROUP BY type_installation";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $stats['par_type'] = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $stats['par_type'][$row['type_installation']] = $row['nombre'];
        }
        
        // Projets par localisation
        $query = "SELECT localisation, COUNT(*) as nombre
                  FROM " . $this->table_name . "
                  GROUP BY localisation";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $stats['par_localisation'] = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $stats['par_localisation'][$row['localisation']] = $row['nombre'];
        }
        
        return $stats;
    }
}
?>
