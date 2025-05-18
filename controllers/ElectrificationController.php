<?php
// Inclure les fichiers nécessaires
include_once '../config/database.php';
include_once '../models/Electrification.php';

class ElectrificationController {
    private $db;
    private $electrification;
    
    public function __construct() {
        // Obtenir la connexion à la base de données
        $database = new Database();
        $this->db = $database->getConnection();
        
        // Initialiser l'objet Electrification
        $this->electrification = new Electrification($this->db);
    }
    
    // Méthode pour obtenir tous les projets d'électrification
    public function getAll() {
        // Requête pour obtenir tous les projets
        $stmt = $this->electrification->readAll();
        $num = $stmt->rowCount();
        
        // Vérifier s'il y a plus de 0 enregistrement trouvé
        if($num > 0) {
            // Tableau de projets
            $projets_arr = [];
            $projets_arr["records"] = [];
            
            // Récupérer le contenu de la table
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $projet_item = [
                    "id" => $id,
                    "intitule" => $intitule,
                    "code_projet" => $code_projet,
                    "localisation" => $localisation,
                    "adresse" => $adresse,
                    "type_installation" => $type_installation,
                    "description_technique" => $description_technique,
                    "date_debut" => $date_debut,
                    "date_prevue_fin" => $date_prevue_fin,
                    "fichier_justificatif" => $fichier_justificatif,
                    "created_by" => $created_by
                ];
                
                array_push($projets_arr["records"], $projet_item);
            }
            
            // Définir le code de réponse - 200 OK
            http_response_code(200);
            
            // Afficher les données au format JSON
            echo json_encode($projets_arr);
        } else {
            // Aucun projet trouvé
            http_response_code(404);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Aucun projet d'électrification trouvé."]);
        }
    }
    
    // Méthode pour obtenir un projet spécifique
    public function getOne($id) {
        // Définir l'ID du projet à lire
        $this->electrification->id = $id;
        
        // Lire les détails du projet
        if($this->electrification->readOne()) {
            // Créer un tableau
            $projet_arr = [
                "id" => $this->electrification->id,
                "intitule" => $this->electrification->intitule,
                "code_projet" => $this->electrification->code_projet,
                "localisation" => $this->electrification->localisation,
                "adresse" => $this->electrification->adresse,
                "type_installation" => $this->electrification->type_installation,
                "description_technique" => $this->electrification->description_technique,
                "date_debut" => $this->electrification->date_debut,
                "date_prevue_fin" => $this->electrification->date_prevue_fin,
                "fichier_justificatif" => $this->electrification->fichier_justificatif,
                "created_by" => $this->electrification->created_by
            ];
            
            // Définir le code de réponse - 200 OK
            http_response_code(200);
            
            // Afficher les données au format JSON
            echo json_encode($projet_arr);
        } else {
            // Aucun projet trouvé
            http_response_code(404);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Le projet d'électrification n'existe pas."]);
        }
    }
    
    // Méthode pour créer un nouveau projet
    public function create($data) {
        // Vérifier que les données ne sont pas vides
        if(
            !empty($data->intitule) &&
            !empty($data->localisation) &&
            !empty($data->type_installation) &&
            !empty($data->date_debut) &&
            !empty($data->date_prevue_fin)
        ) {
            // Définir les valeurs des propriétés du projet
            $this->electrification->intitule = $data->intitule;
            $this->electrification->code_projet = !empty($data->code_projet) ? $data->code_projet : $this->generateProjectCode();
            $this->electrification->localisation = $data->localisation;
            $this->electrification->adresse = $data->adresse;
            $this->electrification->type_installation = $data->type_installation;
            $this->electrification->description_technique = $data->description_technique;
            $this->electrification->date_debut = $data->date_debut;
            $this->electrification->date_prevue_fin = $data->date_prevue_fin;
            $this->electrification->fichier_justificatif = $data->fichier_justificatif;
            $this->electrification->created_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
            
            // Créer le projet
            if($this->electrification->create()) {
                // Définir le code de réponse - 201 créé
                http_response_code(201);
                
                // Informer l'utilisateur
                echo json_encode(["message" => "Le projet d'électrification a été créé."]);
            } else {
                // Définir le code de réponse - 503 service indisponible
                http_response_code(503);
                
                // Informer l'utilisateur
                echo json_encode(["message" => "Impossible de créer le projet d'électrification."]);
            }
        } else {
            // Définir le code de réponse - 400 mauvaise requête
            http_response_code(400);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Impossible de créer le projet d'électrification. Les données sont incomplètes."]);
        }
    }
    
    // Méthode pour mettre à jour un projet
    public function update($id, $data) {
        // Définir l'ID du projet à modifier
        $this->electrification->id = $id;
        
        // Vérifier que les données ne sont pas vides
        if(
            !empty($data->intitule) &&
            !empty($data->localisation) &&
            !empty($data->type_installation) &&
            !empty($data->date_debut) &&
            !empty($data->date_prevue_fin)
        ) {
            // Définir les valeurs des propriétés du projet
            $this->electrification->intitule = $data->intitule;
            $this->electrification->code_projet = $data->code_projet;
            $this->electrification->localisation = $data->localisation;
            $this->electrification->adresse = $data->adresse;
            $this->electrification->type_installation = $data->type_installation;
            $this->electrification->description_technique = $data->description_technique;
            $this->electrification->date_debut = $data->date_debut;
            $this->electrification->date_prevue_fin = $data->date_prevue_fin;
            $this->electrification->fichier_justificatif = $data->fichier_justificatif;
            
            // Mettre à jour le projet
            if($this->electrification->update()) {
                // Définir le code de réponse - 200 OK
                http_response_code(200);
                
                // Informer l'utilisateur
                echo json_encode(["message" => "Le projet d'électrification a été mis à jour."]);
            } else {
                // Définir le code de réponse - 503 service indisponible
                http_response_code(503);
                
                // Informer l'utilisateur
                echo json_encode(["message" => "Impossible de mettre à jour le projet d'électrification."]);
            }
        } else {
            // Définir le code de réponse - 400 mauvaise requête
            http_response_code(400);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Impossible de mettre à jour le projet d'électrification. Les données sont incomplètes."]);
        }
    }
    
    // Méthode pour supprimer un projet
    public function delete($id) {
        // Définir l'ID du projet à supprimer
        $this->electrification->id = $id;
        
        // Supprimer le projet
        if($this->electrification->delete()) {
            // Définir le code de réponse - 200 OK
            http_response_code(200);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Le projet d'électrification a été supprimé."]);
        } else {
            // Définir le code de réponse - 503 service indisponible
            http_response_code(503);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Impossible de supprimer le projet d'électrification."]);
        }
    }
    
    // Méthode pour rechercher des projets
    public function search($keywords) {
        // Requête de recherche
        $stmt = $this->electrification->search($keywords);
        $num = $stmt->rowCount();
        
        // Vérifier s'il y a des résultats
        if($num > 0) {
            // Tableau de projets
            $projets_arr = [];
            $projets_arr["records"] = [];
            
            // Récupérer le contenu de la table
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $projet_item = [
                    "id" => $id,
                    "intitule" => $intitule,
                    "code_projet" => $code_projet,
                    "localisation" => $localisation,
                    "adresse" => $adresse,
                    "type_installation" => $type_installation,
                    "description_technique" => $description_technique,
                    "date_debut" => $date_debut,
                    "date_prevue_fin" => $date_prevue_fin,
                    "fichier_justificatif" => $fichier_justificatif,
                    "created_by" => $created_by
                ];
                
                array_push($projets_arr["records"], $projet_item);
            }
            
            // Définir le code de réponse - 200 OK
            http_response_code(200);
            
            // Afficher les données au format JSON
            echo json_encode($projets_arr);
        } else {
            // Aucun projet trouvé
            http_response_code(404);
            
            // Informer l'utilisateur
            echo json_encode(["message" => "Aucun projet d'électrification trouvé."]);
        }
    }
    
    // Méthode pour obtenir les statistiques
    public function getStats() {
        $stats = $this->electrification->getStats();
        
        // Définir le code de réponse - 200 OK
        http_response_code(200);
        
        // Afficher les données au format JSON
        echo json_encode($stats);
    }
    
    // Méthode pour gérer l'upload de fichiers
    public function uploadFile($file) {
        $target_dir = "../uploads/";
        $file_name = basename($file["name"]);
        $target_file = $target_dir . time() . "_" . $file_name;
        $uploadOk = 1;
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        
        // Vérifier si le fichier existe déjà
        if (file_exists($target_file)) {
            http_response_code(400);
            echo json_encode(["message" => "Désolé, le fichier existe déjà."]);
            return false;
        }
        
        // Vérifier la taille du fichier
        if ($file["size"] > 5000000) { // 5MB
            http_response_code(400);
            echo json_encode(["message" => "Désolé, votre fichier est trop volumineux."]);
            return false;
        }
        
        // Autoriser certains formats de fichier
        if($fileType != "pdf" && $fileType != "doc" && $fileType != "docx" && 
           $fileType != "jpg" && $fileType != "png" && $fileType != "jpeg") {
            http_response_code(400);
            echo json_encode(["message" => "Désolé, seuls les fichiers PDF, DOC, DOCX, JPG, JPEG & PNG sont autorisés."]);
            return false;
        }
        
        // Si tout est OK, essayer de télécharger le fichier
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            http_response_code(200);
            echo json_encode([
                "message" => "Le fichier ". htmlspecialchars($file_name) . " a été téléchargé.",
                "file_path" => $target_file
            ]);
            return $target_file;
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Désolé, une erreur s'est produite lors du téléchargement de votre fichier."]);
            return false;
        }
    }
    
    // Méthode pour générer un code de projet
    private function generateProjectCode() {
        $now = new \DateTime();
        $year = $now->format('Y');
        $month = $now->format('m');
        $random = mt_rand(100, 999);
        
        return "ELEC-{$year}-{$month}-{$random}";
    }
}
?>
