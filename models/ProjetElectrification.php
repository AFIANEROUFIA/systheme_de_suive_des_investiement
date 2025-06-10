<?php
class ProjetElectrification {
    private $conn;
    private $table = "projets_electrification";

    // Propriétés publiques
    public $intitule;
    public $code_projet;
    public $nature_juridique;
    public $localisation;
    public $daira;
    public $commune;
    public $adresse;
    public $type_installation;
    public $description_technique;
    public $budget;
    public $entrepreneur;
    public $statut;
    public $date_debut;
    public $date_prevue_fin;
    public $date_reception_demande;
    public $date_envoi_sonelgaz;
    public $date_accord_sonelgaz;
    public $observations;
    public $fichier_justificatif;
    public $created_by;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function creer() {
    $query = "INSERT INTO " . $this->table . "
    SET
        intitule=:intitule,
        code_projet=:code_projet,
        nature_juridique=:nature_juridique,
        localisation=:localisation,
        daira=:daira,
        commune=:commune,
        adresse=:adresse,
        type_installation=:type_installation,
        description_technique=:description_technique,
        budget=:budget,
        entrepreneur=:entrepreneur,
        statut=:statut,
        date_debut=:date_debut,
        date_prevue_fin=:date_prevue_fin,
        date_reception_demande=:date_reception_demande,
        date_envoi_sonelgaz=:date_envoi_sonelgaz,
        date_accord_sonelgaz=:date_accord_sonelgaz,
        observations=:observations,
        fichier_justificatif=:fichier_justificatif,
        created_by=:created_by";

    $stmt = $this->conn->prepare($query);

    $fields = [
        'intitule', 'code_projet', 'nature_juridique', 'localisation',
        'daira', 'commune', 'adresse', 'type_installation',
        'description_technique', 'budget', 'entrepreneur', 'statut',
        'date_debut', 'date_prevue_fin', 'date_reception_demande',
        'date_envoi_sonelgaz', 'date_accord_sonelgaz', 'observations',
        'fichier_justificatif', 'created_by'
    ];

    foreach ($fields as $field) {
        if (isset($this->$field) && $this->$field !== '') {
            $this->$field = is_string($this->$field) ? htmlspecialchars(strip_tags($this->$field)) : $this->$field;
            $stmt->bindValue(':' . $field, $this->$field);
        } else {
            // Pour éviter erreur SQL, on bind null si champ vide
            $stmt->bindValue(':' . $field, null, PDO::PARAM_NULL);
        }
    }

    if ($stmt->execute()) {
        return true;
    } else {
        $errorInfo = $stmt->errorInfo();
        file_put_contents(__DIR__ . "/../../logs/error_db.log", date('Y-m-d H:i:s') . " - SQL Error: " . print_r($errorInfo, true) . PHP_EOL, FILE_APPEND);
        return false;
    }
}

  public function lireTous() {
    $query = "SELECT * FROM " . $this->table . " ORDER BY id DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
}
 
    
}
