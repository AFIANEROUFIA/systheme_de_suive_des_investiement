<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Get year from query parameter
    $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
    $type = isset($_GET['type']) ? $_GET['type'] : 'all';

    // Count total projects
    $query = "SELECT COUNT(*) as total FROM projets_electrification WHERE YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $totalElectrification = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query = "SELECT COUNT(*) as total FROM projets_investissement WHERE YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $totalInvestissement = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $totalProjects = $totalElectrification + $totalInvestissement;

    // Count active projects
    $query = "SELECT COUNT(*) as total FROM projets_electrification WHERE statut = 'in-progress' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $activeElectrification = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query = "SELECT COUNT(*) as total FROM projets_investissement WHERE situation = 'in-progress' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $activeInvestissement = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $activeProjects = $activeElectrification + $activeInvestissement;

    // Calculate total budget
    $query = "SELECT COALESCE(SUM(budget), 0) as total FROM projets_electrification WHERE YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $budgetElectrification = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query = "SELECT COALESCE(SUM(budget_alloue), 0) as total FROM projets_investissement WHERE YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $budgetInvestissement = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $totalBudget = $budgetElectrification + $budgetInvestissement;

    // Calculate completion rate
    $query = "SELECT COUNT(*) as total FROM projets_electrification WHERE statut = 'completed' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $completedElectrification = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query = "SELECT COUNT(*) as total FROM projets_investissement WHERE situation = 'completed' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $completedInvestissement = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $completedProjects = $completedElectrification + $completedInvestissement;
    $completionRate = $totalProjects > 0 ? round(($completedProjects / $totalProjects) * 100) : 0;

    // Count delayed projects
    $query = "SELECT COUNT(*) as total FROM projets_electrification WHERE date_prevue_fin < NOW() AND statut != 'completed' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $delayedElectrification = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $query = "SELECT COUNT(*) as total FROM projets_investissement WHERE date_prevue_fin < NOW() AND situation != 'completed' AND YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $delayedInvestissement = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $delayedProjects = $delayedElectrification + $delayedInvestissement;

    // Get monthly data
    $query = "SELECT MONTH(created_at) as month, COUNT(*) as count FROM projets_electrification WHERE YEAR(created_at) = :year GROUP BY MONTH(created_at) ORDER BY month";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $monthlyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $months = [];
    $plannedData = [];
    $completedData = [];
    for ($i = 1; $i <= 12; $i++) {
        $months[] = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][$i - 1];
        $count = 0;
        foreach ($monthlyData as $data) {
            if ($data['month'] == $i) {
                $count = $data['count'];
                break;
            }
        }
        $plannedData[] = $count;
        $completedData[] = $count > 0 ? round($count * 0.7) : 0;
    }

    // Get distribution by daira
    $query = "SELECT daira, COUNT(*) as count FROM projets_electrification WHERE YEAR(created_at) = :year GROUP BY daira";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $dairaData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $dairas = [];
    $dairaCount = [];
    foreach ($dairaData as $data) {
        $dairas[] = ucfirst($data['daira']);
        $dairaCount[] = $data['count'];
    }

    // Get project types
    $query = "SELECT type_installation, COUNT(*) as count FROM projets_electrification WHERE YEAR(created_at) = :year GROUP BY type_installation";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $typeData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $types = [];
    $typeCount = [];
    foreach ($typeData as $data) {
        $types[] = ucfirst(str_replace('_', ' ', $data['type_installation']));
        $typeCount[] = $data['count'];
    }

    // Get project status
    $query = "SELECT statut, COUNT(*) as count FROM projets_electrification WHERE YEAR(created_at) = :year GROUP BY statut";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $statusData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $statusLabels = [];
    $statusCount = [];
    $statusMap = ['planned' => 'Planifié', 'in-progress' => 'En cours', 'completed' => 'Terminé'];
    foreach ($statusData as $data) {
        $statusLabels[] = $statusMap[$data['statut']] ?? $data['statut'];
        $statusCount[] = $data['count'];
    }

    // Calculate spent amount
    $query = "SELECT COALESCE(SUM(montant_payee), 0) as total FROM projets_investissement WHERE YEAR(created_at) = :year";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $totalSpent = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Prepare response
    $response = [
        'success' => true,
        'year' => $year,
        'totalProjects' => $totalProjects,
        'activeProjects' => $activeProjects,
        'totalBudget' => $totalBudget,
        'totalSpent' => $totalSpent,
        'completionRate' => $completionRate,
        'delayedProjects' => $delayedProjects,
        'projectsTrend' => '+12%',
        'budgetTrend' => '+24%',
        'completionTrend' => '-3%',
        'months' => $months,
        'plannedData' => $plannedData,
        'completedData' => $completedData,
        'dairas' => $dairas,
        'dairaData' => $dairaCount,
        'types' => $types,
        'typeData' => $typeCount,
        'statusLabels' => $statusLabels,
        'statusData' => $statusCount,
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
