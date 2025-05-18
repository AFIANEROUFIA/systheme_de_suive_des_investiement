document.addEventListener("DOMContentLoaded", () => {
  // Données de démonstration
  const investmentsData = [
    {
      id: "INV-2024-001",
      title: "Construction Centre Santé",
      program: "Normal",
      budget: 150000000,
      engaged: 120000000,
      paid: 95000000,
      progress: 63,
      status: "in-progress",
      year: 2024,
      startDate: "2024-01-15",
      endDate: "2024-11-30",
      contractor: "Entreprise BTP SARL",
      location: "Subdivision Nord",
    },
    {
      id: "INV-2024-002",
      title: "Équipement Lycée Technique",
      program: "PSNE",
      budget: 75000000,
      engaged: 75000000,
      paid: 60000000,
      progress: 80,
      status: "in-progress",
      year: 2024,
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      contractor: "Fournisseur Équipements",
      location: "Subdivision Sud",
    },
    {
      id: "INV-2024-003",
      title: "Aménagement Parc Urbain",
      program: "Urgence",
      budget: 45000000,
      engaged: 30000000,
      paid: 15000000,
      progress: 33,
      status: "in-progress",
      year: 2024,
      startDate: "2024-05-10",
      endDate: "2024-12-15",
      contractor: "Paysagiste ENP",
      location: "Subdivision Est",
    },
    {
      id: "INV-2023-004",
      title: "Réhabilitation Route Principale",
      program: "Normal",
      budget: 280000000,
      engaged: 280000000,
      paid: 280000000,
      progress: 100,
      status: "completed",
      year: 2023,
      startDate: "2023-02-01",
      endDate: "2023-10-15",
      contractor: "Génie Civil EURL",
      location: "Subdivision Ouest",
    },
    {
      id: "INV-2024-005",
      title: "Système Irrigation Agricole",
      program: "Spécial",
      budget: 90000000,
      engaged: 45000000,
      paid: 0,
      progress: 0,
      status: "planned",
      year: 2024,
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      contractor: "AgriTech SA",
      location: "Subdivision Sud",
    },
  ]

  // Initialisation
  loadInvestments()
  updateSummaryCards()
  setupExportButtons()

  // Gestion des filtres
  const yearSelect = document.getElementById("year")
  const programSelect = document.getElementById("program")
  const searchInput = document.querySelector(".search-box input")

  yearSelect.addEventListener("change", () => {
    filterInvestments()
    updateSummaryCards()
  })
  programSelect.addEventListener("change", filterInvestments)
  searchInput.addEventListener("input", filterInvestments)

  // Bouton Nouvel Investissement
  const newInvestmentBtn = document.getElementById("new-investment-btn")
  newInvestmentBtn.addEventListener("click", openNewInvestmentModal)

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
                <td>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 0%;" data-width="${investment.progress}%"></div>
                    </div>
                    <small>${investment.progress}%</small>
                </td>
                <td>
                    <span class="status-badge status-${investment.status}">
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
      setTimeout(() => {
        const progressBar = row.querySelector(".progress-bar")
        progressBar.style.width = progressBar.getAttribute("data-width")
      }, 100)
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
    // Bouton d'exportation Excel
    const exportBtn = document.querySelector(".btn-export")
    if (exportBtn) {
      exportBtn.addEventListener("click", exportToExcel)
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

    // Créer un tableau CSV
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "N° Op,Intitulé,Programme,Budget,Engagé,Payé,Avancement,Statut\n"

    filteredData.forEach((investment) => {
      csvContent +=
        `${investment.id},` +
        `"${investment.title}",` +
        `${investment.program},` +
        `${investment.budget},` +
        `${investment.engaged},` +
        `${investment.paid},` +
        `${investment.progress}%,` +
        `${getStatusText(investment.status)}\n`
    })

    // Créer un lien de téléchargement
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `investissements_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Données exportées avec succès")
  }

  function printTable() {
    window.print()
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

  function updateSummaryCards() {
    const currentYear = document.getElementById("year").value
    const yearInvestments = investmentsData.filter((i) => i.year.toString() === currentYear)

    const totalBudget = yearInvestments.reduce((sum, i) => sum + i.budget, 0)
    const totalEngaged = yearInvestments.reduce((sum, i) => sum + i.engaged, 0)
    const totalPaid = yearInvestments.reduce((sum, i) => sum + i.paid, 0)
    const totalRemaining = totalBudget - totalEngaged

    // Mettre à jour les montants
    document.querySelector(".summary-card.total .amount").textContent = `${formatNumber(totalBudget)} DA`
    document.querySelector(".summary-card.engaged .amount").textContent = `${formatNumber(totalEngaged)} DA`
    document.querySelector(".summary-card.paid .amount").textContent = `${formatNumber(totalPaid)} DA`
    document.querySelector(".summary-card.remaining .amount").textContent = `${formatNumber(totalRemaining)} DA`

    const engagementRate = totalBudget > 0 ? Math.round((totalEngaged / totalBudget) * 100) : 0
    const paymentRate = totalEngaged > 0 ? Math.round((totalPaid / totalEngaged) * 100) : 0

    document.querySelector(".summary-card.engaged .info").textContent = `${engagementRate}% du budget`
    document.querySelector(".summary-card.paid .info").textContent = `${paymentRate}% des engagements`
    document.querySelector(".summary-card.remaining .info").textContent =
      `${Math.round((totalRemaining / totalBudget) * 100)}% du budget`
  }

  function showInvestmentDetails(investmentId) {
    const investment = investmentsData.find((i) => i.id === investmentId)
    if (!investment) return

    const modal = document.getElementById("investment-details-modal")
    const modalContent = modal.querySelector(".modal-content")

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
                                ${getStatusText(investment.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
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

  function editInvestment(investmentId) {
    const investment = investmentsData.find((i) => i.id === investmentId)
    if (!investment) return

    const modal = document.getElementById("new-investment-modal")

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
                                <label for="investment-title">Intitulé*</label>
                                <input type="text" id="investment-title" value="${investment.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="investment-program">Programme*</label>
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
                                <label for="investment-location">Localisation*</label>
                                <select id="investment-location" required>
                                    <option value="">Sélectionner...</option>
                                    <option ${investment.location === "Subdivision Nord" ? "selected" : ""}>Subdivision Nord</option>
                                    <option ${investment.location === "Subdivision Sud" ? "selected" : ""}>Subdivision Sud</option>
                                    <option ${investment.location === "Subdivision Est" ? "selected" : ""}>Subdivision Est</option>
                                    <option ${investment.location === "Subdivision Ouest" ? "selected" : ""}>Subdivision Ouest</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="investment-year">Année*</label>
                                <select id="investment-year" required>
                                    <option value="2023" ${investment.year === 2023 ? "selected" : ""}>2023</option>
                                    <option value="2024" ${investment.year === 2024 ? "selected" : ""}>2024</option>
                                    <option value="2025" ${investment.year === 2025 ? "selected" : ""}>2025</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3><i class="fas fa-money-bill-wave"></i> Financement</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-budget">Budget alloué (DA)*</label>
                                <input type="number" id="investment-budget" min="0" value="${investment.budget}" required>
                            </div>
                            <div class="form-group">
                                <label for="investment-engaged">Montant engagé (DA)</label>
                                <input type="number" id="investment-engaged" min="0" value="${investment.engaged}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-paid">Montant payé (DA)</label>
                                <input type="number" id="investment-paid" min="0" value="${investment.paid}">
                            </div>
                            <div class="form-group">
                                <label for="investment-progress">Avancement (%)</label>
                                <input type="number" id="investment-progress" min="0" max="100" value="${investment.progress}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3><i class="fas fa-hard-hat"></i> Exécution</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-contractor">Entreprise</label>
                                <input type="text" id="investment-contractor" value="${investment.contractor || ""}">
                            </div>
                            <div class="form-group">
                                <label for="investment-status">Statut</label>
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
                                <label for="investment-start">Date début</label>
                                <input type="date" id="investment-start" value="${investment.startDate || ""}">
                            </div>
                            <div class="form-group">
                                <label for="investment-end">Date fin prévue</label>
                                <input type="date" id="investment-end" value="${investment.endDate || ""}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-cancel">Annuler</button>
                        <button type="submit" class="btn btn-submit">
                            <i class="fas fa-save"></i> Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        `

    modal.classList.remove("hidden")

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
        // Mettre à jour l'investissement existant
        investmentsData[index] = {
          id: id,
          title: document.getElementById("investment-title").value,
          program: document.getElementById("investment-program").value,
          budget: Number.parseInt(document.getElementById("investment-budget").value),
          engaged: Number.parseInt(document.getElementById("investment-engaged").value) || 0,
          paid: Number.parseInt(document.getElementById("investment-paid").value) || 0,
          progress: Number.parseInt(document.getElementById("investment-progress").value) || 0,
          status: document.getElementById("investment-status").value,
          year: Number.parseInt(document.getElementById("investment-year").value),
          startDate: document.getElementById("investment-start").value || null,
          endDate: document.getElementById("investment-end").value || null,
          contractor: document.getElementById("investment-contractor").value || null,
          location: document.getElementById("investment-location").value,
        }

        // Fermer la modal et actualiser l'affichage
        modal.classList.add("hidden")
        loadInvestments()
        updateSummaryCards()

        showNotification(`Investissement ${id} modifié avec succès !`)
      }
    })
  }

  function openNewInvestmentModal() {
    const modal = document.getElementById("new-investment-modal")

    modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2><i class="fas fa-plus-circle"></i> Nouvel Investissement</h2>
                
                <form id="investment-form" class="investment-form">
                    <div class="form-section">
                        <h3><i class="fas fa-info-circle"></i> Informations de base</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-title">Intitulé*</label>
                                <input type="text" id="investment-title" required>
                            </div>
                            <div class="form-group">
                                <label for="investment-program">Programme*</label>
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
                                <label for="investment-location">Localisation*</label>
                                <select id="investment-location" required>
                                    <option value="">Sélectionner...</option>
                                    <option>Subdivision Nord</option>
                                    <option>Subdivision Sud</option>
                                    <option>Subdivision Est</option>
                                    <option>Subdivision Ouest</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="investment-year">Année*</label>
                                <select id="investment-year" required>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3><i class="fas fa-money-bill-wave"></i> Financement</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-budget">Budget alloué (DA)*</label>
                                <input type="number" id="investment-budget" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="investment-engaged">Montant engagé (DA)</label>
                                <input type="number" id="investment-engaged" min="0" value="0">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-paid">Montant payé (DA)</label>
                                <input type="number" id="investment-paid" min="0" value="0">
                            </div>
                            <div class="form-group">
                                <label for="investment-progress">Avancement (%)</label>
                                <input type="number" id="investment-progress" min="0" max="100" value="0">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3><i class="fas fa-hard-hat"></i> Exécution</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="investment-contractor">Entreprise</label>
                                <input type="text" id="investment-contractor">
                            </div>
                            <div class="form-group">
                                <label for="investment-status">Statut</label>
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
                                <label for="investment-start">Date début</label>
                                <input type="date" id="investment-start">
                            </div>
                            <div class="form-group">
                                <label for="investment-end">Date fin prévue</label>
                                <input type="date" id="investment-end">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-cancel">Annuler</button>
                        <button type="submit" class="btn btn-submit">
                            <i class="fas fa-save"></i> Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        `

    modal.classList.remove("hidden")

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

      // Créer le nouvel investissement
      const newInvestment = {
        id: investmentId,
        title: document.getElementById("investment-title").value,
        program: document.getElementById("investment-program").value,
        budget: Number.parseInt(document.getElementById("investment-budget").value),
        engaged: Number.parseInt(document.getElementById("investment-engaged").value) || 0,
        paid: Number.parseInt(document.getElementById("investment-paid").value) || 0,
        progress: Number.parseInt(document.getElementById("investment-progress").value) || 0,
        status: document.getElementById("investment-status").value,
        year: Number.parseInt(year),
        startDate: document.getElementById("investment-start").value || null,
        endDate: document.getElementById("investment-end").value || null,
        contractor: document.getElementById("investment-contractor").value || null,
        location: document.getElementById("investment-location").value,
      }

      // Ajouter à notre "base de données"
      investmentsData.push(newInvestment)

      // Fermer la modal et actualiser l'affichage
      modal.classList.add("hidden")
      loadInvestments()
      updateSummaryCards()

      showNotification(`Investissement ${investmentId} créé avec succès !`)
    })
  }

  function showNotification(message) {
    // Créer une notification
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
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
})
