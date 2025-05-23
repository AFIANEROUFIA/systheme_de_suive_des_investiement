document.addEventListener("DOMContentLoaded", () => {
  // Données de démonstration avec coordonnées réelles de Guelma
  const investmentsData = [
    {
      id: "INV-2024-001",
      title: "Construction Centre Santé",
      program: "Normal",
      budget: 150000000,
      engaged: 120000000,
      paid: 95000000,
      remainingBudget: 55000000,
      progress: 63,
      status: "in-progress",
      year: 2024,
      startDate: "2024-01-15",
      endDate: "2024-11-30",
      contractor: "Entreprise BTP SARL",
      location: "Subdivision Nord",
      daira: "Guelma",
      commune: "Guelma",
      coordinates: { lat: 36.4621, lng: 7.4261 },
      observations: [
        { date: "2024-01-20", text: "Début des travaux de fondation", author: "Chef Service" },
        { date: "2024-03-15", text: "Premier paiement effectué - 30% des travaux réalisés", author: "Chef Service" },
      ],
    },
    {
      id: "INV-2024-002",
      title: "Équipement Lycée Technique",
      program: "PSNE",
      budget: 75000000,
      engaged: 75000000,
      paid: 60000000,
      remainingBudget: 15000000,
      progress: 80,
      status: "in-progress",
      year: 2024,
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      contractor: "Fournisseur Équipements",
      location: "Subdivision Sud",
      daira: "Héliopolis",
      commune: "Héliopolis",
      coordinates: { lat: 36.5033, lng: 7.445 },
      observations: [{ date: "2024-03-05", text: "Livraison partielle des équipements", author: "Chef Service" }],
    },
    {
      id: "INV-2024-003",
      title: "Aménagement Parc Urbain",
      program: "Urgence",
      budget: 45000000,
      engaged: 30000000,
      paid: 15000000,
      remainingBudget: 30000000,
      progress: 33,
      status: "in-progress",
      year: 2024,
      startDate: "2024-05-10",
      endDate: "2024-12-15",
      contractor: "Paysagiste ENP",
      location: "Subdivision Est",
      daira: "Bouchegouf",
      commune: "Bouchegouf",
      coordinates: { lat: 36.4572, lng: 7.7233 },
      observations: [],
    },
    {
      id: "INV-2023-004",
      title: "Réhabilitation Route Principale",
      program: "Normal",
      budget: 280000000,
      engaged: 280000000,
      paid: 280000000,
      remainingBudget: 0,
      progress: 100,
      status: "completed",
      year: 2023,
      startDate: "2023-02-01",
      endDate: "2023-10-15",
      contractor: "Génie Civil EURL",
      location: "Subdivision Ouest",
      daira: "Oued Zenati",
      commune: "Oued Zenati",
      coordinates: { lat: 36.32, lng: 7.1667 },
      observations: [{ date: "2023-10-10", text: "Projet terminé et réceptionné", author: "Chef Service" }],
    },
    {
      id: "INV-2024-005",
      title: "Système Irrigation Agricole",
      program: "Spécial",
      budget: 90000000,
      engaged: 45000000,
      paid: 0,
      remainingBudget: 90000000,
      progress: 0,
      status: "planned",
      year: 2024,
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      contractor: "AgriTech SA",
      location: "Subdivision Sud",
      daira: "Hammam Debagh",
      commune: "Hammam Debagh",
      coordinates: { lat: 36.2333, lng: 7.2167 },
      observations: [],
    },
  ]

  // Initialisation
  loadInvestments()
  setupExportButtons()
  setupMapButton()
  setupNavigation()

  // Gestion des filtres
  const yearSelect = document.getElementById("year")
  const programSelect = document.getElementById("program")
  const searchInput = document.querySelector(".search-box input")

  yearSelect.addEventListener("change", filterInvestments)
  programSelect.addEventListener("change", filterInvestments)
  searchInput.addEventListener("input", filterInvestments)

  // Bouton Nouvel Investissement
  const newInvestmentBtn = document.getElementById("new-investment-btn")
  newInvestmentBtn.addEventListener("click", openNewInvestmentModal)

  function setupNavigation() {
    // Marquer l'élément de navigation actuel
    const currentPage =
      window.location.pathname.split("/").pop() || "investissement-4veeJVY41xsbA6WOkNlRpmagWXsojJ.html"
    const navItems = document.querySelectorAll(".nav-item")

    navItems.forEach((item) => {
      const link = item.querySelector("a")
      if (link && link.getAttribute("href") === currentPage) {
        item.classList.add("active")
      }

      item.addEventListener("click", function () {
        navItems.forEach((navItem) => navItem.classList.remove("active"))
        this.classList.add("active")
      })
    })
  }

  function setupMapButton() {
    const mapBtn = document.getElementById("map-btn")
    if (mapBtn) {
      mapBtn.addEventListener("click", showInvestmentsMap)
    }
  }

  // Fonction pour initialiser Google Maps
  function initGoogleMap() {
    console.log("Initialisation de Google Maps...")

    if (!window.google || !window.google.maps) {
      console.error("L'API Google Maps n'est pas chargée")
      return
    }

    const mapContainer = document.getElementById("google-map-container")
    if (!mapContainer) {
      console.error("Le conteneur de carte n'existe pas")
      return
    }

    try {
      // Coordonnées centrées sur Guelma
      const guelma = { lat: 36.4621, lng: 7.4261 }

      // Créer la carte
      const map = new google.maps.Map(mapContainer, {
        zoom: 10,
        center: guelma,
        mapTypeId: "terrain",
        gestureHandling: "cooperative",
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f7fa" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#5c8d8d" }],
          },
        ],
      })

      // Ajouter les marqueurs pour chaque investissement
      investmentsData.forEach((investment) => {
        // Déterminer la couleur du marqueur en fonction du statut
        let markerColor
        switch (investment.status) {
          case "in-progress":
            markerColor = "#d4af37" // gold
            break
          case "planned":
            markerColor = "#3a6363" // medium-teal
            break
          case "completed":
            markerColor = "#28a745" // success
            break
          case "canceled":
            markerColor = "#dc3545" // danger
            break
          default:
            markerColor = "#2d4f4f" // dark-teal
        }

        // Créer le marqueur
        const marker = new google.maps.Marker({
          position: investment.coordinates,
          map: map,
          title: `${investment.title} - ${investment.id}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            scale: 12,
          },
          animation: google.maps.Animation.DROP,
        })

        // Ajouter une fenêtre d'info au clic sur le marqueur
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 15px; max-width: 350px; font-family: 'Poppins', sans-serif;">
              <h4 style="margin-top: 0; color: #2d4f4f; font-size: 1.1rem;">${investment.title}</h4>
              <p style="margin: 8px 0;"><strong>Code:</strong> ${investment.id}</p>
              <p style="margin: 8px 0;"><strong>Programme:</strong> ${investment.program}</p>
              <p style="margin: 8px 0;"><strong>Localisation:</strong> ${investment.daira}, ${investment.commune}</p>
              <p style="margin: 8px 0;"><strong>Budget:</strong> ${formatNumber(investment.budget)} DA</p>
              <p style="margin: 8px 0;"><strong>Avancement:</strong> ${investment.progress}%</p>
              <p style="margin: 8px 0;"><strong>Statut:</strong> <span style="color: ${markerColor}; font-weight: bold;">${getStatusText(investment.status)}</span></p>
              <button onclick="showInvestmentDetails('${investment.id}')" style="margin-top: 10px; padding: 8px 16px; background-color: #2d4f4f; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Voir détails
              </button>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      })

      // Ajouter une légende à la carte
      const legend = document.createElement("div")
      legend.style.backgroundColor = "white"
      legend.style.padding = "15px"
      legend.style.margin = "10px"
      legend.style.borderRadius = "8px"
      legend.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
      legend.style.fontFamily = "'Poppins', sans-serif"

      legend.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; color: #2d4f4f;">Légende des Investissements</div>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background-color: #d4af37; border-radius: 50%; margin-right: 10px; border: 2px solid white;"></div>
          <span>En cours</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background-color: #3a6363; border-radius: 50%; margin-right: 10px; border: 2px solid white;"></div>
          <span>Planifié</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background-color: #28a745; border-radius: 50%; margin-right: 10px; border: 2px solid white;"></div>
          <span>Terminé</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 16px; height: 16px; background-color: #dc3545; border-radius: 50%; margin-right: 10px; border: 2px solid white;"></div>
          <span>Annulé</span>
        </div>
      `

      // Positionner la légende en bas à gauche
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend)

      console.log("Carte Google Maps initialisée avec succès")
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error)
    }
  }

  // Rendre la fonction disponible globalement
  window.initGoogleMap = initGoogleMap

  // Fonction pour charger l'API Google Maps
  function loadGoogleMaps() {
    console.log("Chargement de l'API Google Maps...")

    // Supprimer l'ancien script s'il existe
    const oldScript = document.getElementById("google-maps-script")
    if (oldScript) {
      oldScript.remove()
    }

    // Créer un nouveau script
    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyALlweVB5knN_mcAs2e1mbun2duMoS4-7I&callback=initGoogleMap"
    script.async = true
    script.defer = true

    // Ajouter le script au document
    document.head.appendChild(script)
  }

  function showInvestmentsMap() {
    const modal = document.createElement("div")
    modal.className = "map-modal"
    modal.innerHTML = `
      <div class="map-container">
        <div class="map-header">
          <h3><i class="fas fa-map-marked-alt"></i> Carte des Investissements - Wilaya de Guelma</h3>
          <button class="map-close">&times;</button>
        </div>
        <div class="map-content">
          <div id="google-map-container" style="width: 100%; height: 100%;"></div>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Afficher la modal
    setTimeout(() => modal.classList.add("show"), 10)

    // Charger Google Maps si ce n'est pas déjà fait
    if (!window.google || !window.google.maps) {
      loadGoogleMaps()
    } else {
      // Si l'API est déjà chargée, initialiser la carte
      setTimeout(() => initGoogleMap(), 100)
    }

    // Fermer la modal
    modal.querySelector(".map-close").addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => document.body.removeChild(modal), 300)
    })

    // Fermer en cliquant à l'extérieur
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show")
        setTimeout(() => document.body.removeChild(modal), 300)
      }
    })
  }

  function loadInvestments() {
    const tableBody = document.getElementById("investments-table-body")
    tableBody.innerHTML = ""

    investmentsData.forEach((investment, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${investment.id}</td>
                <td>${investment.title}</td>
                <td>${investment.program}</td>
                <td>${formatNumber(investment.budget)} DA</td>
                <td>${formatNumber(investment.engaged)} DA</td>
                <td>${formatNumber(investment.paid)} DA</td>
                <td>${formatNumber(investment.remainingBudget)} DA</td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 0%;" data-width="${investment.progress}%"></div>
                    </div>
                    <small>${investment.progress}%</small>
                </td>
                <td>
                    <span class="status-badge status-${investment.status}">
                        <i class="fas ${getStatusIcon(investment.status)}"></i>
                        ${getStatusText(investment.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${investment.id}" title="Voir les détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" data-id="${investment.id}" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)

      // Animation des barres de progression
      setTimeout(
        () => {
          const progressBar = row.querySelector(".progress-bar")
          progressBar.style.width = progressBar.getAttribute("data-width")
        },
        100 + index * 50,
      ) // Décalage pour effet cascade
    })

    // Ajouter les événements aux boutons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const investmentId = this.getAttribute("data-id")
        showInvestmentDetails(investmentId)
      })
    })

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const investmentId = this.getAttribute("data-id")
        editInvestment(investmentId)
      })
    })
  }

  function setupExportButtons() {
    // Bouton d'exportation avec menu déroulant
    const exportBtn = document.querySelector(".btn-export")
    if (exportBtn) {
      // Remplacer le bouton par un dropdown
      exportBtn.innerHTML = `
        <i class="fas fa-file-export"></i> Exporter <i class="fas fa-chevron-down ml-1"></i>
      `

      // Créer le menu déroulant
      const dropdownMenu = document.createElement("div")
      dropdownMenu.className = "dropdown-menu"
      dropdownMenu.innerHTML = `
        <div class="dropdown-item export-excel">
          <i class="fas fa-file-excel"></i> Exporter en Excel
        </div>
        <div class="dropdown-item export-pdf">
          <i class="fas fa-file-pdf"></i> Exporter en PDF
        </div>
      `

      // Ajouter le menu au conteneur du bouton
      const dropdownContainer = document.createElement("div")
      dropdownContainer.className = "dropdown"
      exportBtn.parentNode.replaceChild(dropdownContainer, exportBtn)
      dropdownContainer.appendChild(exportBtn)
      dropdownContainer.appendChild(dropdownMenu)

      // Événement pour afficher/masquer le menu
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        dropdownMenu.classList.toggle("show")
      })

      // Fermer le menu au clic ailleurs
      document.addEventListener("click", () => {
        dropdownMenu.classList.remove("show")
      })

      // Événements pour les options d'export
      dropdownContainer.querySelector(".export-excel").addEventListener("click", exportToExcel)
      dropdownContainer.querySelector(".export-pdf").addEventListener("click", exportToPDF)
    }

    // Bouton d'impression
    const printBtn = document.querySelector(".btn-print")
    if (printBtn) {
      printBtn.addEventListener("click", printTable)
    }
  }

  function exportToExcel() {
    // Filtrer les données selon les filtres actuels
    const year = document.getElementById("year").value
    const program = document.getElementById("program").value.toLowerCase()
    const searchTerm = document.querySelector(".search-box input").value.toLowerCase()

    const filteredData = investmentsData.filter((investment) => {
      const matchesYear = year === "" || investment.year.toString() === year
      const matchesProgram = program === "" || investment.program.toLowerCase().includes(program)
      const matchesSearch =
        searchTerm === "" ||
        investment.title.toLowerCase().includes(searchTerm) ||
        investment.id.toLowerCase().includes(searchTerm)

      return matchesYear && matchesProgram && matchesSearch
    })

    // Créer un tableau pour l'export
    let tableHTML = '<table border="1" cellpadding="5" cellspacing="0">'
    tableHTML +=
      "<tr><th>N° Op</th><th>Intitulé</th><th>Programme</th><th>Budget</th><th>Engagé</th><th>Payé</th><th>Restant</th><th>Avancement</th><th>Statut</th><th>Daïra</th><th>Commune</th></tr>"

    filteredData.forEach((investment) => {
      tableHTML += "<tr>"
      tableHTML += `<td>${investment.id}</td>`
      tableHTML += `<td>${investment.title}</td>`
      tableHTML += `<td>${investment.program}</td>`
      tableHTML += `<td>${investment.budget}</td>`
      tableHTML += `<td>${investment.engaged}</td>`
      tableHTML += `<td>${investment.paid}</td>`
      tableHTML += `<td>${investment.remainingBudget}</td>`
      tableHTML += `<td>${investment.progress}%</td>`
      tableHTML += `<td>${getStatusText(investment.status)}</td>`
      tableHTML += `<td>${investment.daira || ""}</td>`
      tableHTML += `<td>${investment.commune || ""}</td>`
      tableHTML += "</tr>"
    })

    tableHTML += "</table>"

    // Créer un blob avec le tableau HTML
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)

    // Créer un lien de téléchargement
    const link = document.createElement("a")
    link.href = url
    link.download = `investissements_${new Date().toISOString().split("T")[0]}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showNotification("Données exportées en Excel avec succès")
  }

  function exportToPDF() {
    showNotification("Génération du PDF en cours...", "info")

    // Créer un nouveau document pour l'export PDF
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Liste des Investissements - DSA Guelma</title>
        <style>
          @page { margin: 1cm; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #2d4f4f; 
            padding-bottom: 20px; 
          }
          .header h1 { 
            color: #2d4f4f; 
            margin-bottom: 10px; 
            font-size: 24px;
          }
          .header p { 
            color: #666; 
            margin: 5px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            font-size: 10px; 
          }
          th { 
            background-color: #2d4f4f; 
            color: white; 
            font-weight: bold; 
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 10px; 
            color: #666; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Liste des Investissements</h1>
          <p>Direction des Services Agricoles - Wilaya de Guelma</p>
          <p>Exporté le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>N° Op</th>
              <th>Intitulé</th>
              <th>Programme</th>
              <th>Budget (DA)</th>
              <th>Engagé (DA)</th>
              <th>Payé (DA)</th>
              <th>Restant (DA)</th>
              <th>Avancement</th>
              <th>Statut</th>
              <th>Daïra</th>
              <th>Commune</th>
            </tr>
          </thead>
          <tbody>
            ${investmentsData
              .map(
                (investment) => `
              <tr>
                <td>${investment.id}</td>
                <td>${investment.title}</td>
                <td>${investment.program}</td>
                <td>${formatNumber(investment.budget)}</td>
                <td>${formatNumber(investment.engaged)}</td>
                <td>${formatNumber(investment.paid)}</td>
                <td>${formatNumber(investment.remainingBudget)}</td>
                <td>${investment.progress}%</td>
                <td>${getStatusText(investment.status)}</td>
                <td>${investment.daira || ""}</td>
                <td>${investment.commune || ""}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Document généré automatiquement par le système de gestion des investissements DSA</p>
          <p>Total des investissements: ${investmentsData.length} projets</p>
        </div>
      </body>
      </html>
    `

    // Créer un blob et télécharger
    const blob = new Blob([printContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `investissements_${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showNotification("Fichier PDF généré et téléchargé avec succès")
  }

  function printTable() {
    // Créer une fenêtre d'impression
    const printWindow = window.open("", "_blank")

    // Contenu à imprimer
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Liste des Investissements - DSA Guelma</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
          }
          .print-header { 
            text-align: center; 
            margin-bottom: 20px; 
            padding-bottom: 20px; 
            border-bottom: 2px solid #333;
          }
          .print-header h1 { 
            font-size: 18px; 
            margin-bottom: 5px; 
            color: #333;
          }
          .print-header p { 
            font-size: 14px; 
            color: #666;
            margin: 5px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            font-size: 12px;
          }
          th { 
            background-color: #f0f0f0; 
            font-weight: bold; 
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .print-footer { 
            text-align: center; 
            margin-top: 20px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            font-size: 12px; 
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Liste des Investissements</h1>
          <p>Direction des Services Agricoles - Wilaya de Guelma</p>
          <p>Imprimé le ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>N° Op</th>
              <th>Intitulé</th>
              <th>Programme</th>
              <th>Budget (DA)</th>
              <th>Engagé (DA)</th>
              <th>Payé (DA)</th>
              <th>Restant (DA)</th>
              <th>Avancement</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${investmentsData
              .map(
                (investment) => `
              <tr>
                <td>${investment.id}</td>
                <td>${investment.title}</td>
                <td>${investment.program}</td>
                <td>${formatNumber(investment.budget)}</td>
                <td>${formatNumber(investment.engaged)}</td>
                <td>${formatNumber(investment.paid)}</td>
                <td>${formatNumber(investment.remainingBudget)}</td>
                <td>${investment.progress}%</td>
                <td>${getStatusText(investment.status)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="print-footer">
          <p>Document généré automatiquement par le système de gestion des investissements DSA</p>
          <p>Total des investissements: ${investmentsData.length} projets</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  }

  function filterInvestments() {
    const year = yearSelect.value
    const program = programSelect.value.toLowerCase()
    const searchTerm = searchInput.value.toLowerCase()

    const rows = document.querySelectorAll("#investments-table-body tr")

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td")
      const rowYear = cells[0].textContent.includes(year) ? year : "other"
      const rowProgram = cells[2].textContent.toLowerCase()
      const rowTitle = cells[1].textContent.toLowerCase()
      const rowId = cells[0].textContent.toLowerCase()

      const matchesYear = year === "" || rowYear === year
      const matchesProgram = program === "" || rowProgram.includes(program)
      const matchesSearch = searchTerm === "" || rowTitle.includes(searchTerm) || rowId.includes(searchTerm)

      if (matchesYear && matchesProgram && matchesSearch) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  function showInvestmentDetails(investmentId) {
    const investment = investmentsData.find((i) => i.id === investmentId)
    if (!investment) return

    const modal = document.getElementById("investment-details-modal")
    const modalContent = modal.querySelector(".modal-content")

    // Générer la liste des observations
    let observationsHTML = ""
    if (investment.observations && investment.observations.length > 0) {
      observationsHTML = `
      <div class="observations-list">
        ${investment.observations
          .map(
            (obs) => `
          <div class="observation-item">
            <div class="observation-header">
              <span class="observation-date"><i class="fas fa-calendar-alt"></i> ${formatDate(obs.date)}</span>
              <span class="observation-author"><i class="fas fa-user"></i> ${obs.author}</span>
            </div>
            <div class="observation-text">${obs.text}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
    } else {
      observationsHTML = "<p>Aucune observation enregistrée</p>"
    }

    modalContent.innerHTML = `
        <button class="close-modal">&times;</button>
        <h2><i class="fas fa-info-circle"></i> Détails de l'investissement</h2>
        
        <div class="modal-body">
            <div class="detail-section">
                <h3><i class="fas fa-clipboard-list"></i> Informations de base</h3>
                <div class="detail-row">
                    <div class="detail-label">N° Opération:</div>
                    <div class="detail-value">${investment.id}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Intitulé:</div>
                    <div class="detail-value">${investment.title}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Programme:</div>
                    <div class="detail-value">${investment.program}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Localisation:</div>
                    <div class="detail-value">${investment.location}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Daïra:</div>
                    <div class="detail-value">${investment.daira || "Non spécifiée"}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Commune:</div>
                    <div class="detail-value">${investment.commune || "Non spécifiée"}</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-money-bill-wave"></i> Financement</h3>
                <div class="detail-row">
                    <div class="detail-label">Budget alloué:</div>
                    <div class="detail-value">${formatNumber(investment.budget)} DA</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Montant engagé:</div>
                    <div class="detail-value">${formatNumber(investment.engaged)} DA</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Montant payé:</div>
                    <div class="detail-value">${formatNumber(investment.paid)} DA</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Budget restant:</div>
                    <div class="detail-value">${formatNumber(investment.remainingBudget)} DA</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Reliquat:</div>
                    <div class="detail-value">${formatNumber(investment.budget - investment.engaged)} DA</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-hard-hat"></i> Exécution</h3>
                <div class="detail-row">
                    <div class="detail-label">Entreprise:</div>
                    <div class="detail-value">${investment.contractor}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Période:</div>
                    <div class="detail-value">${formatDate(investment.startDate)} au ${formatDate(investment.endDate)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Avancement:</div>
                    <div class="detail-value">
                        <div class="progress-container" style="margin-top: 0.5rem;">
                            <div class="progress-bar" style="width: 0%;" data-width="${investment.progress}%"></div>
                        </div>
                        <small>${investment.progress}% complété</small>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Statut:</div>
                    <div class="detail-value">
                        <span class="status-badge status-${investment.status}">
                            <i class="fas ${getStatusIcon(investment.status)}"></i>
                            ${getStatusText(investment.status)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section observations-section">
                <h3><i class="fas fa-clipboard-check"></i> Observations</h3>
                ${observationsHTML}
            </div>
        </div>
        
        <button class="print-detail-btn" onclick="printInvestmentDetails('${investment.id}')">
            <i class="fas fa-print"></i> Imprimer les détails
        </button>
    `

    modal.classList.remove("hidden")

    // Animation de la barre de progression dans la modal
    setTimeout(() => {
      const progressBar = modalContent.querySelector(".progress-bar")
      if (progressBar) {
        progressBar.style.width = progressBar.getAttribute("data-width")
      }
    }, 300)

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.classList.add("hidden")
    })
  }

  // Fonction d'impression des détails d'un investissement
  window.printInvestmentDetails = (investmentId) => {
    const investment = investmentsData.find((i) => i.id === investmentId)
    if (!investment) return

    const printWindow = window.open("", "_blank")

    let observationsHTML = ""
    if (investment.observations && investment.observations.length > 0) {
      observationsHTML = investment.observations
        .map(
          (obs) => `
          <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #2d4f4f;">
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${formatDate(obs.date)} - ${obs.author}
            </div>
            <div>${obs.text}</div>
          </div>
        `,
        )
        .join("")
    } else {
      observationsHTML = "<p>Aucune observation enregistrée</p>"
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Détails Investissement ${investment.id} - DSA Guelma</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2d4f4f; padding-bottom: 20px; }
          .header h1 { color: #2d4f4f; margin-bottom: 10px; }
          .header p { color: #666; }
          .section { margin-bottom: 30px; }
          .section h3 { color: #2d4f4f; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; }
          .detail-label { font-weight: bold; color: #333; }
          .detail-value { color: #2d4f4f; }
          .progress-info { background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Détails de l'Investissement</h1>
          <p>Direction des Services Agricoles - Wilaya de Guelma</p>
          <p>Imprimé le ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
        
        <div class="section">
          <h3>Informations de base</h3>
          <div class="detail-row">
            <span class="detail-label">N° Opération:</span>
            <span class="detail-value">${investment.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Intitulé:</span>
            <span class="detail-value">${investment.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Programme:</span>
            <span class="detail-value">${investment.program}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Localisation:</span>
            <span class="detail-value">${investment.location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Daïra:</span>
            <span class="detail-value">${investment.daira || "Non spécifiée"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Commune:</span>
            <span class="detail-value">${investment.commune || "Non spécifiée"}</span>
          </div>
        </div>
        
        <div class="section">
          <h3>Financement</h3>
          <div class="detail-row">
            <span class="detail-label">Budget alloué:</span>
            <span class="detail-value">${formatNumber(investment.budget)} DA</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Montant engagé:</span>
            <span class="detail-value">${formatNumber(investment.engaged)} DA</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Montant payé:</span>
            <span class="detail-value">${formatNumber(investment.paid)} DA</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Budget restant:</span>
            <span class="detail-value">${formatNumber(investment.remainingBudget)} DA</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Reliquat:</span>
            <span class="detail-value">${formatNumber(investment.budget - investment.engaged)} DA</span>
          </div>
        </div>
        
        <div class="section">
          <h3>Exécution</h3>
          <div class="detail-row">
            <span class="detail-label">Entreprise:</span>
            <span class="detail-value">${investment.contractor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Période:</span>
            <span class="detail-value">${formatDate(investment.startDate)} au ${formatDate(investment.endDate)}</span>
          </div>
          <div class="progress-info">
            <div class="detail-row">
              <span class="detail-label">Avancement:</span>
              <span class="detail-value">${investment.progress}% complété</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Statut:</span>
              <span class="detail-value">${getStatusText(investment.status)}</span>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Observations</h3>
          ${observationsHTML}
        </div>
        
        <div class="footer">
          <p>Document généré automatiquement par le système de gestion des investissements DSA</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  }

  // Liste des daïras et communes de Guelma
  const locationData = {
    Guelma: ["Guelma", "Bendjerrah", "Belkheir", "Boumahra Ahmed"],
    "Oued Zenati": ["Oued Zenati", "Bordj Sabath", "Aïn Regada"],
    Bouchegouf: ["Bouchegouf", "Medjez Sfa", "Oued Fragha"],
    Héliopolis: ["Héliopolis", "El Fedjoudj", "Bouati Mahmoud"],
    "Hammam Debagh": ["Hammam Debagh", "Roknia"],
    "Hammam N'Bail": ["Hammam N'Bail", "Dahouara"],
    Khezara: ["Khezara", "Beni Mezline", "Sellaoua Announa"],
    "Aïn Makhlouf": ["Aïn Makhlouf", "Tamlouka", "Aïn Larbi"],
    "Aïn Hessainia": ["Aïn Hessainia", "Djeballah Khemissi", "Bouhamdane"],
    "Guelaat Bousbaa": ["Guelaat Bousbaa", "Nechmaya", "Bou Hamdane"],
    "Hammam Ouled Ali": ["Hammam Ouled Ali", "Henchir Toumghani"],
  }

  function editInvestment(investmentId) {
    const investment = investmentsData.find((i) => i.id === investmentId)
    if (!investment) return

    const modal = document.getElementById("new-investment-modal")

    // Générer les options pour les daïras
    let dairaOptions = '<option value="">Sélectionner...</option>'
    Object.keys(locationData).forEach((daira) => {
      dairaOptions += `<option ${investment.daira === daira ? "selected" : ""}>${daira}</option>`
    })

    // Générer les options pour les communes basées sur la daïra sélectionnée
    let communeOptions = '<option value="">Sélectionner...</option>'
    if (investment.daira && locationData[investment.daira]) {
      locationData[investment.daira].forEach((commune) => {
        communeOptions += `<option ${investment.commune === commune ? "selected" : ""}>${commune}</option>`
      })
    }

    // Générer la liste des observations existantes
    let observationsHTML = ""
    if (investment.observations && investment.observations.length > 0) {
      observationsHTML = `
      <div class="observations-list">
        <h4><i class="fas fa-history"></i> Historique des observations</h4>
        ${investment.observations
          .map(
            (obs) => `
          <div class="observation-item">
            <div class="observation-header">
              <span class="observation-date"><i class="fas fa-calendar-alt"></i> ${formatDate(obs.date)}</span>
              <span class="observation-author"><i class="fas fa-user"></i> ${obs.author}</span>
            </div>
            <div class="observation-text">${obs.text}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
    }

    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2><i class="fas fa-edit"></i> Modifier l'investissement</h2>
            
            <form id="investment-form" class="investment-form">
                <input type="hidden" id="investment-id" value="${investment.id}">
                
                <div class="form-section">
                    <h3><i class="fas fa-info-circle"></i> Informations de base</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-title"><i class="fas fa-heading"></i> Intitulé*</label>
                            <input type="text" id="investment-title" value="${investment.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="investment-program"><i class="fas fa-project-diagram"></i> Programme*</label>
                            <select id="investment-program" required>
                                <option value="">Sélectionner...</option>
                                <option ${investment.program === "Normal" ? "selected" : ""}>Normal</option>
                                <option ${investment.program === "PSNE" ? "selected" : ""}>PSNE</option>
                                <option ${investment.program === "HP" ? "selected" : ""}>HP</option>
                                <option ${investment.program === "Urgence" ? "selected" : ""}>Urgence</option>
                                <option ${investment.program === "Spécial" ? "selected" : ""}>Spécial</option>
                                <option ${investment.program === "PCSC" ? "selected" : ""}>PCSC</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-location"><i class="fas fa-map-marker-alt"></i> Localisation*</label>
                            <select id="investment-location" required>
                                <option value="">Sélectionner...</option>
                                <option ${investment.location === "Subdivision Nord" ? "selected" : ""}>Subdivision Nord</option>
                                <option ${investment.location === "Subdivision Sud" ? "selected" : ""}>Subdivision Sud</option>
                                <option ${investment.location === "Subdivision Est" ? "selected" : ""}>Subdivision Est</option>
                                <option ${investment.location === "Subdivision Ouest" ? "selected" : ""}>Subdivision Ouest</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="investment-year"><i class="fas fa-calendar-alt"></i> Année*</label>
                            <select id="investment-year" required>
                                <option value="2023" ${investment.year === 2023 ? "selected" : ""}>2023</option>
                                <option value="2024" ${investment.year === 2024 ? "selected" : ""}>2024</option>
                                <option value="2025" ${investment.year === 2025 ? "selected" : ""}>2025</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-daira"><i class="fas fa-city"></i> Daïra*</label>
                            <select id="investment-daira" required>
                                ${dairaOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="investment-commune"><i class="fas fa-building"></i> Commune*</label>
                            <select id="investment-commune" required>
                                ${communeOptions}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-money-bill-wave"></i> Financement</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-budget"><i class="fas fa-wallet"></i> Budget alloué (DA)*</label>
                            <input type="number" id="investment-budget" min="0" value="${investment.budget}" required>
                        </div>
                        <div class="form-group">
                            <label for="investment-engaged"><i class="fas fa-hand-holding-usd"></i> Montant engagé (DA)</label>
                            <input type="number" id="investment-engaged" min="0" value="${investment.engaged}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-paid"><i class="fas fa-money-check-alt"></i> Montant payé (DA)</label>
                            <input type="number" i  Montant payé (DA)</label>
                            <input type="number" id="investment-paid" min="0" value="${investment.paid}">
                        </div>
                        <div class="form-group">
                            <label for="investment-remaining"><i class="fas fa-piggy-bank"></i> Budget restant (DA)</label>
                            <input type="number" id="investment-remaining" min="0" value="${investment.remainingBudget}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-progress"><i class="fas fa-tasks"></i> Avancement (%)</label>
                            <input type="number" id="investment-progress" min="0" max="100" value="${investment.progress}">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-hard-hat"></i> Exécution</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-contractor"><i class="fas fa-industry"></i> Entreprise</label>
                            <input type="text" id="investment-contractor" value="${investment.contractor || ""}">
                        </div>
                        <div class="form-group">
                            <label for="investment-status"><i class="fas fa-info-circle"></i> Statut</label>
                            <select id="investment-status">
                                <option value="planned" ${investment.status === "planned" ? "selected" : ""}>Planifié</option>
                                <option value="in-progress" ${investment.status === "in-progress" ? "selected" : ""}>En cours</option>
                                <option value="completed" ${investment.status === "completed" ? "selected" : ""}>Terminé</option>
                                <option value="canceled" ${investment.status === "canceled" ? "selected" : ""}>Annulé</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-start"><i class="fas fa-play"></i> Date début</label>
                            <input type="date" id="investment-start" value="${investment.startDate || ""}">
                        </div>
                        <div class="form-group">
                            <label for="investment-end"><i class="fas fa-flag-checkered"></i> Date fin prévue</label>
                            <input type="date" id="investment-end" value="${investment.endDate || ""}">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-clipboard-check"></i> Nouvelle Observation</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-observation"><i class="fas fa-comment-alt"></i> Remarque (avancement, paiement, etc.)</label>
                            <textarea id="investment-observation" rows="4" placeholder="Saisissez vos observations sur l'avancement ou le paiement..."></textarea>
                        </div>
                    </div>
                    
                    ${observationsHTML}
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-cancel">
                        <i class="fas fa-times"></i> Annuler
                    </button>
                    <button type="submit" class="btn btn-submit">
                        <i class="fas fa-save"></i> Enregistrer
                    </button>
                </div>
            </form>
        </div>
    `

    modal.classList.remove("hidden")

    // Événement pour mettre à jour les communes lorsque la daïra change
    const dairaSelect = document.getElementById("investment-daira")
    const communeSelect = document.getElementById("investment-commune")

    dairaSelect.addEventListener("change", function () {
      const selectedDaira = this.value
      let options = '<option value="">Sélectionner...</option>'

      if (selectedDaira && locationData[selectedDaira]) {
        locationData[selectedDaira].forEach((commune) => {
          options += `<option>${commune}</option>`
        })
      }

      communeSelect.innerHTML = options
    })

    // Calcul automatique du budget restant
    const budgetInput = document.getElementById("investment-budget")
    const paidInput = document.getElementById("investment-paid")
    const remainingInput = document.getElementById("investment-remaining")

    function updateRemainingBudget() {
      const budget = Number.parseInt(budgetInput.value) || 0
      const paid = Number.parseInt(paidInput.value) || 0
      remainingInput.value = budget - paid
    }

    budgetInput.addEventListener("input", updateRemainingBudget)
    paidInput.addEventListener("input", updateRemainingBudget)

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.classList.add("hidden")
    })

    modal.querySelector(".btn-cancel").addEventListener("click", () => {
      modal.classList.add("hidden")
    })

    modal.querySelector("#investment-form").addEventListener("submit", (e) => {
      e.preventDefault()

      const id = document.getElementById("investment-id").value
      const index = investmentsData.findIndex((i) => i.id === id)

      if (index !== -1) {
        // Récupérer les observations existantes
        const existingObservations = [...(investmentsData[index].observations || [])]

        // Ajouter la nouvelle observation si elle existe
        const newObservation = document.getElementById("investment-observation").value.trim()
        if (newObservation) {
          existingObservations.push({
            date: new Date().toISOString().split("T")[0],
            text: newObservation,
            author: "Chef Service",
          })
        }

        // Mettre à jour l'investissement existant
        investmentsData[index] = {
          id: id,
          title: document.getElementById("investment-title").value,
          program: document.getElementById("investment-program").value,
          budget: Number.parseInt(document.getElementById("investment-budget").value),
          engaged: Number.parseInt(document.getElementById("investment-engaged").value) || 0,
          paid: Number.parseInt(document.getElementById("investment-paid").value) || 0,
          remainingBudget: Number.parseInt(document.getElementById("investment-remaining").value) || 0,
          progress: Number.parseInt(document.getElementById("investment-progress").value) || 0,
          status: document.getElementById("investment-status").value,
          year: Number.parseInt(document.getElementById("investment-year").value),
          startDate: document.getElementById("investment-start").value || null,
          endDate: document.getElementById("investment-end").value || null,
          contractor: document.getElementById("investment-contractor").value || null,
          location: document.getElementById("investment-location").value,
          daira: document.getElementById("investment-daira").value,
          commune: document.getElementById("investment-commune").value,
          coordinates: investmentsData[index].coordinates, // Conserver les coordonnées existantes
          observations: existingObservations,
        }

        // Fermer la modal et actualiser l'affichage
        modal.classList.add("hidden")
        loadInvestments()

        showNotification(`Investissement ${id} modifié avec succès !`)
      }
    })
  }

  function openNewInvestmentModal() {
    const modal = document.getElementById("new-investment-modal")

    // Générer les options pour les daïras
    let dairaOptions = '<option value="">Sélectionner...</option>'
    Object.keys(locationData).forEach((daira) => {
      dairaOptions += `<option>${daira}</option>`
    })

    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2><i class="fas fa-plus-circle"></i> Nouvel Investissement</h2>
            
            <form id="investment-form" class="investment-form">
                <div class="form-section">
                    <h3><i class="fas fa-info-circle"></i> Informations de base</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-title"><i class="fas fa-heading"></i> Intitulé*</label>
                            <input type="text" id="investment-title" required>
                        </div>
                        <div class="form-group">
                            <label for="investment-program"><i class="fas fa-project-diagram"></i> Programme*</label>
                            <select id="investment-program" required>
                                <option value="">Sélectionner...</option>
                                <option>Normal</option>
                                <option>PSNE</option>
                                <option>HP</option>
                                <option>Urgence</option>
                                <option>Spécial</option>
                                <option>PCSC</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-location"><i class="fas fa-map-marker-alt"></i> Localisation*</label>
                            <select id="investment-location" required>
                                <option value="">Sélectionner...</option>
                                <option>Subdivision Nord</option>
                                <option>Subdivision Sud</option>
                                <option>Subdivision Est</option>
                                <option>Subdivision Ouest</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="investment-year"><i class="fas fa-calendar-alt"></i> Année*</label>
                            <select id="investment-year" required>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-daira"><i class="fas fa-city"></i> Daïra*</label>
                            <select id="investment-daira" required>
                                ${dairaOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="investment-commune"><i class="fas fa-building"></i> Commune*</label>
                            <select id="investment-commune" required>
                                <option value="">Sélectionnez d'abord une daïra</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-money-bill-wave"></i> Financement</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-budget"><i class="fas fa-wallet"></i> Budget alloué (DA)*</label>
                            <input type="number" id="investment-budget" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="investment-engaged"><i class="fas fa-hand-holding-usd"></i> Montant engagé (DA)</label>
                            <input type="number" id="investment-engaged" min="0" value="0">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-paid"><i class="fas fa-money-check-alt"></i> Montant payé (DA)</label>
                            <input type="number" id="investment-paid" min="0" value="0">
                        </div>
                        <div class="form-group">
                            <label for="investment-remaining"><i class="fas fa-piggy-bank"></i> Budget restant (DA)</label>
                            <input type="number" id="investment-remaining" min="0" value="0">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-progress"><i class="fas fa-tasks"></i> Avancement (%)</label>
                            <input type="number" id="investment-progress" min="0" max="100" value="0">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-hard-hat"></i> Exécution</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-contractor"><i class="fas fa-industry"></i> Entreprise</label>
                            <input type="text" id="investment-contractor">
                        </div>
                        <div class="form-group">
                            <label for="investment-status"><i class="fas fa-info-circle"></i> Statut</label>
                            <select id="investment-status">
                                <option value="planned">Planifié</option>
                                <option value="in-progress">En cours</option>
                                <option value="completed">Terminé</option>
                                <option value="canceled">Annulé</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-start"><i class="fas fa-play"></i> Date début</label>
                            <input type="date" id="investment-start">
                        </div>
                        <div class="form-group">
                            <label for="investment-end"><i class="fas fa-flag-checkered"></i> Date fin prévue</label>
                            <input type="date" id="investment-end">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-clipboard-check"></i> Observation initiale</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="investment-observation"><i class="fas fa-comment-alt"></i> Remarque (avancement, paiement, etc.)</label>
                            <textarea id="investment-observation" rows="4" placeholder="Saisissez vos observations sur l'avancement ou le paiement..."></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-cancel">
                        <i class="fas fa-times"></i> Annuler
                    </button>
                    <button type="submit" class="btn btn-submit">
                        <i class="fas fa-save"></i> Enregistrer
                    </button>
                </div>
            </form>
        </div>
    `

    modal.classList.remove("hidden")

    // Événement pour mettre à jour les communes lorsque la daïra change
    const dairaSelect = document.getElementById("investment-daira")
    const communeSelect = document.getElementById("investment-commune")

    dairaSelect.addEventListener("change", function () {
      const selectedDaira = this.value
      let options = '<option value="">Sélectionner...</option>'

      if (selectedDaira && locationData[selectedDaira]) {
        locationData[selectedDaira].forEach((commune) => {
          options += `<option>${commune}</option>`
        })
      }

      communeSelect.innerHTML = options
    })

    // Calcul automatique du budget restant
    const budgetInput = document.getElementById("investment-budget")
    const paidInput = document.getElementById("investment-paid")
    const remainingInput = document.getElementById("investment-remaining")

    function updateRemainingBudget() {
      const budget = Number.parseInt(budgetInput.value) || 0
      const paid = Number.parseInt(paidInput.value) || 0
      remainingInput.value = budget - paid
    }

    budgetInput.addEventListener("input", updateRemainingBudget)
    paidInput.addEventListener("input", updateRemainingBudget)

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.classList.add("hidden")
    })

    modal.querySelector(".btn-cancel").addEventListener("click", () => {
      modal.classList.add("hidden")
    })

    modal.querySelector("#investment-form").addEventListener("submit", (e) => {
      e.preventDefault()

      // Générer un ID unique
      const year = document.getElementById("investment-year").value
      const nextId = investmentsData.filter((i) => i.year.toString() === year).length + 1
      const investmentId = `INV-${year}-${nextId.toString().padStart(3, "0")}`

      // Récupérer l'observation initiale
      const observations = []
      const initialObservation = document.getElementById("investment-observation").value.trim()
      if (initialObservation) {
        observations.push({
          date: new Date().toISOString().split("T")[0],
          text: initialObservation,
          author: "Chef Service",
        })
      }

      // Générer des coordonnées réelles pour Guelma selon la daïra
      const daira = document.getElementById("investment-daira").value
      let coordinates = { lat: 36.4621, lng: 7.4261 } // Guelma par défaut

      // Coordonnées spécifiques par daïra
      const dairaCoordinates = {
        Guelma: { lat: 36.4621, lng: 7.4261 },
        "Oued Zenati": { lat: 36.32, lng: 7.1667 },
        Bouchegouf: { lat: 36.4572, lng: 7.7233 },
        Héliopolis: { lat: 36.5033, lng: 7.445 },
        "Hammam Debagh": { lat: 36.2333, lng: 7.2167 },
        "Hammam N'Bail": { lat: 36.3167, lng: 7.3833 },
        Khezara: { lat: 36.35, lng: 7.55 },
        "Aïn Makhlouf": { lat: 36.2333, lng: 7.2167 },
        "Aïn Hessainia": { lat: 36.4, lng: 7.5 },
        "Guelaat Bousbaa": { lat: 36.45, lng: 7.6 },
        "Hammam Ouled Ali": { lat: 36.38, lng: 7.48 },
      }

      if (dairaCoordinates[daira]) {
        coordinates = dairaCoordinates[daira]
      }

      // Créer le nouvel investissement
      const newInvestment = {
        id: investmentId,
        title: document.getElementById("investment-title").value,
        program: document.getElementById("investment-program").value,
        budget: Number.parseInt(document.getElementById("investment-budget").value),
        engaged: Number.parseInt(document.getElementById("investment-engaged").value) || 0,
        paid: Number.parseInt(document.getElementById("investment-paid").value) || 0,
        remainingBudget: Number.parseInt(document.getElementById("investment-remaining").value) || 0,
        progress: Number.parseInt(document.getElementById("investment-progress").value) || 0,
        status: document.getElementById("investment-status").value,
        year: Number.parseInt(year),
        startDate: document.getElementById("investment-start").value || null,
        endDate: document.getElementById("investment-end").value || null,
        contractor: document.getElementById("investment-contractor").value || null,
        location: document.getElementById("investment-location").value,
        daira: document.getElementById("investment-daira").value,
        commune: document.getElementById("investment-commune").value,
        coordinates: coordinates,
        observations: observations,
      }

      // Ajouter à notre "base de données"
      investmentsData.push(newInvestment)

      // Fermer la modal et actualiser l'affichage
      modal.classList.add("hidden")
      loadInvestments()

      showNotification(`Investissement ${investmentId} créé avec succès !`)
    })
  }

  function showNotification(message, type = "success") {
    // Créer une notification
    const notification = document.createElement("div")
    notification.className = "notification"

    let icon = "fa-check-circle"
    if (type === "info") icon = "fa-info-circle"
    if (type === "warning") icon = "fa-exclamation-triangle"
    if (type === "error") icon = "fa-times-circle"

    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
        `
    document.body.appendChild(notification)

    // Afficher et masquer la notification
    setTimeout(() => {
      notification.classList.add("show")

      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 500)
      }, 3000)
    }, 100)
  }

  // Fonctions utilitaires
  function formatNumber(num) {
    return new Intl.NumberFormat("fr-FR").format(num)
  }

  function formatDate(dateString) {
    if (!dateString) return "Non spécifiée"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  function getStatusText(status) {
    const statusTexts = {
      planned: "Planifié",
      "in-progress": "En cours",
      completed: "Terminé",
      canceled: "Annulé",
    }
    return statusTexts[status] || status
  }

  function getStatusIcon(status) {
    const statusIcons = {
      planned: "fa-clock",
      "in-progress": "fa-spinner",
      completed: "fa-check-circle",
      canceled: "fa-ban",
    }
    return statusIcons[status] || "fa-info-circle"
  }

  // Rendre les fonctions disponibles globalement pour la carte
  window.showInvestmentDetails = showInvestmentDetails
  window.formatNumber = formatNumber
  window.getStatusText = getStatusText
  window.getStatusIcon = getStatusIcon
})
