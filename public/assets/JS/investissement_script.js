document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM - Adaptés aux IDs du HTML
  const investmentsTableBody = document.getElementById("investments-table-body")
  const searchInput = document.querySelector(".search-input")
  const yearFilter = document.getElementById("year-filter")
  const programmeFilter = document.getElementById("programme-filter")
  const exportBtn = document.getElementById("export-btn")
  const exportDropdown = document.getElementById("export-dropdown")
  const exportPdf = document.getElementById("export-pdf")
  const exportExcel = document.getElementById("export-excel")
  const addInvestmentBtn = document.getElementById("add-investment-btn")
  const counters = document.querySelectorAll(".counter")

  // Modals - Adaptés aux IDs du HTML
  const addInvestmentModal = document.getElementById("add-investment-modal")
  const editInvestmentModal = document.getElementById("edit-investment-modal")
  const investmentDetailsModal = document.getElementById("investment-details-modal")

  // Formulaires - Adaptés aux IDs du HTML
  const addInvestmentForm = document.getElementById("add-investment-form")
  const editInvestmentForm = document.getElementById("edit-investment-form")

  // Données des communes par daïra de la wilaya de Guelma
  const communesByDaira = {
    guelma: ["Guelma", "Belkheir", "Medjez Amar"],
    "oued-zenati": ["Oued Zenati", "Ain Hessainia", "Nechmaya", "Bordj Sabath"],
    heliopolis: ["Héliopolis", "Khezaras", "Sellaoua Announa"],
    bouchegouf: ["Bouchegouf", "Hammam N'Bails", "Roknia"],
    "hammam-debagh": ["Hammam Debagh", "Ras El Agba", "Ain Sandel"],
    "ain-makhlouf": ["Ain Makhlouf", "Houari Boumediene", "El Fedjoudj"],
  }

  // Données des investissements (structure locale, sera remplacée par les données de l'API)
  let investments = [];

  let currentEditingInvestment = null

  // Initialisation
  init()

  function init() {
    loadInvestmentsFromAPI()
    setupEventListeners()
    updateCurrentTime()
    initCompactCalendar()
    loadGoogleMapsScript()

    // Mettre à jour l'heure toutes les secondes
    setInterval(updateCurrentTime, 1000)
  }

  function setupEventListeners() {
    // Recherche et filtres
    searchInput?.addEventListener("input", filterInvestments)
    yearFilter?.addEventListener("change", filterInvestments)
    programmeFilter?.addEventListener("change", filterInvestments)

    // Export
    exportBtn?.addEventListener("click", toggleExportMenu)
    document.addEventListener("click", closeExportMenu)
    exportPdf?.addEventListener("click", exportToPDF)
    exportExcel?.addEventListener("click", exportToExcel)

    // Impression
    const printBtn = document.getElementById("print-btn")
    printBtn?.addEventListener("click", printInvestments)

    // Nouvel investissement
    addInvestmentBtn?.addEventListener("click", openAddInvestmentModal)

    // Formulaires
    if (addInvestmentForm) {
      addInvestmentForm.addEventListener("submit", handleAddInvestment)
    }
    if (editInvestmentForm) {
      editInvestmentForm.addEventListener("submit", handleEditInvestment)
    }

    // Boutons d'annulation
    document.getElementById("cancel-add")?.addEventListener("click", closeModal)
    document.getElementById("cancel-edit")?.addEventListener("click", closeModal)

    // Fermeture des modals
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        closeModal()
      }
    })

    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", closeModal)
    })

    // Sélecteurs de daïra
    document.getElementById("investment-daira")?.addEventListener("change", updateCommuneOptions)
    document.getElementById("edit-investment-daira")?.addEventListener("change", updateEditCommuneOptions)

    // Boutons d'export/impression des détails
    document.getElementById("print-details-btn")?.addEventListener("click", printInvestmentDetails)
    document.getElementById("export-details-btn")?.addEventListener("click", exportInvestmentDetails)

    // Carte
    document.getElementById("maps-btn")?.addEventListener("click", showInvestmentsMap)
  }
  
  async function loadInvestmentsFromAPI() {
    try {
      const response = await fetch("/DSA1/API/investissement/lire.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mise à jour des données locales
      investments = data;
      
      // Mise à jour de l'affichage
      renderInvestments();
      updateStats();
      setupCommuneSelectors();
      animateCounters();
      
      console.log("✅ Données chargées depuis la base:", investments.length, "projets");
    } catch (error) {
      console.error("❌ Erreur de chargement des projets:", error);
      showNotification("Impossible de charger les projets. Veuillez réessayer plus tard.", "error");
    }
  }

  function setupCommuneSelectors() {
    updateCommuneOptions()
    updateEditCommuneOptions()
  }

  function updateCommuneOptions() {
    const dairaSelect = document.getElementById("investment-daira")
    const communeSelect = document.getElementById("investment-commune")

    if (!dairaSelect || !communeSelect) return

    const selectedDaira = dairaSelect.value
    communeSelect.innerHTML = '<option value="">Sélectionner la commune</option>'

    if (selectedDaira && communesByDaira[selectedDaira]) {
      communesByDaira[selectedDaira].forEach((commune) => {
        const option = document.createElement("option")
        option.value = commune.toLowerCase().replace(/\s+/g, "-")
        option.textContent = commune
        communeSelect.appendChild(option)
      })
    }
  }

  function updateEditCommuneOptions() {
    const dairaSelect = document.getElementById("edit-investment-daira")
    const communeSelect = document.getElementById("edit-investment-commune")

    if (!dairaSelect || !communeSelect) return

    const selectedDaira = dairaSelect.value
    communeSelect.innerHTML = '<option value="">Sélectionner la commune</option>'

    if (selectedDaira && communesByDaira[selectedDaira]) {
      communesByDaira[selectedDaira].forEach((commune) => {
        const option = document.createElement("option")
        option.value = commune.toLowerCase().replace(/\s+/g, "-")
        option.textContent = commune
        communeSelect.appendChild(option)
      })
    }
  }

  function renderInvestments() {
    if (!investmentsTableBody) {
      console.error("Table body not found!")
      return
    }

    investmentsTableBody.innerHTML = ""

    investments.forEach((investment, index) => {
      const row = createInvestmentRow(investment)
      investmentsTableBody.appendChild(row)

      // Animation
      setTimeout(() => {
        row.style.opacity = "1"
        row.style.transform = "translateY(0)"
      }, index * 100)
    })

    // IMPORTANT: Ajouter les event listeners après avoir créé les lignes
    addRowEventListeners()
  }

  function createInvestmentRow(investment) {
    const row = document.createElement("tr")
    row.style.opacity = "0"
    row.style.transform = "translateY(20px)"
    row.style.transition = "all 0.3s ease"

    const budgetRestant = investment.budget - investment.paye
    const pourcentageAvancement = investment.avancement || 0

    let statusClass = ""
    let statusLabel = ""

    switch (investment.statut) {
  case "en-cours":
    statusClass = "en-cours"
    statusLabel = "En cours"
    break
  case "planifie":
    statusClass = "planifie"
    statusLabel = "Planifié"
    break
  case "termine":
    statusClass = "termine"
    statusLabel = "Terminé"
    break
  case "suspendu":
    statusClass = "suspendu"
    statusLabel = "Suspendu"
    break
  case "annule":
    statusClass = "annule"
    statusLabel = "Annulé"
    break
  default:
    statusClass = "inconnu"
    statusLabel = investment.statut || "—"
}

    const programmeLabels = {
      normal: "Normal",
      normale: "Normal",
      psne: "PSNE",
      psre: "PSRE",
      hp: "HP",
      urgence: "Urgence",
      special: "Spécial",
      complementaire: "Complémentaire",
      pcsc: "PCSC",
      sud: "Sud",
    }

    row.innerHTML = `
      <td>
        <div class="investment-numero">
          <strong>${investment.numero || "N/A"}</strong>
        </div>
      </td>
      <td>
        <div class="investment-title">
          <strong>${investment.intitule}</strong>
          <small style="color: #666; display: block; margin-top: 0.25rem;">${investment.beneficiaire || "Non assigné"}</small>
        </div>
      </td>
      <td>
        <span class="programme-badge" style="background: #e3f2fd; color: #1565c0; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${programmeLabels[investment.programme] || investment.programme}</span>
      </td>
      <td>
        <strong>${formatCurrency(investment.budget)}</strong>
      </td>
      <td>
        <strong>${formatCurrency(investment.engage)}</strong>
      </td>
      <td>
        <strong>${formatCurrency(investment.paye)}</strong>
      </td>
      <td>
        <strong>${formatCurrency(budgetRestant)}</strong>
      </td>
      <td>
        <div>
          <strong>${pourcentageAvancement}%</strong>
          <div style="margin-top: 0.25rem;">
            <div style="background: #e0e0e0; height: 4px; border-radius: 2px; overflow: hidden;">
              <div style="background: #4caf50; height: 100%; width: ${pourcentageAvancement}%; transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>
      </td>
      <td>
        <span class="status-badge status-${statusClass}" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; background: ${getStatusColor(investment.statut)};">${statusLabel}</span>
      </td>
      <td>
        <div class="actions-cell" style="display: flex; gap: 0.5rem;">
          <button class="action-btn view-btn" data-id="${investment.id}" title="Voir les détails" style="background: #2196f3; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit-btn" data-id="${investment.id}" title="Modifier" style="background: #ff9800; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${investment.id}" title="Supprimer" style="background: #f44336; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `

    return row
  }

  function getStatusColor(status) {
    switch (status) {
      case "en-cours":
        return "#e8f5e9; color: #2e7d32"
      case "planifie":
        return "#fff8e1; color: #f57f17"
      case "termine":
        return "#e3f2fd; color: #1565c0"
      case "suspendu":
        return "#ffebee; color: #c62828"
      case "annule":
        return "#fce4ec; color: #ad1457"
      default:
        return "#f5f5f5; color: #666"
    }
  }

  function addRowEventListeners() {
    console.log("Adding event listeners to buttons...")

    // Boutons de visualisation
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const investmentId = e.currentTarget.getAttribute("data-id")
        console.log("View button clicked for ID:", investmentId)
        showInvestmentDetails(investmentId)
      })
    })

    // Boutons de modification
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const investmentId = e.currentTarget.getAttribute("data-id")
        console.log("Edit button clicked for ID:", investmentId)
        openEditInvestmentModal(investmentId)
      })
    })

    // Boutons de suppression
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const investmentId = e.currentTarget.getAttribute("data-id")
        console.log("Delete button clicked for ID:", investmentId)
        deleteInvestment(investmentId)
      })
    })
  }

  function showInvestmentDetails(investmentId) {
    console.log("Showing details for investment:", investmentId)

    const investment = investments.find((inv) => inv.id == investmentId)
    if (!investment) {
      console.error("Investment not found:", investmentId)
      showNotification("Investissement non trouvé", "error")
      return
    }

    const modal = investmentDetailsModal
    const content = modal?.querySelector(".project-details-content")

    if (!content) {
      console.error("Modal content not found")
      return
    }

    const budgetRestant = investment.budget - investment.paye
    const pourcentageConsomme = ((investment.paye / investment.budget) * 100).toFixed(1)

    const programmeLabels = {
      normal: "Normal",
      normale: "Normal",
      psne: "PSNE",
      psre: "PSRE",
      hp: "HP",
      urgence: "Urgence",
      special: "Spécial",
      complementaire: "Complémentaire",
      pcsc: "PCSC",
      sud: "Sud",
    }

    content.innerHTML = `
      <div class="project-detail-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e0e0e0;">
        <h4 style="margin: 0; color: #1565c0;">${investment.intitule}</h4>
        <span style="font-family: monospace; background: #e3f2fd; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; color: #1565c0; font-weight: 600;">${investment.numero || "N/A"}</span>
      </div>
      
      <div class="project-detail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #1565c0;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Programme</label>
          <span style="color: #1565c0; font-weight: 500; font-size: 1.1rem;">${programmeLabels[investment.programme] || investment.programme}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #1565c0;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Année</label>
          <span style="color: #1565c0; font-weight: 500; font-size: 1.1rem;">${investment.annee}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #4caf50;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Budget alloué</label>
          <span style="color: #4caf50; font-weight: 500; font-size: 1.1rem;">${formatCurrency(investment.budget)}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff9800;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Montant engagé</label>
          <span style="color: #ff9800; font-weight: 500; font-size: 1.1rem;">${formatCurrency(investment.engage)}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #2196f3;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Montant payé</label>
          <span style="color: #2196f3; font-weight: 500; font-size: 1.1rem;">${formatCurrency(investment.paye)}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #9c27b0;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Budget restant</label>
          <span style="color: #9c27b0; font-weight: 500; font-size: 1.1rem;">${formatCurrency(budgetRestant)}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #607d8b;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Avancement</label>
          <div>
            <span style="color: #607d8b; font-weight: 500; font-size: 1.1rem;">${investment.avancement}%</span>
            <div style="background: #e0e0e0; height: 8px; border-radius: 4px; margin-top: 0.5rem; overflow: hidden;">
              <div style="background: #4caf50; height: 100%; width: ${investment.avancement}%; transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #795548;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Statut</label>
          <span style="color: #795548; font-weight: 500; font-size: 1.1rem;">${getStatusLabel(investment.statut)}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff5722;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Bénéficiaire</label>
          <span style="color: #ff5722; font-weight: 500; font-size: 1.1rem;">${investment.beneficiaire || "Non spécifié"}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #009688;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Localisation</label>
          <span style="color: #009688; font-weight: 500; font-size: 1.1rem;">${investment.daira || ""}${investment.commune ? " / " + investment.commune : ""}</span>
        </div>
        
        <div class="detail-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #3f51b5;">
          <label style="font-weight: 600; color: #666; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block;">Période</label>
          <span style="color: #3f51b5; font-weight: 500; font-size: 1.1rem;">${formatDate(investment.dateDebut)} - ${formatDate(investment.dateFin)}</span>
        </div>
      </div>
      
      ${
        investment.description
          ? `
        <div class="detail-description" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #1565c0;">
          <label style="font-weight: 600; color: #666; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem; display: block;"><i class="fas fa-file-text"></i> Description</label>
          <p style="margin: 0; line-height: 1.6; color: #333;">${investment.description}</p>
        </div>
      `
          : ""
      }
      
      ${
        investment.observations && investment.observations.length > 0
          ? `
        <div class="detail-description" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ff9800;">
          <label style="font-weight: 600; color: #666; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem; display: block;"><i class="fas fa-clipboard-list"></i> Observations</label>
          <div>
            ${investment.observations
              .map(
                (obs) => `
              <div style="margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 6px; border-left: 3px solid #ff9800;">
                <strong style="color: #ff9800; font-size: 0.9rem;">${formatDate(obs.date)}</strong>
                <p style="margin: 0.5rem 0 0 0; line-height: 1.5; color: #333;">${obs.text}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    `

    modal?.classList.add("show")
    console.log("Modal should be visible now")
  }

  function openEditInvestmentModal(investmentId) {
    console.log("Opening edit modal for investment:", investmentId)

    const investment = investments.find((inv) => inv.id == investmentId)
    if (!investment) {
      console.error("Investment not found:", investmentId)
      showNotification("Investissement non trouvé", "error")
      return
    }

    currentEditingInvestment = investment

    // Remplir le formulaire avec les données de l'investissement
    const fields = {
      "edit-investment-numero": investment.numero,
      "edit-investment-intitule": investment.intitule,
      "edit-investment-programme": investment.programme,
      "edit-investment-annee": investment.annee,
      "edit-investment-budget": investment.budget,
      "edit-investment-engage": investment.engage,
      "edit-investment-paye": investment.paye,
      "edit-investment-avancement": investment.avancement,
      "edit-investment-statut": investment.statut,
      "edit-investment-daira": investment.daira,
      "edit-investment-beneficiaire": investment.beneficiaire,
      "edit-investment-date-debut": investment.dateDebut,
      "edit-investment-date-fin": investment.dateFin,
      "edit-investment-description": investment.description,
    }

    // Remplir tous les champs
    Object.entries(fields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId)
      if (field) {
        field.value = value || ""
      } else {
        console.warn(`Field not found: ${fieldId}`)
      }
    })

    // Mettre à jour les communes
    updateEditCommuneOptions()
    setTimeout(() => {
      const communeField = document.getElementById("edit-investment-commune")
      if (communeField && investment.commune) {
        communeField.value = investment.commune.toLowerCase().replace(/\s+/g, "-")
      }
    }, 100)

    // Ajouter un champ caché pour l'ID
    let idField = document.getElementById("edit-investment-id")
    if (!idField) {
      idField = document.createElement("input")
      idField.type = "hidden"
      idField.id = "edit-investment-id"
      idField.name = "id"
      editInvestmentForm.appendChild(idField)
    }
    idField.value = investment.id

    editInvestmentModal?.classList.add("show")
    console.log("Edit modal should be visible now")
  }

  async function deleteInvestment(investmentId) {
    console.log("Deleting investment:", investmentId)

    const investment = investments.find((inv) => inv.id == investmentId)
    if (!investment) {
      console.error("Investment not found:", investmentId)
      showNotification("Investissement non trouvé", "error")
      return
    }

    if (confirm(`Voulez-vous vraiment supprimer l'investissement "${investment.intitule}" ?`)) {
      try {
        const response = await fetch("/DSA1/API/investissement/supprimer.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: investmentId }),
        });

        const result = await response.json();
        
        if (result.success) {
          // Supprimer de la liste locale
          const index = investments.findIndex((inv) => inv.id == investmentId);
          if (index !== -1) {
            investments.splice(index, 1);
            renderInvestments();
            updateStats();
            showNotification("Investissement supprimé avec succès", "success");
          }
        } else {
          showNotification("Erreur lors de la suppression: " + result.message, "error");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showNotification("Erreur de connexion au serveur", "error");
      }
    }
  }

  function openAddInvestmentModal() {
    addInvestmentModal?.classList.add("show")
    // Générer un nouveau numéro d'opération
    const newNumero = generateInvestmentNumber()
    const numeroField = document.getElementById("investment-numero")
    if (numeroField) {
      numeroField.value = newNumero
    }
  }

  function generateInvestmentNumber() {
    const year = new Date().getFullYear()
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
    const existingNumbers = investments.map((inv) => inv.numero)
    let counter = 1

    while (true) {
      const numero = `INV-${year}-${month}-${counter.toString().padStart(3, "0")}`
      if (!existingNumbers.includes(numero)) {
        return numero
      }
      counter++
    }
  }

 async function handleAddInvestment(e) {
    e.preventDefault();
    const formData = new FormData(addInvestmentForm);

    const newInvestment = {
        numero: formData.get("numero"),
        intitule: formData.get("intitule"),
        type_programme: formData.get("programme"), // Changé de "programme" à "type_programme"
        annee_budget: formData.get("annee"),       // Changé de "annee" à "annee_budget"
        budget_alloue: parseFloat(formData.get("budget")), // Changé de "budget" à "budget_alloue"
        montant_engage: parseFloat(formData.get("engage")), // Changé de "engage" à "montant_engage"
        montant_payee: parseFloat(formData.get("paye")),    // Changé de "paye" à "montant_payee"
        etat_avancement: parseFloat(formData.get("avancement")),
        statut: formData.get("statut"),
        entreprise: formData.get("entreprise"),
        cause_non_lancement: formData.get("description"),
        date_debut: formData.get("dateDebut"),
        date_prevue_fin: formData.get("dateFin"),
        daira: formData.get("daira"),
        commune: formData.get("commune"),
        beneficiaire: formData.get("beneficiaire"),
        created_by: 1
    };

    if (!validateInvestment(newInvestment)) return;

    try {
        const response = await fetch("/DSA1/API/investissement/ajouter.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newInvestment),
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification("✅ Projet ajouté avec succès !", "success");
            loadInvestmentsFromAPI();
            closeModal();
            addInvestmentForm.reset();
        } else {
            showNotification("❌ Erreur : " + result.message, "error");
        }
    } catch (error) {
        console.error("Erreur fetch :", error);
        showNotification("Erreur réseau", "error");
    }
}

  async function handleEditInvestment(e) {
    e.preventDefault();
    console.log("✅ Formulaire de modification soumis !");

    const formData = new FormData(editInvestmentForm);
    const investmentId = formData.get("id");

    if (!investmentId) {
      showNotification("ID du projet manquant", "error");
      return;
    }

    const updatedInvestment = {
      id: investmentId,
      code_projet: formData.get("numero"),
      numero_operation: formData.get("numero"),
      intitule: formData.get("intitule"),
      localisation: formData.get("commune"),
      daira: formData.get("daira"),
      commune: formData.get("commune"),
      beneficiaire: formData.get("beneficiaire"),
      type_programme: formData.get("programme"),
      annee_budget: parseInt(formData.get("annee")),
      budget_alloue: parseFloat(formData.get("budget")),
      montant_engage: parseFloat(formData.get("engage")),
      montant_payee: parseFloat(formData.get("paye")),
      etat_avancement: parseFloat(formData.get("avancement")),
      entreprise: currentEditingInvestment?.entreprise || "",
      statut: formData.get("statut"),
      description: formData.get("description"),
      date_debut: formData.get("dateDebut"),
      date_prevue_fin: formData.get("dateFin"),
      type_budget: currentEditingInvestment?.type_budget || "pcd",
      maitre_ouvrage: formData.get("beneficiaire") || "DSA Guelma"
    };

    if (!validateInvestment(updatedInvestment)) return;

    try {
      const response = await fetch("/DSA1/API/investissement/modifier.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInvestment),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification("✅ Projet modifié avec succès !", "success");
        loadInvestmentsFromAPI(); // recharge depuis la BDD
        closeModal(); // ferme la modal
        currentEditingInvestment = null;
      } else {
        showNotification("❌ Erreur : " + result.message, "error");
      }
    } catch (error) {
      console.error("Erreur fetch :", error);
      showNotification("Erreur réseau", "error");
    }
  }

  function filterInvestments() {
    const searchTerm = searchInput?.value.toLowerCase() || ""
    const selectedYear = yearFilter?.value || "all"
    const selectedProgramme = programmeFilter?.value || "all"

    const rows = document.querySelectorAll("#investments-table-body tr")

    rows.forEach((row) => {
      const title = row.querySelector(".investment-title strong")?.textContent.toLowerCase() || ""
      const numero = row.querySelector(".investment-numero strong")?.textContent.toLowerCase() || ""
      const programme = row.querySelector(".programme-badge")?.textContent.toLowerCase() || ""

      // Récupérer l'année de l'investissement depuis les données
      const numeroText = row.querySelector(".investment-numero strong")?.textContent || ""
      const investment = investments.find((inv) => inv.numero === numeroText)
      const investmentYear = investment ? investment.annee.toString() : ""

      const matchesSearch = title.includes(searchTerm) || numero.includes(searchTerm)
      const matchesYear = selectedYear === "all" || investmentYear === selectedYear
      const matchesProgramme = selectedProgramme === "all" || programme.includes(selectedProgramme.toLowerCase())

      if (matchesSearch && matchesYear && matchesProgramme) {
        row.style.display = ""
        row.style.animation = "fadeInUp 0.3s ease"
      } else {
        row.style.display = "none"
      }
    })

    updateStats()
  }

  function validateInvestment(investment) {
    const errors = [];

    if (!investment.intitule || investment.intitule.trim().length < 3) {
        errors.push("L'intitulé doit contenir au moins 3 caractères");
    }

    if (!investment.type_programme) {
        errors.push("Le programme est obligatoire");
    }

    if (!investment.budget_alloue || investment.budget_alloue <= 0) {
        errors.push("Le budget doit être supérieur à 0");
    }

    if (investment.montant_engage < 0) {
        errors.push("Le montant engagé ne peut pas être négatif");
    }

    if (investment.montant_payee < 0) {
        errors.push("Le montant payé ne peut pas être négatif");
    }

    if (investment.montant_payee > investment.budget_alloue) {
        errors.push("Le montant payé ne peut pas dépasser le budget alloué");
    }

    if (errors.length > 0) {
        showNotification(errors.join("\n"), "error");
        return false;
    }

    return true;
}

  function updateStats() {
    const electrificationProjects = projectsData.filter(p => p.type === 'electrification').length;
    const investmentProjects = projectsData.filter(p => p.type === 'investment').length;
    const completedProjects = projectsData.filter(p => p.status === 'completed').length;
    const inProgressProjects = projectsData.filter(p => p.status === 'in-progress').length;
    
    // Mettre à jour les éléments du DOM
    document.getElementById('total-projects').textContent = projectsData.length;
    document.getElementById('electrification-projects').textContent = electrificationProjects;
    document.getElementById('investment-projects').textContent = investmentProjects;
    document.getElementById('completed-projects').textContent = completedProjects;
    document.getElementById('inprogress-projects').textContent = inProgressProjects;
}

  function animateCounters() {
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target") || counter.textContent || "0");
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    });
  }

  function closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show")
    })
    currentEditingInvestment = null
  }

  function toggleExportMenu(e) {
    e.stopPropagation()
    exportDropdown?.classList.toggle("show")
  }

  function closeExportMenu(e) {
    if (!e.target.closest(".export-container")) {
      exportDropdown?.classList.remove("show")
    }
  }

  // ==================== FONCTIONS D'EXPORT PDF ====================
  function exportToPDF() {
    exportDropdown?.classList.remove("show")
    showNotification("Génération du PDF en cours...", "info")

    try {
      // Vérifier si jsPDF est disponible
      if (typeof window.jspdf === "undefined") {
        showNotification("Bibliothèque PDF non chargée. Veuillez recharger la page.", "error")
        return
      }

      const { jsPDF } = window.jspdf

      // Créer un nouveau document PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Configuration des couleurs et styles
      const primaryColor = [21, 101, 192] // #1565c0
      const secondaryColor = [102, 102, 102] // #666
      const lightGray = [245, 245, 245] // #f5f5f5

      // En-tête du document
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 297, 25, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.text("RAPPORT DES INVESTISSEMENTS AGRICOLES", 148.5, 15, { align: "center" })

      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Direction des Services Agricoles - Wilaya de Guelma", 148.5, 20, { align: "center" })

      // Informations du rapport
      doc.setTextColor(...secondaryColor)
      doc.setFontSize(10)
      doc.text(`Date de génération: ${new Date().toLocaleDateString("fr-FR")}`, 20, 35)
      doc.text(`Nombre total d'investissements: ${investments.length}`, 20, 40)

      const totalBudget = investments.reduce((sum, inv) => sum + inv.budget, 0)
      const totalEngage = investments.reduce((sum, inv) => sum + inv.engage, 0)
      const totalPaye = investments.reduce((sum, inv) => sum + inv.paye, 0)

      doc.text(`Budget total: ${formatCurrency(totalBudget)}`, 20, 45)
      doc.text(`Montant engagé: ${formatCurrency(totalEngage)}`, 150, 35)
      doc.text(`Montant payé: ${formatCurrency(totalPaye)}`, 150, 40)
      doc.text(`Montant restant: ${formatCurrency(totalBudget - totalPaye)}`, 150, 45)

      // Tableau des investissements
      const headers = [
        "N° Opération",
        "Intitulé",
        "Programme",
        "Budget (DA)",
        "Engagé (DA)",
        "Payé (DA)",
        "Avancement",
        "Statut",
      ]

      const programmeLabels = {
        normal: "Normal",
        normale: "Normal",
        psne: "PSNE",
        psre: "PSRE",
        hp: "HP",
        urgence: "Urgence",
        special: "Spécial",
        complementaire: "Complémentaire",
        pcsc: "PCSC",
        sud: "Sud",
      }

      const statusLabels = {
        "en-cours": "En cours",
        planifie: "Planifié",
        termine: "Terminé",
        suspendu: "Suspendu",
        annule: "Annulé",
      }

      // Préparer les données du tableau
      const tableData = investments.map((investment) => [
        investment.numero || "N/A",
        investment.intitule.length > 25 ? investment.intitule.substring(0, 25) + "..." : investment.intitule,
        programmeLabels[investment.programme] || investment.programme,
        formatNumber(investment.budget),
        formatNumber(investment.engage),
        formatNumber(investment.paye),
        `${investment.avancement}%`,
        statusLabels[investment.statut] || investment.statut,
      ])

      // Dessiner le tableau
      let yPosition = 55
      const rowHeight = 8
      const colWidths = [35, 50, 25, 30, 30, 30, 20, 25]
      const xPosition = 20

      // En-têtes du tableau
      doc.setFillColor(...primaryColor)
      doc.rect(
        xPosition,
        yPosition,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight,
        "F",
      )

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")

      let currentX = xPosition
      headers.forEach((header, index) => {
        doc.text(header, currentX + colWidths[index] / 2, yPosition + 5, { align: "center" })
        currentX += colWidths[index]
      })

      yPosition += rowHeight

      // Données du tableau
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)

      tableData.forEach((row, rowIndex) => {
        // Alterner les couleurs de fond
        if (rowIndex % 2 === 0) {
          doc.setFillColor(...lightGray)
          doc.rect(
            xPosition,
            yPosition,
            colWidths.reduce((a, b) => a + b, 0),
            rowHeight,
            "F",
          )
        }

        currentX = xPosition
        row.forEach((cell, cellIndex) => {
          doc.text(String(cell), currentX + colWidths[cellIndex] / 2, yPosition + 5, { align: "center" })
          currentX += colWidths[cellIndex]
        })

        yPosition += rowHeight

        // Nouvelle page si nécessaire
        if (yPosition > 180) {
          doc.addPage()
          yPosition = 20
        }
      })

      // Pied de page
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setTextColor(...secondaryColor)
        doc.setFontSize(8)
        doc.text(`Page ${i} sur ${pageCount}`, 148.5, 200, { align: "center" })
        doc.text("Direction des Services Agricoles - Guelma", 148.5, 205, { align: "center" })
      }

      // Sauvegarder le PDF
      const fileName = `investissements_dsa_guelma_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)

      showNotification("PDF généré avec succès !", "success")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      showNotification("Erreur lors de la génération du PDF: " + error.message, "error")
    }
  }

  // ==================== FONCTIONS D'EXPORT EXCEL ====================
  function exportToExcel() {
    exportDropdown?.classList.remove("show")
    showNotification("Génération du fichier Excel en cours...", "info")

    try {
      // Vérifier si XLSX est disponible
      if (typeof XLSX === "undefined") {
        showNotification("Bibliothèque Excel non chargée. Veuillez recharger la page.", "error")
        return
      }

      const programmeLabels = {
        normal: "Normal",
        normale: "Normal",
        psne: "PSNE",
        psre: "PSRE",
        hp: "HP",
        urgence: "Urgence",
        special: "Spécial",
        complementaire: "Complémentaire",
        pcsc: "PCSC",
        sud: "Sud",
      }

      const statusLabels = {
        "en-cours": "En cours",
        planifie: "Planifié",
        termine: "Terminé",
        suspendu: "Suspendu",
        annule: "Annulé",
      }

      // Préparer les données pour Excel
      const excelData = investments.map((investment) => ({
        "N° Opération": investment.numero || "N/A",
        Intitulé: investment.intitule,
        Programme: programmeLabels[investment.programme] || investment.programme,
        Année: investment.annee,
        "Budget alloué (DA)": investment.budget,
        "Montant engagé (DA)": investment.engage,
        "Montant payé (DA)": investment.paye,
        "Budget restant (DA)": investment.budget - investment.paye,
        "Avancement (%)": investment.avancement,
        Statut: statusLabels[investment.statut] || investment.statut,
        Daïra: investment.daira || "",
        Commune: investment.commune || "",
        Bénéficiaire: investment.beneficiaire || "",
        "Date début": investment.dateDebut ? formatDate(investment.dateDebut) : "",
        "Date fin": investment.dateFin ? formatDate(investment.dateFin) : "",
        Description: investment.description || "",
        Observations: investment.observations
          ? investment.observations.map((obs) => `${formatDate(obs.date)}: ${obs.text}`).join(" | ")
          : "",
      }))

      // Créer un nouveau workbook
      const wb = XLSX.utils.book_new()

      // Créer la feuille principale avec les données
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Définir la largeur des colonnes
      const colWidths = [
        { wch: 15 }, // N° Opération
        { wch: 40 }, // Intitulé
        { wch: 12 }, // Programme
        { wch: 8 }, // Année
        { wch: 15 }, // Budget alloué
        { wch: 15 }, // Montant engagé
        { wch: 15 }, // Montant payé
        { wch: 15 }, // Budget restant
        { wch: 12 }, // Avancement
        { wch: 12 }, // Statut
        { wch: 15 }, // Daïra
        { wch: 15 }, // Commune
        { wch: 25 }, // Bénéficiaire
        { wch: 12 }, // Date début
        { wch: 12 }, // Date fin
        { wch: 30 }, // Description
        { wch: 50 }, // Observations
      ]

      ws["!cols"] = colWidths

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, "Investissements")

      // Créer une feuille de statistiques
      const statsData = [
        { Indicateur: "Nombre total d'investissements", Valeur: investments.length },
        { Indicateur: "Budget total alloué (DA)", Valeur: investments.reduce((sum, inv) => sum + inv.budget, 0) },
        { Indicateur: "Montant total engagé (DA)", Valeur: investments.reduce((sum, inv) => sum + inv.engage, 0) },
        { Indicateur: "Montant total payé (DA)", Valeur: investments.reduce((sum, inv) => sum + inv.paye, 0) },
        {
          Indicateur: "Budget restant (DA)",
          Valeur: investments.reduce((sum, inv) => sum + (inv.budget - inv.paye), 0),
        },
        {
          Indicateur: "Taux d'exécution moyen (%)",
          Valeur: Math.round(investments.reduce((sum, inv) => sum + inv.avancement, 0) / investments.length),
        },
      ]

      const statsWs = XLSX.utils.json_to_sheet(statsData)
      statsWs["!cols"] = [{ wch: 30 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, statsWs, "Statistiques")

      // Créer une feuille par programme
      const programmeStats = {}
      investments.forEach((inv) => {
        if (!programmeStats[inv.programme]) {
          programmeStats[inv.programme] = []
        }
        programmeStats[inv.programme].push(inv)
      })

      Object.entries(programmeStats).forEach(([programme, invs]) => {
        const programmeData = invs.map((investment) => ({
          "N° Opération": investment.numero || "N/A",
          Intitulé: investment.intitule,
          "Budget (DA)": investment.budget,
          "Engagé (DA)": investment.engage,
          "Payé (DA)": investment.paye,
          "Avancement (%)": investment.avancement,
          Statut: statusLabels[investment.statut] || investment.statut,
          Bénéficiaire: investment.beneficiaire || "",
        }))

        const programmeWs = XLSX.utils.json_to_sheet(programmeData)
        programmeWs["!cols"] = [
          { wch: 15 },
          { wch: 40 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 12 },
          { wch: 12 },
          { wch: 25 },
        ]

        const sheetName = (programmeLabels[programme] || programme).substring(0, 31)
        XLSX.utils.book_append_sheet(wb, programmeWs, sheetName)
      })

      // Sauvegarder le fichier
      const fileName = `investissements_dsa_guelma_${new Date().toISOString().split("T")[0]}.xlsx`
      XLSX.writeFile(wb, fileName)

      showNotification("Fichier Excel généré avec succès !", "success")
    } catch (error) {
      console.error("Erreur lors de la génération du fichier Excel:", error)
      showNotification("Erreur lors de la génération du fichier Excel: " + error.message, "error")
    }
  }

  // ==================== FONCTIONS D'IMPRESSION ====================
  function printInvestments() {
    showNotification("Préparation de l'impression...", "info")

    try {
      const printWindow = window.open("", "_blank", "width=1200,height=800")

      const programmeLabels = {
        normal: "Normal",
        normale: "Normal",
        psne: "PSNE",
        psre: "PSRE",
        hp: "HP",
        urgence: "Urgence",
        special: "Spécial",
        complementaire: "Complémentaire",
        pcsc: "PCSC",
        sud: "Sud",
      }

      const statusLabels = {
        "en-cours": "En cours",
        planifie: "Planifié",
        termine: "Terminé",
        suspendu: "Suspendu",
        annule: "Annulé",
      }

      const totalBudget = investments.reduce((sum, inv) => sum + inv.budget, 0)
      const totalEngage = investments.reduce((sum, inv) => sum + inv.engage, 0)
      const totalPaye = investments.reduce((sum, inv) => sum + inv.paye, 0)

      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport des Investissements DSA Guelma</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 12px;
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px;
            border: 2px solid #1565c0;
            background: #f8f9fa;
          }
          .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 24px;
            color: #1565c0;
          }
          .header p { 
            margin: 5px 0; 
            font-size: 14px;
            color: #666;
          }
          
          /* STATISTIQUES AVEC TITRES SIMPLES */
          .stats-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
          }
          .stats-title {
            font-size: 18px;
            font-weight: bold;
            color: #1565c0;
            margin-bottom: 15px;
            text-transform: uppercase;
            border-bottom: 2px solid #1565c0;
            padding-bottom: 5px;
          }
          .stat-item {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
          }
          .stat-label {
            font-weight: bold;
            color: #333;
            display: inline-block;
            width: 250px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #1565c0;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 30px;
            font-size: 10px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #1565c0; 
            color: white; 
            font-weight: bold;
            text-align: center;
          }
          tr:nth-child(even) { 
            background-color: #f8f9fa; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 11px; 
            color: #666;
            border-top: 2px solid #1565c0;
            padding-top: 15px;
          }
          .status { 
            padding: 3px 8px; 
            border-radius: 4px; 
            font-size: 9px; 
            font-weight: bold;
            text-align: center;
          }
          .status-en-cours { background-color: #e8f5e9; color: #2e7d32; }
          .status-termine { background-color: #e3f2fd; color: #1565c0; }
          .status-planifie { background-color: #fff8e1; color: #f57f17; }
          .status-suspendu { background-color: #ffebee; color: #c62828; }
          .status-annule { background-color: #fce4ec; color: #ad1457; }
          .programme-badge {
            background: #e3f2fd;
            color: #1565c0;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
          }
          .print-date {
            text-align: right;
            font-style: italic;
            margin-bottom: 20px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .header { break-inside: avoid; }
            table { break-inside: avoid; }
            tr { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RAPPORT DES INVESTISSEMENTS AGRICOLES</h1>
          <p>Direction des Services Agricoles - Wilaya de Guelma</p>
          <p>Système de Gestion des Investissements</p>
        </div>
        
        <div class="print-date">
          Date d'impression: ${new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} à ${new Date().toLocaleTimeString("fr-FR")}
        </div>

        <div class="stats-section">
          <div class="stats-title">📊 STATISTIQUES GÉNÉRALES</div>
          
          <div class="stat-item">
            <span class="stat-label">NOMBRE TOTAL D'INVESTISSEMENTS :</span>
            <span class="stat-value">${investments.length}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">BUDGET TOTAL ALLOUÉ :</span>
            <span class="stat-value">${formatCurrency(totalBudget)}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">MONTANT TOTAL ENGAGÉ :</span>
            <span class="stat-value">${formatCurrency(totalEngage)}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">MONTANT TOTAL PAYÉ :</span>
            <span class="stat-value">${formatCurrency(totalPaye)}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">BUDGET RESTANT :</span>
            <span class="stat-value">${formatCurrency(totalBudget - totalPaye)}</span>
          </div>
        </div>
        
        <div class="stats-title">📋 LISTE DÉTAILLÉE DES INVESTISSEMENTS</div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">N° Opération</th>
              <th style="width: 25%;">Intitulé</th>
              <th style="width: 10%;">Programme</th>
              <th style="width: 12%;">Budget (DA)</th>
              <th style="width: 12%;">Engagé (DA)</th>
              <th style="width: 12%;">Payé (DA)</th>
              <th style="width: 8%;">Avancement</th>
              <th style="width: 9%;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${investments
              .map(
                (investment) => `
              <tr>
                <td><strong>${investment.numero || "N/A"}</strong></td>
                <td>
                  <strong>${investment.intitule}</strong>
                  <br><small style="color: #666;">${investment.beneficiaire || "Non assigné"}</small>
                </td>
                <td>
                  <span class="programme-badge">${programmeLabels[investment.programme] || investment.programme}</span>
                </td>
                <td><strong>${formatCurrency(investment.budget)}</strong></td>
                <td><strong>${formatCurrency(investment.engage)}</strong></td>
                <td><strong>${formatCurrency(investment.paye)}</strong></td>
                <td style="text-align: center;"><strong>${investment.avancement}%</strong></td>
                <td>
                  <span class="status status-${investment.statut}">${statusLabels[investment.statut] || investment.statut}</span>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>Direction des Services Agricoles - Wilaya de Guelma</strong></p>
          <p>Adresse: Route de Constantine, Guelma 24000 | Tél: +213 (0) 37 20 XX XX</p>
          <p>Email: contact@dsa-guelma.dz | Site web: www.dsa-guelma.dz</p>
          <p style="margin-top: 10px; font-style: italic;">Document généré automatiquement par le système de gestion des investissements</p>
        </div>
      </body>
      </html>
    `

      printWindow.document.write(printContent)
      printWindow.document.close()

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.onafterprint = () => {
            printWindow.close()
          }
          showNotification("Impression lancée avec succès", "success")
        }, 500)
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error)
      showNotification("Erreur lors de l'impression: " + error.message, "error")
    }
  }

  function printInvestmentDetails() {
    if (!currentEditingInvestment && !document.querySelector(".project-details-content h4")) {
      showNotification("Aucun investissement sélectionné pour l'impression", "warning")
      return
    }

    showNotification("Préparation de l'impression des détails...", "info")

    try {
      const investment =
        currentEditingInvestment ||
        investments.find((inv) => inv.intitule === document.querySelector(".project-details-content h4")?.textContent)

      if (!investment) {
        showNotification("Investissement non trouvé", "error")
        return
      }

      const printWindow = window.open("", "_blank", "width=800,height=600")

      const programmeLabels = {
        normal: "Normal",
        normale: "Normal",
        psne: "PSNE",
        psre: "PSRE",
        hp: "HP",
        urgence: "Urgence",
        special: "Spécial",
        complementaire: "Complémentaire",
        pcsc: "PCSC",
        sud: "Sud",
      }

      const statusLabels = {
        "en-cours": "En cours",
        planifie: "Planifié",
        termine: "Terminé",
        suspendu: "Suspendu",
        annule: "Annulé",
      }

      const budgetRestant = investment.budget - investment.paye

      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Détails de l'Investissement - ${investment.intitule}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px;
            border: 2px solid #1565c0;
            background: #f8f9fa;
          }
          .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 20px;
            color: #1565c0;
          }
          .investment-code {
            background: #e3f2fd;
            padding: 8px 16px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 10px;
            font-family: monospace;
            font-weight: bold;
            color: #1565c0;
            border: 1px solid #1565c0;
          }
          .print-date { 
            text-align: right; 
            margin-bottom: 20px; 
            font-style: italic; 
            color: #666;
          }
          
          /* SECTIONS AVEC TITRES */
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1565c0;
            margin: 25px 0 15px 0;
            text-transform: uppercase;
            border-bottom: 2px solid #1565c0;
            padding-bottom: 5px;
          }
          
          .detail-item { 
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px dotted #ddd;
          }
          .detail-item label { 
            font-weight: bold; 
            color: #333; 
            display: inline-block;
            width: 180px;
            text-transform: uppercase;
          }
          .detail-item span { 
            color: #1565c0; 
            font-weight: 600; 
          }
          
          .description-section { 
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            background: #f8f9fa;
          }
          .description-section .section-title {
            margin-top: 0;
          }
          
          .observations-section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            background: #f8f9fa;
          }
          .observation-item {
            margin: 10px 0;
            padding: 10px;
            border-left: 3px solid #1565c0;
            background: white;
          }
          .observation-date {
            font-weight: bold;
            color: #1565c0;
            margin-bottom: 5px;
          }
          
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            font-size: 12px; 
            color: #666; 
            border-top: 2px solid #1565c0;
            padding-top: 20px;
          }
          
          .progress-info {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #1565c0;
            text-align: center;
            margin: 10px 0;
          }
          
          @media print {
            body { margin: 0; }
            .header { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 DÉTAILS DE L'INVESTISSEMENT</h1>
          <p>Direction des Services Agricoles - Wilaya de Guelma</p>
          <div class="investment-code">${investment.numero || "N/A"}</div>
        </div>
        
        <div class="print-date">
          Date d'impression: ${new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} à ${new Date().toLocaleTimeString("fr-FR")}
        </div>

        <h2 style="color: #1565c0; border-bottom: 2px solid #1565c0; padding-bottom: 10px; text-align: center;">
          ${investment.intitule}
        </h2>

        <div class="section-title">📋 INFORMATIONS GÉNÉRALES</div>
        
        <div class="detail-item">
          <label>Programme :</label>
          <span>${programmeLabels[investment.programme] || investment.programme}</span>
        </div>
        
        <div class="detail-item">
          <label>Année budgétaire :</label>
          <span>${investment.annee}</span>
        </div>
        
        <div class="detail-item">
          <label>Statut :</label>
          <span>${statusLabels[investment.statut] || investment.statut}</span>
        </div>
        
        <div class="detail-item">
          <label>Bénéficiaire :</label>
          <span>${investment.beneficiaire || "Non spécifié"}</span>
        </div>
        
        <div class="detail-item">
          <label>Localisation :</label>
          <span>${investment.daira || ""}${investment.commune ? " / " + investment.commune : ""}</span>
        </div>
        
        <div class="detail-item">
          <label>Période d'exécution :</label>
          <span>${formatDate(investment.dateDebut)} - ${formatDate(investment.dateFin)}</span>
        </div>

        <div class="section-title">💰 INFORMATIONS FINANCIÈRES</div>
        
        <div class="detail-item">
          <label>Budget alloué :</label>
          <span>${formatCurrency(investment.budget)}</span>
        </div>
        
        <div class="detail-item">
          <label>Montant engagé :</label>
          <span>${formatCurrency(investment.engage)}</span>
        </div>
        
        <div class="detail-item">
          <label>Montant payé :</label>
          <span>${formatCurrency(investment.paye)}</span>
        </div>
        
        <div class="detail-item">
          <label>Budget restant :</label>
          <span>${formatCurrency(budgetRestant)}</span>
        </div>

        <div class="section-title">📊 AVANCEMENT DU PROJET</div>
        
        <div class="progress-info">
          <strong>TAUX D'AVANCEMENT : ${investment.avancement}%</strong>
        </div>

        ${
          investment.description
            ? `
          <div class="description-section">
            <div class="section-title">📝 DESCRIPTION DU PROJET</div>
            <p>${investment.description}</p>
          </div>
        `
            : ""
        }

        ${
          investment.observations && investment.observations.length > 0
            ? `
          <div class="observations-section">
            <div class="section-title">📋 OBSERVATIONS ET SUIVI</div>
            ${investment.observations
              .map(
                (obs) => `
              <div class="observation-item">
                <div class="observation-date">📅 ${formatDate(obs.date)}</div>
                <p>${obs.text}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        
        <div class="footer">
          <p><strong>Direction des Services Agricoles - Wilaya de Guelma</strong></p>
          <p>Adresse: Route de Constantine, Guelma 24000 | Tél: +213 (0) 37 20 XX XX</p>
          <p>Email: contact@dsa-guelma.dz | Site web: www.dsa-guelma.dz</p>
        </div>
      </body>
      </html>
    `

      printWindow.document.write(printContent)
      printWindow.document.close()

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.onafterprint = () => {
            printWindow.close()
          }
          showNotification("Impression des détails lancée avec succès", "success")
        }, 500)
      }
    } catch (error) {
      console.error("Erreur lors de l'impression des détails:", error)
      showNotification("Erreur lors de l'impression des détails: " + error.message, "error")
    }
  }

  function exportInvestmentDetails() {
    if (!currentEditingInvestment && !document.querySelector(".project-details-content h4")) {
      showNotification("Aucun investissement sélectionné pour l'export", "warning")
      return
    }

    showNotification("Génération du PDF des détails en cours...", "info")

    try {
      if (typeof window.jspdf === "undefined") {
        showNotification("Bibliothèque PDF non chargée. Veuillez recharger la page.", "error")
        return
      }

      const investment =
        currentEditingInvestment ||
        investments.find((inv) => inv.intitule === document.querySelector(".project-details-content h4")?.textContent)

      if (!investment) {
        showNotification("Investissement non trouvé", "error")
        return
      }

      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      const primaryColor = [21, 101, 192]
      const secondaryColor = [102, 102, 102]

      // En-tête
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 30, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("DÉTAILS DE L'INVESTISSEMENT", 105, 15, { align: "center" })

      doc.setFontSize(10)
      doc.text("Direction des Services Agricoles - Wilaya de Guelma", 105, 22, { align: "center" })

      // Informations générales
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(investment.intitule, 20, 45)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...secondaryColor)
      doc.text(`N° Opération: ${investment.numero || "N/A"}`, 20, 52)
      doc.text(`Date de génération: ${new Date().toLocaleDateString("fr-FR")}`, 20, 57)

      // Détails financiers
      let yPos = 70
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("INFORMATIONS FINANCIÈRES", 20, yPos)

      yPos += 10
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      const financialData = [
        ["Budget alloué:", formatCurrency(investment.budget)],
        ["Montant engagé:", formatCurrency(investment.engage)],
        ["Montant payé:", formatCurrency(investment.paye)],
        ["Budget restant:", formatCurrency(investment.budget - investment.paye)],
        ["Taux d'avancement:", `${investment.avancement}%`],
      ]

      financialData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold")
        doc.text(label, 25, yPos)
        doc.setFont("helvetica", "normal")
        doc.text(value, 80, yPos)
        yPos += 7
      })

      // Informations administratives
      yPos += 10
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("INFORMATIONS ADMINISTRATIVES", 20, yPos)

      yPos += 10
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      const adminData = [
        ["Programme:", investment.programme.toUpperCase()],
        ["Année:", investment.annee.toString()],
        ["Statut:", getStatusLabel(investment.statut)],
        ["Bénéficiaire:", investment.beneficiaire || "Non spécifié"],
        ["Localisation:", `${investment.daira || ""}${investment.commune ? " / " + investment.commune : ""}`],
        ["Date début:", formatDate(investment.dateDebut)],
        ["Date fin:", formatDate(investment.dateFin)],
      ]

      adminData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold")
        doc.text(label, 25, yPos)
        doc.setFont("helvetica", "normal")
        const splitText = doc.splitTextToSize(value, 100)
        doc.text(splitText, 80, yPos)
        yPos += splitText.length * 7
      })

      // Description
      if (investment.description) {
        yPos += 10
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("DESCRIPTION", 20, yPos)

        yPos += 10
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const descriptionText = doc.splitTextToSize(investment.description, 170)
        doc.text(descriptionText, 20, yPos)
        yPos += descriptionText.length * 5
      }

      // Observations
      if (investment.observations && investment.observations.length > 0) {
        yPos += 15
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("OBSERVATIONS", 20, yPos)

        yPos += 10
        investment.observations.forEach((obs) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(9)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(...primaryColor)
          doc.text(`${formatDate(obs.date)}:`, 25, yPos)

          doc.setFont("helvetica", "normal")
          doc.setTextColor(0, 0, 0)
          const obsText = doc.splitTextToSize(obs.text, 160)
          doc.text(obsText, 25, yPos + 5)
          yPos += obsText.length * 4 + 8
        })
      }

      // Pied de page
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setTextColor(...secondaryColor)
        doc.setFontSize(8)
        doc.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: "center" })
        doc.text("Direction des Services Agricoles - Guelma", 105, 295, { align: "center" })
      }

      // Sauvegarder
      const fileName = `details_investissement_${(investment.numero || "projet").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
      doc.save(fileName)

      showNotification("PDF des détails généré avec succès !", "success")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF des détails:", error)
      showNotification("Erreur lors de la génération du PDF des détails: " + error.message, "error")
    }
  }

  // ==================== FONCTIONS GOOGLE MAPS ====================
  function loadGoogleMapsScript() {
    // Simuler une carte simple sans Google Maps API
    console.log("Carte simple chargée")
  }

  function showInvestmentsMap() {
    const mapModal = document.getElementById("map-modal")
    if (mapModal) {
      mapModal.classList.add("show")

      const mapContainer = document.getElementById("map-container")
      if (mapContainer) {
        mapContainer.innerHTML = `
        <div style="padding: 20px; background: #f8f9fa; height: 100%; overflow-y: auto;">
          <h3 style="color: #1565c0; margin-bottom: 20px; text-align: center;">
            📍 LOCALISATION DES INVESTISSEMENTS - WILAYA DE GUELMA
          </h3>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
            ${investments
              .map(
                (investment) => `
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1565c0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 10px 0; color: #1565c0; font-size: 14px;">
                  ${investment.intitule}
                </h4>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>N°:</strong> ${investment.numero || "N/A"}
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Localisation:</strong> ${investment.daira || ""}${investment.commune ? " / " + investment.commune : ""}
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Budget:</strong> ${formatCurrency(investment.budget)}
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Statut:</strong> 
                  <span style="background: ${getStatusColorForMap(investment.statut)}; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                    ${getStatusLabel(investment.statut)}
                  </span>
                </p>
                <button onclick="showInvestmentDetailsFromMap('${investment.id}')" 
                        style="background: #1565c0; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 8px;">
                  Voir détails
                </button>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              💡 Carte simplifiée des investissements par localisation
            </p>
          </div>
        </div>
      `
      }

      showNotification("Carte des investissements chargée", "success")
    }
  }

  // ==================== FONCTIONS UTILITAIRES ====================
  function updateCurrentTime() {
    const timeElement = document.getElementById("current-time")
    if (timeElement) {
      const now = new Date()
      const timeString = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      timeElement.textContent = timeString
    }
  }

  function initCompactCalendar() {
    const calendarGrid = document.getElementById("calendar-grid-compact")
    const monthYearSpan = document.getElementById("calendar-month-year")
    const prevMonthBtn = document.getElementById("prev-month")
    const nextMonthBtn = document.getElementById("next-month")

    if (!calendarGrid) return

    const currentDate = new Date()

    function generateCompactCalendar(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      if (monthYearSpan) {
        monthYearSpan.textContent = date.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        })
      }

      calendarGrid.innerHTML = ""

      for (let i = 0; i < 42; i++) {
        const cellDate = new Date(startDate)
        cellDate.setDate(startDate.getDate() + i)

        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day-compact"
        dayElement.textContent = cellDate.getDate()

        if (cellDate.getMonth() !== month) {
          dayElement.classList.add("other-month")
        }

        if (cellDate.toDateString() === new Date().toDateString()) {
          dayElement.classList.add("today")
        }

        // Vérifier s'il y a des investissements ce jour-là
        const hasInvestments = investments.some((investment) => {
          const startDate = new Date(investment.dateDebut)
          const endDate = new Date(investment.dateFin)
          return cellDate >= startDate && cellDate <= endDate
        })

        if (hasInvestments) {
          dayElement.classList.add("has-investments")
          dayElement.title = "Investissements actifs ce jour"
          dayElement.style.background = "#e3f2fd"
          dayElement.style.color = "#1565c0"
          dayElement.style.fontWeight = "bold"
        }

        calendarGrid.appendChild(dayElement)
      }
    }

    prevMonthBtn?.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      generateCompactCalendar(currentDate)
    })

    nextMonthBtn?.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      generateCompactCalendar(currentDate)
    })

    generateCompactCalendar(currentDate)
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  function formatNumber(amount) {
    return new Intl.NumberFormat("fr-DZ", {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(dateString) {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  function getStatusLabel(status) {
    switch (status) {
      case "en-cours":
        return "En cours"
      case "planifie":
        return "Planifié"
      case "termine":
        return "Terminé"
      case "suspendu":
        return "Suspendu"
      case "annule":
        return "Annulé"
      default:
        return status || "Non défini"
    }
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px solid ${type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#2196f3"};
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      z-index: 1100;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
      max-width: 400px;
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
      notification.style.opacity = "1"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      notification.style.opacity = "0"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "fa-check-circle"
      case "error":
        return "fa-exclamation-circle"
      case "warning":
        return "fa-exclamation-triangle"
      case "info":
        return "fa-info-circle"
      default:
        return "fa-check-circle"
    }
  }

  // Fonction pour le statut de la carte
  function getStatusColorForMap(status) {
    switch (status) {
      case "en-cours":
        return "#e8f5e9" // Vert clair
      case "planifie":
        return "#fff8e1" // Jaune clair
      case "termine":
        return "#e3f2fd" // Bleu clair
      case "suspendu":
        return "#ffebee" // Rouge très clair
      case "annule":
        return "#fce4ec" // Rose très clair
      default:
        return "#f5f5f5" // Gris très clair
    }
  }

  // Fonction globale pour accéder depuis l'élément HTML
  window.showInvestmentDetailsFromMap = function(id) {
    showInvestmentDetails(id);
    document.getElementById("map-modal")?.classList.remove("show");
  };
})