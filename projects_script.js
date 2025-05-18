document.addEventListener("DOMContentLoaded", () => {
    // Référence aux éléments du DOM
    const projectsTableBody = document.getElementById("projects-table-body")
    const searchInput = document.querySelector(".search-input")
    const typeFilter = document.getElementById("type-filter")
    const statusFilter = document.getElementById("status-filter")
    const exportBtn = document.getElementById("export-btn")
    const exportOptions = document.getElementById("export-options")
    const exportExcel = document.getElementById("export-excel")
    const exportPdf = document.getElementById("export-pdf")
    const exportCsv = document.getElementById("export-csv")
    const printBtn = document.getElementById("print-btn")
    const projectDetailsModal = document.getElementById("project-details-modal")
    const modalClose = document.querySelector(".modal-close")
    const projectDetailsContent = document.querySelector(".project-details-content")
    const paginationItems = document.querySelectorAll(".pagination .page-item")
  
    // Données combinées des projets (électrification et investissement)
    const projectsData = [
      // Projets d'électrification
      {
        code: "ELEC-2024-05-123",
        type: "electrification",
        title: "Électrification Zone Agricole Oued Zenati",
        location: "Oued Zenati",
        budget: 45000000,
        startDate: "2024-03-15",
        endDate: "2024-09-30",
        status: "in-progress",
        details: {
          contractor: "Entreprise Électrique SARL",
          powerCapacity: "250 kW",
          beneficiaries: "15 exploitations agricoles",
          description:
            "Installation de lignes électriques et transformateurs pour alimenter la zone agricole d'Oued Zenati.",
        },
      },
      {
        code: "ELEC-2024-04-089",
        type: "electrification",
        title: "Réseau Électrique Fermes Héliopolis",
        location: "Héliopolis",
        budget: 32000000,
        startDate: "2024-06-01",
        endDate: "2024-12-15",
        status: "planned",
        details: {
          contractor: "ElectroPower Algérie",
          powerCapacity: "180 kW",
          beneficiaries: "8 fermes d'élevage",
          description: "Mise en place d'un réseau électrique pour les fermes d'élevage dans la commune d'Héliopolis.",
        },
      },
      {
        code: "ELEC-2024-03-045",
        type: "electrification",
        title: "Électrification Serres Bouchegouf",
        location: "Bouchegouf",
        budget: 28500000,
        startDate: "2023-11-10",
        endDate: "2024-04-20",
        status: "completed",
        details: {
          contractor: "Consortium Électrique Est",
          powerCapacity: "120 kW",
          beneficiaries: "12 serres agricoles",
          description: "Installation complète du réseau électrique pour alimenter les serres agricoles de Bouchegouf.",
        },
      },
      {
        code: "ELEC-2024-02-078",
        type: "electrification",
        title: "Alimentation Électrique Station Pompage",
        location: "Guelma",
        budget: 18700000,
        startDate: "2023-09-05",
        endDate: "2024-02-28",
        status: "completed",
        details: {
          contractor: "HydroPower EURL",
          powerCapacity: "90 kW",
          beneficiaries: "Zone d'irrigation 200 hectares",
          description: "Électrification de la station de pompage principale pour l'irrigation de la plaine de Guelma.",
        },
      },
      {
        code: "ELEC-2024-01-112",
        type: "electrification",
        title: "Réseau Électrique Coopérative Agricole",
        location: "Aïn Makhlouf",
        budget: 35200000,
        startDate: "2024-02-15",
        endDate: "2024-08-30",
        status: "in-progress",
        details: {
          contractor: "ElectroBuild SPA",
          powerCapacity: "200 kW",
          beneficiaries: "Coopérative de 25 agriculteurs",
          description:
            "Installation du réseau électrique pour la coopérative agricole d'Aïn Makhlouf, incluant les bâtiments administratifs et les zones de stockage.",
        },
      },
  
      // Projets d'investissement
      {
        code: "INV-2024-001",
        type: "investment",
        title: "Construction Centre Santé",
        location: "Subdivision Nord",
        budget: 150000000,
        startDate: "2024-01-15",
        endDate: "2024-11-30",
        status: "in-progress",
        details: {
          contractor: "Entreprise BTP SARL",
          progress: 63,
          description: "Construction d'un centre de santé pour les travailleurs agricoles dans la subdivision Nord.",
        },
      },
      {
        code: "INV-2024-002",
        type: "investment",
        title: "Équipement Lycée Technique",
        location: "Subdivision Sud",
        budget: 75000000,
        startDate: "2024-03-01",
        endDate: "2024-09-30",
        status: "in-progress",
        details: {
          contractor: "Fournisseur Équipements",
          progress: 80,
          description: "Fourniture et installation d'équipements pour le lycée technique agricole.",
        },
      },
      {
        code: "INV-2024-003",
        type: "investment",
        title: "Aménagement Parc Urbain",
        location: "Subdivision Est",
        budget: 45000000,
        startDate: "2024-05-10",
        endDate: "2024-12-15",
        status: "planned",
        details: {
          contractor: "Paysagiste ENP",
          progress: 33,
          description: "Aménagement d'un parc urbain avec espaces verts et zones de loisirs.",
        },
      },
      {
        code: "INV-2023-004",
        type: "investment",
        title: "Réhabilitation Route Principale",
        location: "Subdivision Ouest",
        budget: 280000000,
        startDate: "2023-02-01",
        endDate: "2023-10-15",
        status: "completed",
        details: {
          contractor: "Génie Civil EURL",
          progress: 100,
          description: "Réhabilitation complète de la route principale desservant les zones agricoles.",
        },
      },
      {
        code: "INV-2024-005",
        type: "investment",
        title: "Système Irrigation Agricole",
        location: "Subdivision Sud",
        budget: 90000000,
        startDate: "2024-06-01",
        endDate: "2024-12-31",
        status: "planned",
        details: {
          contractor: "AgriTech SA",
          progress: 0,
          description: "Installation d'un système d'irrigation moderne pour les exploitations agricoles.",
        },
      },
    ]
  
    // Charger les projets au démarrage
    loadProjects(projectsData)
    updateStats(projectsData)
    animateCounters()
  
    // Gestionnaire pour la recherche
    searchInput.addEventListener("input", filterProjects)
  
    // Gestionnaires pour les filtres
    typeFilter.addEventListener("change", filterProjects)
    statusFilter.addEventListener("change", filterProjects)
  
    // Gestionnaire pour le bouton d'exportation
    exportBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      exportOptions.classList.toggle("show")
    })
  
    // Fermer les options d'exportation si on clique ailleurs
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#export-btn") && exportOptions.classList.contains("show")) {
        exportOptions.classList.remove("show")
      }
    })
  
    // Gestionnaires pour les options d'exportation
    exportExcel.addEventListener("click", () => {
      exportOptions.classList.remove("show")
      exportToExcel()
    })
  
    exportPdf.addEventListener("click", () => {
      exportOptions.classList.remove("show")
      exportToPDF()
    })
  
    exportCsv.addEventListener("click", () => {
      exportOptions.classList.remove("show")
      exportToCSV()
    })
  
    // Gestionnaire pour le bouton d'impression
    printBtn.addEventListener("click", printProjects)
  
    // Fermer la modal de détails
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        projectDetailsModal.classList.remove("show")
      })
    }
  
    // Fermer la modal en cliquant en dehors
    projectDetailsModal.addEventListener("click", (e) => {
      if (e.target === projectDetailsModal) {
        projectDetailsModal.classList.remove("show")
      }
    })
  
    // Initialisation de la pagination
    paginationItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (!this.classList.contains("active") && !this.querySelector("i")) {
          document.querySelector(".pagination .active").classList.remove("active")
          this.classList.add("active")
          showNotification(`Page ${this.textContent} chargée`)
        }
      })
    })
  
    // Fonction pour charger les projets dans le tableau
    function loadProjects(projects) {
      projectsTableBody.innerHTML = ""
  
      projects.forEach((project) => {
        const row = document.createElement("tr")
  
        // Déterminer la classe de badge pour le type
        const typeClass = project.type === "electrification" ? "type-electrification" : "type-investment"
        const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
  
        // Déterminer la classe de badge pour le statut
        let statusClass = ""
        let statusLabel = ""
  
        switch (project.status) {
          case "in-progress":
            statusClass = "status-in-progress"
            statusLabel = "En cours"
            break
          case "planned":
            statusClass = "status-planned"
            statusLabel = "Planifié"
            break
          case "completed":
            statusClass = "status-completed"
            statusLabel = "Terminé"
            break
        }
  
        // Formater les dates
        const startDate = formatDate(project.startDate)
        const endDate = formatDate(project.endDate)
  
        // Formater le budget
        const formattedBudget = formatNumber(project.budget) + " DA"
  
        row.innerHTML = `
          <td>${project.code}</td>
          <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
          <td>${project.title}</td>
          <td>${project.location}</td>
          <td>${formattedBudget}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
          <td class="actions-cell">
            <button class="action-btn view-btn" title="Voir les détails" data-code="${project.code}">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn export-btn" title="Exporter en PDF" data-code="${project.code}">
              <i class="fas fa-file-pdf"></i>
            </button>
            <button class="action-btn print-btn" title="Imprimer" data-code="${project.code}">
              <i class="fas fa-print"></i>
            </button>
          </td>
        `
  
        projectsTableBody.appendChild(row)
      })
  
      // Ajouter les gestionnaires d'événements aux boutons d'action
      addActionButtonsEventListeners()
    }
  
    // Fonction pour ajouter les gestionnaires d'événements aux boutons d'action
    function addActionButtonsEventListeners() {
      // Boutons de visualisation
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const projectCode = this.getAttribute("data-code")
          const project = findProjectByCode(projectCode)
          if (project) {
            showProjectDetails(project)
          }
        })
      })
  
      // Boutons d'exportation PDF
      document.querySelectorAll(".export-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const projectCode = this.getAttribute("data-code")
          const project = findProjectByCode(projectCode)
          if (project) {
            exportProjectToPDF(project)
          }
        })
      })
  
      // Boutons d'impression
      document.querySelectorAll(".print-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const projectCode = this.getAttribute("data-code")
          const project = findProjectByCode(projectCode)
          if (project) {
            printProjectDetails(project)
          }
        })
      })
    }
  
    // Fonction pour trouver un projet par son code
    function findProjectByCode(code) {
      return projectsData.find((project) => project.code === code)
    }
  
    // Fonction pour filtrer les projets
    function filterProjects() {
      const searchTerm = searchInput.value.toLowerCase()
      const selectedType = typeFilter.value
      const selectedStatus = statusFilter.value
  
      const filteredProjects = projectsData.filter((project) => {
        // Filtre par terme de recherche
        const matchesSearch =
          project.code.toLowerCase().includes(searchTerm) ||
          project.title.toLowerCase().includes(searchTerm) ||
          project.location.toLowerCase().includes(searchTerm)
  
        // Filtre par type
        const matchesType = selectedType === "all" || project.type === selectedType
  
        // Filtre par statut
        const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
  
        return matchesSearch && matchesType && matchesStatus
      })
  
      loadProjects(filteredProjects)
      updateStats(filteredProjects)
    }
  
    // Fonction pour mettre à jour les statistiques
    function updateStats(projects) {
      const totalProjects = projects.length
      const electrificationProjects = projects.filter((p) => p.type === "electrification").length
      const investmentProjects = projects.filter((p) => p.type === "investment").length
      const completedProjects = projects.filter((p) => p.status === "completed").length
  
      document
        .querySelector(".stats-cards .stat-card:nth-child(1) .stat-value")
        .setAttribute("data-target", totalProjects)
      document
        .querySelector(".stats-cards .stat-card:nth-child(2) .stat-value")
        .setAttribute("data-target", electrificationProjects)
      document
        .querySelector(".stats-cards .stat-card:nth-child(3) .stat-value")
        .setAttribute("data-target", investmentProjects)
      document
        .querySelector(".stats-cards .stat-card:nth-child(4) .stat-value")
        .setAttribute("data-target", completedProjects)
  
      animateCounters()
    }
  
    // Fonction pour animer les compteurs
    function animateCounters() {
      const counters = document.querySelectorAll(".counter")
  
      counters.forEach((counter) => {
        const target = +counter.getAttribute("data-target")
        const count = +counter.innerText
        const increment = target / 20
  
        if (count < target) {
          counter.innerText = Math.ceil(count + increment)
          setTimeout(() => animateCounters(), 50)
        } else {
          counter.innerText = target
        }
      })
    }
  
    // Fonction pour afficher les détails d'un projet
    function showProjectDetails(project) {
      // Déterminer le type de projet pour l'affichage
      const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
  
      // Déterminer le statut pour l'affichage
      let statusLabel = ""
      let statusClass = ""
  
      switch (project.status) {
        case "in-progress":
          statusLabel = "En cours"
          statusClass = "status-active-text"
          break
        case "planned":
          statusLabel = "Planifié"
          statusClass = "status-pending-text"
          break
        case "completed":
          statusLabel = "Terminé"
          statusClass = "status-completed-text"
          break
      }
  
      // Formater les dates et le budget
      const startDate = formatDate(project.startDate)
      const endDate = formatDate(project.endDate)
      const formattedBudget = formatNumber(project.budget) + " DA"
  
      // Construire le contenu HTML pour les détails spécifiques au type de projet
      let specificDetails = ""
  
      if (project.type === "electrification") {
        specificDetails = `
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-bolt"></i> Capacité électrique:</span>
            <span class="detail-value">${project.details.powerCapacity}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-users"></i> Bénéficiaires:</span>
            <span class="detail-value">${project.details.beneficiaries}</span>
          </div>
        `
      } else {
        specificDetails = `
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-tasks"></i> Avancement:</span>
            <span class="detail-value">
              <div class="progress-container" style="height: 8px; background-color: #e0e0e0; border-radius: 4px; overflow: hidden; margin-top: 5px;">
                <div style="height: 100%; width: ${project.details.progress}%; background-color: var(--success-color); border-radius: 4px;"></div>
              </div>
              <span style="font-size: 0.9rem; margin-top: 5px; display: inline-block;">${project.details.progress}%</span>
            </span>
          </div>
        `
      }
  
      // Construire le contenu HTML complet
      projectDetailsContent.innerHTML = `
        <div class="project-detail-card">
          <div class="detail-header">
            <h4>${project.title}</h4>
            <span class="detail-code">${project.code} - ${typeLabel}</span>
          </div>
          <div class="detail-body">
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Localisation:</span>
              <span class="detail-value">${project.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-money-bill-wave"></i> Budget:</span>
              <span class="detail-value">${formattedBudget}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-alt"></i> Période:</span>
              <span class="detail-value">Du ${startDate} au ${endDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-building"></i> Entreprise:</span>
              <span class="detail-value">${project.details.contractor}</span>
            </div>
            ${specificDetails}
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-info-circle"></i> Statut:</span>
              <span class="detail-value ${statusClass}">${statusLabel}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-align-left"></i> Description:</span>
              <span class="detail-value">${project.details.description}</span>
            </div>
          </div>
        </div>
      `
  
      // Afficher la modal
      projectDetailsModal.classList.add("show")
    }
  
    // Fonction pour exporter tous les projets en Excel
    function exportToExcel() {
      showNotification("Exportation en Excel en cours...")
  
      // Simuler un délai de traitement
      setTimeout(() => {
        try {
          // Créer un tableau HTML qui ressemble à Excel
          let excelContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <!--[if gte mso 9]>
              <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>Projets DSA</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
              </xml>
              <![endif]-->
              <style>
                table, th, td {
                  border: 1px solid black;
                  border-collapse: collapse;
                  padding: 5px;
                }
                th {
                  background-color: #f2f2f2;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Intitulé</th>
                    <th>Localisation</th>
                    <th>Budget</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
          `
  
          // Ajouter les données des projets
          projectsData.forEach((project) => {
            const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
            let statusLabel = ""
  
            switch (project.status) {
              case "in-progress":
                statusLabel = "En cours"
                break
              case "planned":
                statusLabel = "Planifié"
                break
              case "completed":
                statusLabel = "Terminé"
                break
            }
  
            const startDate = formatDate(project.startDate)
            const endDate = formatDate(project.endDate)
            const formattedBudget = formatNumber(project.budget) + " DA"
  
            excelContent += `
              <tr>
                <td>${project.code}</td>
                <td>${typeLabel}</td>
                <td>${project.title}</td>
                <td>${project.location}</td>
                <td>${formattedBudget}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${statusLabel}</td>
              </tr>
            `
          })
  
          excelContent += `
                </tbody>
              </table>
            </body>
            </html>
          `
  
          // Créer un Blob avec le contenu HTML
          const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
  
          // Créer un URL pour le blob
          const url = window.URL.createObjectURL(blob)
  
          // Créer un élément <a> pour le téléchargement
          const link = document.createElement("a")
          link.href = url
          link.download = "projets_dsa.xls"
  
          // Ajouter au DOM, cliquer, puis supprimer
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
  
          // Libérer l'URL
          window.URL.revokeObjectURL(url)
  
          showNotification("Exportation en Excel terminée avec succès !")
        } catch (error) {
          console.error("Erreur lors de l'exportation:", error)
          showNotification("Erreur lors de l'exportation. Veuillez réessayer.")
        }
      }, 1500)
    }
  
    // Fonction pour exporter tous les projets en PDF
    function exportToPDF() {
      showNotification("Exportation en PDF en cours...")
  
      try {
        // Créer un élément pour contenir le contenu à exporter
        const element = document.createElement("div")
        element.innerHTML = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 18px; margin-bottom: 5px;">Direction des Services Agricoles - Guelma</h1>
              <h2 style="font-size: 16px; margin-bottom: 5px;">Liste des Projets</h2>
              <p style="font-size: 14px; color: #666;">Date d'exportation: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Code</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Intitulé</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Localisation</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Budget</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date début</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date fin</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Statut</th>
                </tr>
              </thead>
              <tbody>
                ${projectsData
                  .map((project) => {
                    const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
                    let statusLabel = ""
  
                    switch (project.status) {
                      case "in-progress":
                        statusLabel = "En cours"
                        break
                      case "planned":
                        statusLabel = "Planifié"
                        break
                      case "completed":
                        statusLabel = "Terminé"
                        break
                    }
  
                    const startDate = formatDate(project.startDate)
                    const endDate = formatDate(project.endDate)
                    const formattedBudget = formatNumber(project.budget) + " DA"
  
                    return `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.code}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${typeLabel}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.title}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.location}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${formattedBudget}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${startDate}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${endDate}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${statusLabel}</td>
                    </tr>
                  `
                  })
                  .join("")}
              </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
              <p>&copy; 2024 Direction des Services Agricoles - Guelma. Tous droits réservés.</p>
            </div>
          </div>
        `
  
        // Options pour html2pdf
        const options = {
          margin: 10,
          filename: "projets_dsa.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        }
  
        // Générer le PDF
        const worker = html2pdf().from(element).set(options).save()
        worker
          .then(() => {
            showNotification("Exportation en PDF terminée avec succès !")
          })
          .catch((error) => {
            console.error("Erreur lors de l'exportation en PDF:", error)
            showNotification("Erreur lors de l'exportation en PDF. Veuillez réessayer.")
          })
      } catch (error) {
        console.error("Erreur lors de l'exportation en PDF:", error)
        showNotification("Erreur lors de l'exportation en PDF. Veuillez réessayer.")
      }
    }
  
    // Fonction pour exporter un projet spécifique en PDF
    function exportProjectToPDF(project) {
      showNotification(`Exportation du projet ${project.code} en PDF...`)
  
      try {
        // Déterminer le type de projet pour l'affichage
        const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
  
        // Déterminer le statut pour l'affichage
        let statusLabel = ""
        switch (project.status) {
          case "in-progress":
            statusLabel = "En cours"
            break
          case "planned":
            statusLabel = "Planifié"
            break
          case "completed":
            statusLabel = "Terminé"
            break
        }
  
        // Formater les dates et le budget
        const startDate = formatDate(project.startDate)
        const endDate = formatDate(project.endDate)
        const formattedBudget = formatNumber(project.budget) + " DA"
  
        // Construire le contenu HTML pour les détails spécifiques au type de projet
        let specificDetails = ""
        if (project.type === "electrification") {
          specificDetails = `
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Capacité électrique</th>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.details.powerCapacity}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Bénéficiaires</th>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.details.beneficiaries}</td>
            </tr>
          `
        } else {
          specificDetails = `
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Avancement</th>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.details.progress}%</td>
            </tr>
          `
        }
  
        // Créer un élément pour contenir le contenu à exporter
        const element = document.createElement("div")
        element.innerHTML = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 18px; margin-bottom: 5px;">Direction des Services Agricoles - Guelma</h1>
              <h2 style="font-size: 16px; margin-bottom: 5px; color: #2d4f4f;">Détails du Projet: ${project.title}</h2>
              <p style="font-family: monospace; color: #666;">Code: ${project.code} - Type: ${typeLabel}</p>
              <p style="font-size: 14px; color: #666;">Date d'exportation: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Localisation</th>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.location}</td>
              </tr>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Budget</th>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${formattedBudget}</td>
              </tr>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Période</th>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">Du ${startDate} au ${endDate}</td>
              </tr>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Entreprise</th>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.details.contractor}</td>
              </tr>
              ${specificDetails}
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%; background-color: #f2f2f2;">Statut</th>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${statusLabel}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
              <h3 style="margin-top: 0; color: #2d4f4f;">Description du projet</h3>
              <p>${project.details.description}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
              <p>&copy; 2024 Direction des Services Agricoles - Guelma. Tous droits réservés.</p>
            </div>
          </div>
        `
  
        // Options pour html2pdf
        const options = {
          margin: 10,
          filename: `projet_${project.code}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }
  
        // Générer le PDF
        const worker = html2pdf().from(element).set(options).save()
        worker
          .then(() => {
            showNotification(`Exportation du projet ${project.code} terminée avec succès !`)
          })
          .catch((error) => {
            console.error("Erreur lors de l'exportation en PDF:", error)
            showNotification("Erreur lors de l'exportation en PDF. Veuillez réessayer.")
          })
      } catch (error) {
        console.error("Erreur lors de l'exportation en PDF:", error)
        showNotification("Erreur lors de l'exportation en PDF. Veuillez réessayer.")
      }
    }
  
    // Fonction pour exporter tous les projets en CSV
    function exportToCSV() {
      showNotification("Exportation en CSV en cours...")
  
      // Simuler un délai de traitement
      setTimeout(() => {
        try {
          // Créer l'en-tête BOM pour UTF-8
          const BOM = "\uFEFF"
          let csvContent = BOM + "Code,Type,Intitulé,Localisation,Budget,Date début,Date fin,Statut\n"
  
          // Ajouter les données des projets
          projectsData.forEach((project) => {
            const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
            let statusLabel = ""
  
            switch (project.status) {
              case "in-progress":
                statusLabel = "En cours"
                break
              case "planned":
                statusLabel = "Planifié"
                break
              case "completed":
                statusLabel = "Terminé"
                break
            }
  
            const startDate = formatDate(project.startDate)
            const endDate = formatDate(project.endDate)
            const formattedBudget = formatNumber(project.budget)
  
            // Échapper les guillemets et ajouter des guillemets autour du texte
            const escapedTitle = `"${project.title.replace(/"/g, '""')}"`
            const escapedLocation = `"${project.location.replace(/"/g, '""')}"`
  
            csvContent += `${project.code},${typeLabel},${escapedTitle},${escapedLocation},${formattedBudget} DA,${startDate},${endDate},${statusLabel}\n`
          })
  
          // Créer un Blob avec les données CSV
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  
          // Créer un URL pour le blob
          const url = window.URL.createObjectURL(blob)
  
          // Créer un élément <a> pour le téléchargement
          const link = document.createElement("a")
          link.href = url
          link.download = "projets_dsa.csv"
  
          // Ajouter au DOM, cliquer, puis supprimer
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
  
          // Libérer l'URL
          window.URL.revokeObjectURL(url)
  
          showNotification("Exportation en CSV terminée avec succès !")
        } catch (error) {
          console.error("Erreur lors de l'exportation:", error)
          showNotification("Erreur lors de l'exportation. Veuillez réessayer.")
        }
      }, 1500)
    }
  
    // Fonction pour préparer le contenu à imprimer pour tous les projets
    function preparePrintContent() {
      const title = document.querySelector(".page-title h2").textContent
      const date = new Date().toLocaleDateString()
  
      let tableContent = `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Code</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Intitulé</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Localisation</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Budget</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date début</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date fin</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Statut</th>
            </tr>
          </thead>
          <tbody>
      `
  
      // Ajouter les données des projets
      projectsData.forEach((project) => {
        const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
        let statusLabel = ""
  
        switch (project.status) {
          case "in-progress":
            statusLabel = "En cours"
            break
          case "planned":
            statusLabel = "Planifié"
            break
          case "completed":
            statusLabel = "Terminé"
            break
        }
  
        const startDate = formatDate(project.startDate)
        const endDate = formatDate(project.endDate)
        const formattedBudget = formatNumber(project.budget) + " DA"
  
        tableContent += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.code}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${typeLabel}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.title}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${project.location}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${formattedBudget}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${startDate}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${endDate}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${statusLabel}</td>
          </tr>
        `
      })
  
      tableContent += `
          </tbody>
        </table>
      `
  
      // Créer le contenu HTML pour l'impression
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Projets DSA - ${date}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-header h1 { font-size: 18px; margin-bottom: 5px; }
            .print-header h2 { font-size: 16px; margin-bottom: 5px; }
            .print-header p { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .print-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Direction des Services Agricoles - Guelma</h1>
            <h2>${title}</h2>
            <p>Date d'impression: ${date}</p>
          </div>
          ${tableContent}
          <div class="print-footer">
            <p>&copy; 2024 Direction des Services Agricoles - Guelma. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `
    }
  
    // Fonction pour préparer le contenu à imprimer pour un projet spécifique
    function prepareProjectPrintContent(project) {
      const date = new Date().toLocaleDateString()
      const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"
  
      // Déterminer le statut pour l'affichage
      let statusLabel = ""
  
      switch (project.status) {
        case "in-progress":
          statusLabel = "En cours"
          break
        case "planned":
          statusLabel = "Planifié"
          break
        case "completed":
          statusLabel = "Terminé"
          break
      }
  
      // Formater les dates et le budget
      const startDate = formatDate(project.startDate)
      const endDate = formatDate(project.endDate)
      const formattedBudget = formatNumber(project.budget) + " DA"
  
      // Construire le contenu HTML pour les détails spécifiques au type de projet
      let specificDetails = ""
  
      if (project.type === "electrification") {
        specificDetails = `
          <tr>
            <td><strong>Capacité électrique</strong></td>
            <td>${project.details.powerCapacity}</td>
          </tr>
          <tr>
            <td><strong>Bénéficiaires</strong></td>
            <td>${project.details.beneficiaries}</td>
          </tr>
        `
      } else {
        specificDetails = `
          <tr>
            <td><strong>Avancement</strong></td>
            <td>${project.details.progress}%</td>
          </tr>
        `
      }
  
      // Créer le contenu HTML pour l'impression
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Projet ${project.code} - ${date}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-header h1 { font-size: 18px; margin-bottom: 5px; }
            .print-header h2 { font-size: 16px; margin-bottom: 5px; color: #2d4f4f; }
            .print-header p { font-size: 14px; color: #666; }
            .project-code { font-family: monospace; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; width: 30%; }
            .print-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .description { margin-top: 20px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9; }
            .description h3 { margin-top: 0; color: #2d4f4f; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Direction des Services Agricoles - Guelma</h1>
            <h2>Détails du Projet: ${project.title}</h2>
            <p class="project-code">Code: ${project.code} - Type: ${typeLabel}</p>
            <p>Date d'impression: ${date}</p>
          </div>
          
          <table>
            <tr>
              <th>Localisation</th>
              <td>${project.location}</td>
            </tr>
            <tr>
              <th>Budget</th>
              <td>${formattedBudget}</td>
            </tr>
            <tr>
              <th>Période</th>
              <td>Du ${startDate} au ${endDate}</td>
            </tr>
            <tr>
              <th>Entreprise</th>
              <td>${project.details.contractor}</td>
            </tr>
            ${specificDetails}
            <tr>
              <th>Statut</th>
              <td>${statusLabel}</td>
            </tr>
          </table>
          
          <div class="description">
            <h3>Description du projet</h3>
            <p>${project.details.description}</p>
          </div>
          
          <div class="print-footer">
            <p>&copy; 2024 Direction des Services Agricoles - Guelma. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `
    }
  
    // Fonction pour imprimer tous les projets
    function printProjects() {
      showNotification("Préparation de l'impression...")
  
      // Préparer le contenu pour l'impression
      const printContent = preparePrintContent()
  
      // Créer un iframe invisible pour l'impression
      const printFrame = document.createElement("iframe")
      printFrame.name = "print-frame"
      printFrame.style.position = "absolute"
      printFrame.style.top = "-1000px"
      printFrame.style.left = "-1000px"
      document.body.appendChild(printFrame)
  
      // Écrire le contenu dans l'iframe
      printFrame.contentDocument.write(printContent)
      printFrame.contentDocument.close()
  
      // Attendre que le contenu soit chargé
      printFrame.onload = () => {
        setTimeout(() => {
          try {
            // Imprimer l'iframe
            window.frames["print-frame"].focus()
            window.frames["print-frame"].print()
  
            // Supprimer l'iframe après l'impression
            setTimeout(() => {
              document.body.removeChild(printFrame)
              showNotification("Impression terminée avec succès !")
            }, 1000)
          } catch (error) {
            console.error("Erreur lors de l'impression:", error)
            showNotification("Erreur lors de l'impression. Veuillez réessayer.")
          }
        }, 500)
      }
    }
  
    // Fonction pour imprimer les détails d'un projet spécifique
    function printProjectDetails(project) {
      showNotification(`Préparation de l'impression du projet ${project.code}...`)
  
      // Préparer le contenu pour l'impression
      const printContent = prepareProjectPrintContent(project)
  
      // Créer un iframe invisible pour l'impression
      const printFrame = document.createElement("iframe")
      printFrame.name = "print-frame"
      printFrame.style.position = "absolute"
      printFrame.style.top = "-1000px"
      printFrame.style.left = "-1000px"
      document.body.appendChild(printFrame)
  
      // Écrire le contenu dans l'iframe
      printFrame.contentDocument.write(printContent)
      printFrame.contentDocument.close()
  
      // Attendre que le contenu soit chargé
      printFrame.onload = () => {
        setTimeout(() => {
          try {
            // Imprimer l'iframe
            window.frames["print-frame"].focus()
            window.frames["print-frame"].print()
  
            // Supprimer l'iframe après l'impression
            setTimeout(() => {
              document.body.removeChild(printFrame)
              showNotification(`Impression du projet ${project.code} terminée avec succès !`)
            }, 1000)
          } catch (error) {
            console.error("Erreur lors de l'impression:", error)
            showNotification("Erreur lors de l'impression. Veuillez réessayer.")
          }
        }, 500)
      }
    }
  
    // Fonction pour afficher une notification
    function showNotification(message) {
      // Créer l'élément de notification
      const notification = document.createElement("div")
      notification.className = "notification"
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
        </div>
      `
  
      // Ajouter au DOM
      document.body.appendChild(notification)
  
      // Afficher la notification
      setTimeout(() => {
        notification.classList.add("show")
  
        // Masquer après 3 secondes
        setTimeout(() => {
          notification.classList.remove("show")
  
          // Supprimer du DOM après l'animation
          setTimeout(() => {
            document.body.removeChild(notification)
          }, 500)
        }, 3000)
      }, 100)
    }
  
    // Fonction pour formater une date au format DD/MM/YYYY
    function formatDate(dateString) {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
  
    // Fonction pour formater un nombre avec séparateur de milliers
    function formatNumber(num) {
      return new Intl.NumberFormat("fr-FR").format(num)
    }
  })
  