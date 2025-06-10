<?php
class ProjetInvestissement {
    private $conn;
    private $table = "projets_investissement";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all projects
    public function lireTous() {
        try {
            $sql = "SELECT * FROM " . $this->table . " ORDER BY id DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            $this->logError($e, "lireTous");
            throw $e;
        }
    }

    // Get a single project by ID
    public function lireUn($id) {
        try {
            $sql = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            $this->logError($e, "lireUn");
            throw $e;
        }
    }
private function mapStatutToSituation($statut) {
    switch ($statut) {
        case 'planifie': return 'non lancé';
        case 'en-cours': return 'lancé';
        case 'termine': return 'clôturé';
        case 'annule':
        case 'suspendu': return 'abandonné';
        default: return 'non lancé';
    }
}
    // Add a new project
public function ajouter($data) {
       // Log plus détaillé
    file_put_contents(__DIR__ . "/../logs/debug_situation.log", 
        "Données reçues : " . print_r($data, true) . "\n" .
        "Statut reçu : " . ($data['statut'] ?? 'null') . "\n" .
        "Situation mappée : " . $this->mapStatutToSituation($data['statut'] ?? 'planifie') . "\n",
        FILE_APPEND);

    try {
        $sql = "INSERT INTO " . $this->table . " 
            (code_projet, intitule, localisation, type_programme, annee_budget, 
            budget_alloue, montant_engage, montant_payee, etat_avancement, 
            entreprise, situation, cause_non_lancement, date_debut, date_prevue_fin, 
            type_budget, numero_operation, maitre_ouvrage, fichier_justificatif, 
            daira, commune, beneficiaire, created_by)
            VALUES 
            (:code_projet, :intitule, :localisation, :type_programme, :annee_budget, 
            :budget_alloue, :montant_engage, :montant_payee, :etat_avancement, 
            :entreprise, :situation, :cause_non_lancement, :date_debut, :date_prevue_fin, 
            :type_budget, :numero_operation, :maitre_ouvrage, :fichier_justificatif, 
            :daira, :commune, :beneficiaire, :created_by)";

        $stmt = $this->conn->prepare($sql);

        // Map and sanitize input data
        $params = [
            ":daira" => htmlspecialchars(strip_tags($data['daira'] ?? '')),
            ":commune" => htmlspecialchars(strip_tags($data['commune'] ?? '')),
            ":beneficiaire" => htmlspecialchars(strip_tags($data['beneficiaire'] ?? '')),
            ":code_projet" => htmlspecialchars(strip_tags($data['code_projet'] ?? $data['numero'] ?? '')),
            ":intitule" => htmlspecialchars(strip_tags($data['intitule'])),
            ":localisation" => htmlspecialchars(strip_tags($data['localisation'] ?? $data['commune'] ?? '')),
            ":type_programme" => in_array($data['type_programme'] ?? $data['programme'] ?? 'normale', 
                ['normale','urgence','psre','special','complémentaire','pcsc','hp','sud']) 
                ? ($data['type_programme'] ?? $data['programme'] ?? 'normale')
                : 'normale',
            ":annee_budget" => (int)($data['annee_budget'] ?? $data['annee'] ?? date('Y')),
            ":budget_alloue" => (float)($data['budget_alloue'] ?? $data['budget'] ?? 0),
            ":montant_engage" => (float)($data['montant_engage'] ?? $data['engage'] ?? 0),
            ":montant_payee" => (float)($data['montant_payee'] ?? $data['paye'] ?? 0),
            ":etat_avancement" => (int)($data['etat_avancement'] ?? $data['avancement'] ?? 0),
            ":entreprise" => htmlspecialchars(strip_tags($data['entreprise'] ?? '')),
            ":situation" => $this->mapStatutToSituation($data['statut'] ?? 'planifie'),
            ":cause_non_lancement" => htmlspecialchars(strip_tags($data['cause_non_lancement'] ?? $data['description'] ?? '')),
            ":date_debut" => $data['date_debut'] ?? $data['dateDebut'] ?? null,
            ":date_prevue_fin" => $data['date_prevue_fin'] ?? $data['dateFin'] ?? null,
            ":type_budget" => htmlspecialchars(strip_tags($data['type_budget'] ?? 'pcd')),
            ":numero_operation" => htmlspecialchars(strip_tags($data['numero_operation'] ?? $data['numero'] ?? '')),
            ":maitre_ouvrage" => htmlspecialchars(strip_tags($data['maitre_ouvrage'] ?? $data['beneficiaire'] ?? 'DSA Guelma')),
            ":fichier_justificatif" => htmlspecialchars(strip_tags($data['fichier_justificatif'] ?? '')),
            ":created_by" => (int)($data['created_by'] ?? null)
        ];

        return $stmt->execute($params);
    } catch (PDOException $e) {
        $this->logError($e, "ajouter", $data);
        throw $e;
    }
}

    // Update a project
    public function modifier($data) {
        try {
            $sql = "UPDATE " . $this->table . " SET
                code_projet = :code_projet,
                intitule = :intitule,
                localisation = :localisation,
                type_programme = :type_programme,
                annee_budget = :annee_budget,
                budget_alloue = :budget_alloue,
                montant_engage = :montant_engage,
                montant_payee = :montant_payee,
                etat_avancement = :etat_avancement,
                entreprise = :entreprise,
                situation = :situation,
                cause_non_lancement = :cause_non_lancement,
                date_debut = :date_debut,
                date_prevue_fin = :date_prevue_fin,
                type_budget = :type_budget,
                numero_operation = :numero_operation,
                maitre_ouvrage = :maitre_ouvrage
                WHERE id = :id";

            $stmt = $this->conn->prepare($sql);
            $situation = $this->mapStatutToSituation($data['statut'] ?? 'planifie');
             $causeNonLancement = $data['cause_non_lancement'] ?? $data['description'] ?? '';

            // Map and sanitize input data
            $params = [
                ":id" => (int)$data['id'],
                ":code_projet" => htmlspecialchars(strip_tags($data['code_projet'] ?? $data['numero'] ?? '')),
                ":intitule" => htmlspecialchars(strip_tags($data['intitule'])),
                ":localisation" => htmlspecialchars(strip_tags($data['localisation'] ?? $data['commune'] ?? '')),
                ":type_programme" => htmlspecialchars(strip_tags($data['type_programme'] ?? $data['programme'] ?? 'normale')),
                ":annee_budget" => (int)($data['annee_budget'] ?? $data['annee'] ?? date('Y')),
                ":budget_alloue" => (float)($data['budget_alloue'] ?? $data['budget'] ?? 0),
                ":montant_engage" => (float)($data['montant_engage'] ?? $data['engage'] ?? 0),
                ":montant_payee" => (float)($data['montant_payee'] ?? $data['paye'] ?? 0),
                ":etat_avancement" => (int)($data['etat_avancement'] ?? $data['avancement'] ?? 0),
                ":entreprise" => htmlspecialchars(strip_tags($data['entreprise'] ?? '')),
                ":situation" => $situation,
                ":cause_non_lancement" => htmlspecialchars(strip_tags($causeNonLancement)),
                
                ":date_debut" => $data['date_debut'] ?? $data['dateDebut'] ?? null,
                ":date_prevue_fin" => $data['date_prevue_fin'] ?? $data['dateFin'] ?? null,
                ":type_budget" => htmlspecialchars(strip_tags($data['type_budget'] ?? 'pcd')),
                ":numero_operation" => htmlspecialchars(strip_tags($data['numero_operation'] ?? $data['numero'] ?? '')),
                ":maitre_ouvrage" => htmlspecialchars(strip_tags($data['maitre_ouvrage'] ?? $data['beneficiaire'] ?? 'DSA Guelma'))
            ];
                file_put_contents(__DIR__ . "/../logs/debug_params.log",
    "Paramètres envoyés à la requête : " . print_r($params, true),
    FILE_APPEND);

            return $stmt->execute($params);
        } catch (PDOException $e) {
            $this->logError($e, "modifier", $data);
            throw $e;
        }
    }

    // Delete a project
    public function supprimer($id) {
        try {
            $sql = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->logError($e, "supprimer", ["id" => $id]);
            throw $e;
        }
    }
     

    // Helper function to map frontend status to database situation





    // Helper function to log errors
    private function logError($exception, $method, $data = null) {
        $logDir = dirname(__DIR__) . "/logs";
        
        // Create logs directory if it doesn't exist
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . "/db_errors.log";
        $message = date('Y-m-d H:i:s') . " - Method: " . $method . " - Error: " . $exception->getMessage() . "\n";
        
        if ($data) {
            $message .= "Data: " . print_r($data, true) . "\n";
        }
        
        file_put_contents($logFile, $message, FILE_APPEND);
    }
}