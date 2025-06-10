<?php
class Projets {
    private $conn;
    private $table_investissement = "projets_investissement";
    private $table_electrification = "projets_electrification";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function lireTous() {
        try {
            // Get investment projects
            $sql_inv = "SELECT 
                id,
                'investment' as type,
                code_projet as code,
                intitule as title,
                localisation as location,
                budget_alloue as budget,
                entreprise as contractor,
                situation as status,
                date_debut as start_date,
                date_prevue_fin as end_date
                FROM " . $this->table_investissement;

            // Get electrification projects
            $sql_elec = "SELECT 
                id,
                'electrification' as type,
                code_projet as code,
                intitule as title,
                localisation as location,
                budget as budget,
                entrepreneur as contractor,
                statut as status,
                date_debut as start_date,
                date_prevue_fin as end_date
                FROM " . $this->table_electrification;

            // Combine results with UNION
            $sql = "(" . $sql_inv . ") UNION (" . $sql_elec . ") ORDER BY start_date DESC";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            throw $e;
        }
    }

    public function supprimer($id, $type) {
        try {
            $table = $type === 'investment' ? $this->table_investissement : $this->table_electrification;
            $sql = "DELETE FROM " . $table . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id", $id);
            return $stmt->execute();
        } catch (PDOException $e) {
            throw $e;
        }
    }

    public function lireDetails($id, $type) {
        try {
            $table = $type === 'investment' ? $this->table_investissement : $this->table_electrification;
            $sql = "SELECT * FROM " . $table . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            throw $e;
        }
    }
}