// Initialisation des graphiques
document.addEventListener('DOMContentLoaded', function() {
    // Données simulées
    const statsData = {
      months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
      planned: [5, 8, 12, 15, 18, 22, 25],
      completed: [3, 5, 7, 10, 12, 15, 18],
      locations: ['Guelma', 'Bouchegouf', 'Oued Zenati', 'Héliopolis', 'Aïn Makhlouf'],
      locationCounts: [12, 8, 5, 3, 2],
      types: ['Puits', 'Forage', 'Étable', 'Entrepôt'],
      typeCounts: [15, 8, 5, 2],
      statuses: ['Terminé', 'En cours', 'En retard', 'Planifié'],
      statusCounts: [18, 7, 3, 2],
      budget: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        planned: [3.5, 4.2, 3.8, 4.5],
        spent: [2.8, 3.5, 3.2, 3.0]
      }
    };
  
    // Graphique d'évolution mensuelle
    const monthlyCtx = document.getElementById('monthlyProgressChart').getContext('2d');
    new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: statsData.months,
        datasets: [
          {
            label: 'Planifié',
            data: statsData.planned,
            backgroundColor: '#0056b3',
            borderColor: '#004494',
            borderWidth: 1
          },
          {
            label: 'Réalisé',
            data: statsData.completed,
            backgroundColor: '#ffc107',
            borderColor: '#e0a800',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de projets'
            }
          }
        }
      }
    });
  
    // Graphique de répartition géographique
    const locationCtx = document.getElementById('locationDistributionChart').getContext('2d');
    new Chart(locationCtx, {
      type: 'doughnut',
      data: {
        labels: statsData.locations,
        datasets: [{
          data: statsData.locationCounts,
          backgroundColor: [
            '#0056b3',
            '#17a2b8',
            '#28a745',
            '#ffc107',
            '#dc3545'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  
    // Graphique des types de projets
    const typesCtx = document.getElementById('projectTypesChart').getContext('2d');
    new Chart(typesCtx, {
      type: 'pie',
      data: {
        labels: statsData.types,
        datasets: [{
          data: statsData.typeCounts,
          backgroundColor: [
            '#0056b3',
            '#17a2b8',
            '#28a745',
            '#ffc107'
          ],
          borderWidth: 1
        }]
      }
    });
  
    // Graphique des statuts
    const statusCtx = document.getElementById('projectStatusChart').getContext('2d');
    new Chart(statusCtx, {
      type: 'polarArea',
      data: {
        labels: statsData.statuses,
        datasets: [{
          data: statsData.statusCounts,
          backgroundColor: [
            '#28a745',
            '#17a2b8',
            '#dc3545',
            '#6c757d'
          ],
          borderWidth: 1
        }]
      }
    });
  
    // Graphique budgétaire
    const budgetCtx = document.getElementById('budgetChart').getContext('2d');
    new Chart(budgetCtx, {
      type: 'line',
      data: {
        labels: statsData.budget.labels,
        datasets: [
          {
            label: 'Budget (en millions DA)',
            data: statsData.budget.planned,
            borderColor: '#0056b3',
            backgroundColor: 'rgba(0, 86, 179, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Dépenses (en millions DA)',
            data: statsData.budget.spent,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Gestion du changement d'année
    document.getElementById('stats-year').addEventListener('change', function() {
      // Ici vous chargeriez les nouvelles données pour l'année sélectionnée
      console.log('Chargement des données pour', this.value);
      // Simuler un chargement
      setTimeout(() => {
        alert(`Données pour ${this.value} chargées (simulation)`);
      }, 500);
    });
  });
