<?php
class ElectrificationObservation {
    private $conn;
    private $table_name = "electrification_observations";

    public $id;
    public $projet_id;
    public $date_observation;
    public $observation_text;
    public $created_by;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Créer une observation
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET projet_id=:projet_id, date_observation=:date_observation, 
                observation_text=:observation_text, created_by=:created_by";

        $stmt = $this->conn->prepare($query);

        // Nettoyage des données
        $this->projet_id = htmlspecialchars(strip_tags($this->projet_id));
        $this->date_observation = htmlspecialchars(strip_tags($this->date_observation));
        $this->observation_text = htmlspecialchars(strip_tags($this->observation_text));
        $this->created_by = htmlspecialchars(strip_tags($this->created_by));

        // Liaison des paramètres
        $stmt->bindParam(":projet_id", $this->projet_id);
        $stmt->bindParam(":date_observation", $this->date_observation);
        $stmt->bindParam(":observation_text", $this->observation_text);
        $stmt->bindParam(":created_by", $this->created_by);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Lire toutes les observations d'un projet
    public function readByProject() {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE projet_id = ? 
                ORDER BY date_observation DESC";
        
        $stmt = $this->conn->prepare($query);
        $this->projet_id = htmlspecialchars(strip_tags($this->projet_id));
        $stmt->bindParam(1, $this->projet_id);
        
        $stmt->execute();
        return $stmt;
    }
}
?>