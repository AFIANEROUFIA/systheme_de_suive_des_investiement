document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM
  const projectsTableBody = document.getElementById("projects-table-body")
  const searchInput = document.querySelector(".search-input")
  const statusFilter = document.getElementById("status-filter")
  const dairaFilter = document.getElementById("daira-filter")
  const exportBtn = document.getElementById("export-btn")
  const exportDropdown = document.getElementById("export-dropdown")
  const exportPdf = document.getElementById("export-pdf")
  const exportExcel = document.getElementById("export-excel")
  const addProjectBtn = document.getElementById("add-project-btn")
  const counters = document.querySelectorAll(".counter")

  // Modals
  const addProjectModal = document.getElementById("add-project-modal")
  const editProjectModal = document.getElementById("edit-project-modal")
  const projectDetailsModal = document.getElementById("project-details-modal")

  // Formulaires
  const addProjectForm = document.getElementById("add-project-form")
  const editProjectForm = document.getElementById("edit-project-form")

  // Données des communes par daïra de la wilaya de Guelma
  const communesByDaira = {
    guelma: ["Guelma", "Belkheir", "Medjez Amar"],
    "oued-zenati": ["Oued Zenati", "Ain Hessainia", "Nechmaya", "Bordj Sabath"],
    heliopolis: ["Héliopolis", "Khezaras", "Sellaoua Announa"],
    bouchegouf: ["Bouchegouf", "Hammam N'Bails", "Roknia"],
    "hammam-debagh": ["Hammam Debagh", "Ras El Agba", "Ain Sandel"],
    "ain-makhlouf": ["Ain Makhlouf", "Houari Boumediene", "El Fedjoudj"],
  }

  // Données des projets d'électrification uniquement
  const electrificationProjects = [
    {
      id: "ELEC-2024-001",
      code: "ELEC-2024-05-123",
      title: "Électrification Zone Agricole Oued Zenati",
      nature: "installation-lignes",
      installationType: "forage",
      daira: "oued-zenati",
      commune: "Oued Zenati",
      budget: 45000000,
      startDate: "2024-03-15",
      endDate: "2024-09-30",
      status: "in-progress",
      contractor: "Entreprise Électrique SARL",
      description: "Installation de lignes électriques pour la zone agricole",
      dateReceptionDemande: "2024-01-10",
      dateEnvoiSonelgaz: "2024-02-01",
      dateAccordSonelgaz: "2024-02-28",
      observations: [
        {
          date: "2024-03-15",
          text: "Début des travaux d'installation",
        },
        {
          date: "2024-04-10",
          text: "Installation des poteaux terminée",
        },
      ],
      coordinates: { lat: 36.4667, lng: 7.5 },
    },
    {
      id: "ELEC-2024-002",
      code: "ELEC-2024-04-089",
      title: "Réseau Électrique Fermes Héliopolis",
      nature: "extension-reseau",
      installationType: "etable",
      daira: "heliopolis",
      commune: "Héliopolis",
      budget: 32000000,
      startDate: "2024-06-01",
      endDate: "2024-12-15",
      status: "planned",
      contractor: "ElectroPower Algérie",
      description: "Mise en place d'un réseau électrique pour les fermes",
      dateReceptionDemande: "2024-03-15",
      dateEnvoiSonelgaz: "2024-04-01",
      dateAccordSonelgaz: "2024-05-10",
      observations: [
        {
          date: "2024-05-10",
          text: "Accord Sonelgaz reçu, préparation du chantier",
        },
      ],
      coordinates: { lat: 36.5, lng: 7.45 },
    },
    {
      id: "ELEC-2024-003",
      code: "ELEC-2024-03-045",
      title: "Électrification Forage Bouchegouf",
      nature: "raccordement",
      installationType: "puits",
      daira: "bouchegouf",
      commune: "Bouchegouf",
      budget: 28500000,
      startDate: "2023-11-01",
      endDate: "2024-04-20",
      status: "completed",
      contractor: "TechElec SARL",
      description: "Électrification complète du système de forage",
      dateReceptionDemande: "2023-08-15",
      dateEnvoiSonelgaz: "2023-09-01",
      dateAccordSonelgaz: "2023-10-15",
      observations: [
        {
          date: "2023-11-01",
          text: "Début des travaux de raccordement",
        },
        {
          date: "2024-02-15",
          text: "Tests de fonctionnement réussis",
        },
        {
          date: "2024-04-20",
          text: "Projet terminé avec succès, installation conforme aux normes",
        },
      ],
      coordinates: { lat: 36.4333, lng: 7.6167 },
    },
    {
      id: "ELEC-2024-004",
      code: "ELEC-2024-06-156",
      title: "Poste de Transformation Guelma Centre",
      nature: "transformation",
      installationType: "entrepot",
      daira: "guelma",
      commune: "Guelma",
      budget: 52000000,
      startDate: "2024-08-01",
      endDate: "2025-02-28",
      status: "planned",
      contractor: "Électro-Technique SARL",
      description: "Installation d'un nouveau poste de transformation",
      dateReceptionDemande: "2024-05-20",
      dateEnvoiSonelgaz: "",
      dateAccordSonelgaz: "",
      observations: [
        {
          date: "2024-05-20",
          text: "Demande reçue et en cours d'étude",
        },
      ],
      coordinates: { lat: 36.4611, lng: 7.4278 },
    },
  ]

  let currentEditingProject = null

  // Initialisation
  init()

  function init() {
    loadProjects()
    renderProjects()
    animateCounters()
    setupEventListeners()
    updateStats()
    setupCommuneSelectors()
    updateCurrentDate()
    updateCurrentTime()
    updateCurrentDateShort()
    initCompactCalendar() // Changé ici

    // Mettre à jour l'heure toutes les secondes
    setInterval(updateCurrentTime, 1000)
  }

  function setupEventListeners() {
    // Recherche et filtres
    searchInput?.addEventListener("input", filterProjects)
    statusFilter?.addEventListener("change", filterProjects)
    dairaFilter?.addEventListener("change", filterProjects)

    // Export
    exportBtn?.addEventListener("click", toggleExportMenu)
    document.addEventListener("click", closeExportMenu)
    exportPdf?.addEventListener("click", exportToPDF)
    exportExcel?.addEventListener("click", exportToExcel)

    // Impression
    const printBtn = document.getElementById("print-btn")
    printBtn?.addEventListener("click", printProjects)

    // Nouveau projet
    addProjectBtn?.addEventListener("click", openAddProjectModal)

    // Formulaires
    addProjectForm?.addEventListener("submit", handleAddProject)
    editProjectForm?.addEventListener("submit", handleEditProjectSubmit)

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

    // Sélecteurs de wilaya
    document.getElementById("project-wilaya")?.addEventListener("change", updateCommuneOptions)
    document.getElementById("edit-project-wilaya")?.addEventListener("change", updateEditCommuneOptions)

    // Boutons d'export/impression des détails
    document.getElementById("print-details-btn")?.addEventListener("click", printProjectDetails)
    document.getElementById("export-details-btn")?.addEventListener("click", exportProjectDetails)

    // Ajouter les event listeners pour les nouvelles fonctionnalités
    document.getElementById("project-daira")?.addEventListener("change", updateCommuneOptions)
    document.getElementById("edit-project-daira")?.addEventListener("change", updateEditCommuneOptions)
    document.getElementById("maps-btn")?.addEventListener("click", showProjectsMap)

    // Fonction pour gérer le toggle des observations
    let showAllObservations = false
    document.getElementById("toggle-observations")?.addEventListener("click", function () {
      showAllObservations = !showAllObservations
      const container = document.getElementById("edit-observations-list")
      const project = currentEditingProject

      if (project && project.observations) {
        displayObservations(project.observations, container, showAllObservations)
        this.innerHTML = showAllObservations
          ? '<i class="fas fa-eye-slash"></i> Voir dernière observation'
          : '<i class="fas fa-eye"></i> Voir toutes les observations'
      }
    })
  }

  function setupCommuneSelectors() {
    updateCommuneOptions()
    updateEditCommuneOptions()
  }

  // Fonction pour mettre à jour les communes selon la daïra
  function updateCommuneOptions() {
    const dairaSelect = document.getElementById("project-daira")
    const communeSelect = document.getElementById("project-commune")

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
    const dairaSelect = document.getElementById("edit-project-daira")
    const communeSelect = document.getElementById("edit-project-commune")

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
  function renderProjects() {
    if (!projectsTableBody) return
    projectsTableBody.innerHTML = ""
  
    electrificationProjects.forEach((project, index) => {
      const row = createProjectRow(project)
      projectsTableBody.appendChild(row)
  
      // Animation
      setTimeout(() => {
        row.style.opacity = "1"
        row.style.transform = "translateY(0)"
      }, index * 100)
    })
  
    addRowEventListeners()
  }
  
  

  function loadProjects() {
    fetch("http://localhost/DSA1/API/electrification/get_all.php")
      .then(response => response.json())
      .then(data => {
        electrificationProjects.length = 0
        data.forEach(project => {
          electrificationProjects.push({
            ...project,
            id: project.code_projet, // 🟢 ICI : on rend l'id égal au code_projet
            code: project.code_projet,
            title: project.intitule,
            nature: project.nature_juridique,
            installationType: project.type_installation,
            daira: project.daira,
            commune: project.commune,
            budget: parseFloat(project.budget),
            startDate: project.date_debut,
            endDate: project.date_prevue_fin,
            status: project.statut,
            contractor: project.entrepreneur,
            description: project.description_technique,
            dateReceptionDemande: project.date_reception_demande,
            dateEnvoiSonelgaz: project.date_envoi_sonelgaz,
            dateAccordSonelgaz: project.date_accord_sonelgaz,
            observations: project.observations
              ? [{ date: project.date_debut, text: project.observations }]
              : [],
          })
        })
        renderProjects()
      })
      .catch(error => {
        console.error("Erreur de chargement des projets :", error)
        showNotification("Impossible de charger les projets", "error")
      })
  }
  
  
  

  function createProjectRow(project) {
    const row = document.createElement("tr")
    row.style.opacity = "0"
    row.style.transform = "translateY(20px)"
    row.style.transition = "all 0.3s ease"

    let statusClass = ""
    let statusLabel = ""

    switch (project.status) {
      case "in-progress":
        statusClass = "in-progress"
        statusLabel = "En cours"
        break
      case "planned":
        statusClass = "planned"
        statusLabel = "Planifié"
        break
      case "completed":
        statusClass = "completed"
        statusLabel = "Terminé"
        break
    }

    const natureLabels = {
      "installation-lignes": "Installation lignes",
      raccordement: "Raccordement",
      "extension-reseau": "Extension réseau",
      maintenance: "Maintenance",
      transformation: "Transformation",
      eclairage: "Éclairage public",
    }

    const wilayaLabels = {
      guelma: "Guelma",
      "oued-zenati": "Oued Zenati",
      heliopolis: "Héliopolis",
      bouchegouf: "Bouchegouf",
    }

    row.innerHTML = `
            <td>
                <div class="project-code">
                    <strong>${project.code}</strong>
                </div>
            </td>
            <td>
                <div class="project-title">
                    <strong>${project.title}</strong>
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${project.contractor || "Non assigné"}</small>
                </div>
            </td>
            <td>
                <span class="nature-badge">${natureLabels[project.nature] || project.nature}</span>
            </td>
            <td>
                <div>
                    <strong>${wilayaLabels[project.daira] || project.daira}</strong>
                    <small style="color: var(--text-secondary); display: block;">${project.commune}</small>
                </div>
            </td>
            <td>
                <strong>${formatCurrency(project.budget)}</strong>
            </td>
            <td>${formatDate(project.startDate)}</td>
            <td>${formatDate(project.endDate)}</td>
            <td>
                <span class="status-badge status-${statusClass}">${statusLabel}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view-btn" data-id="${project.id}" title="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${project.id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${project.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `

    return row
  }

  function addRowEventListeners() {
    // Boutons de visualisation
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-id")
        showProjectDetails(projectId)
      })
    })

    // Boutons de modification
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-id")
        openEditProjectModal(projectId)
      })
    })

    // Boutons de suppression
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-id")
        deleteProject(projectId)
      })
    })
  }

  function filterProjects() {
    const searchTerm = searchInput?.value.toLowerCase() || ""
    const selectedStatus = statusFilter?.value || "all"
    const selectedDaira = dairaFilter?.value || "all"

    const rows = document.querySelectorAll("#projects-table-body tr")

    rows.forEach((row) => {
      const title = row.querySelector(".project-title strong")?.textContent.toLowerCase() || ""
      const code = row.querySelector(".project-code strong")?.textContent.toLowerCase() || ""
      const status = getStatusFromBadge(row.querySelector(".status-badge"))
      const wilayaText = row.querySelector("td:nth-child(4) strong")?.textContent.toLowerCase() || ""

      const matchesSearch = title.includes(searchTerm) || code.includes(searchTerm)
      const matchesStatus = selectedStatus === "all" || status === selectedStatus
      const matchesDaira = selectedDaira === "all" || wilayaText.includes(selectedDaira.replace("-", " "))

      if (matchesSearch && matchesStatus && matchesDaira) {
        row.style.display = ""
        row.style.animation = "fadeInUp 0.3s ease"
      } else {
        row.style.display = "none"
      }
    })

    updateStats()
  }

  function getStatusFromBadge(badge) {
    if (badge?.classList.contains("status-in-progress")) return "in-progress"
    if (badge?.classList.contains("status-planned")) return "planned"
    if (badge?.classList.contains("status-completed")) return "completed"
    return ""
  }

  function openAddProjectModal() {
    addProjectModal?.classList.add("show")
    // Générer un nouveau code de projet
    const newCode = generateProjectCode()
    document.getElementById("project-code").value = newCode
  }

  function openEditProjectModal(projectId) {
    const project = electrificationProjects.find((p) => p.id === projectId)
    if (!project) return

    currentEditingProject = project

    // Remplir le formulaire avec les données du projet
    document.getElementById("edit-project-code").value = project.code
    document.getElementById("edit-project-title").value = project.title
    document.getElementById("edit-project-nature").value = project.nature
    document.getElementById("edit-project-installation-type").value = project.installationType || ""
    document.getElementById("edit-project-daira").value = project.daira
    document.getElementById("edit-project-budget").value = project.budget
    document.getElementById("edit-project-contractor").value = project.contractor || ""
    document.getElementById("edit-project-status").value = project.status
    document.getElementById("edit-date-reception-demande").value = project.dateReceptionDemande || ""
    document.getElementById("edit-date-envoi-sonelgaz").value = project.dateEnvoiSonelgaz || ""
    document.getElementById("edit-date-accord-sonelgaz").value = project.dateAccordSonelgaz || ""
    document.getElementById("edit-date-commencement").value = project.startDate
    document.getElementById("edit-date-fin").value = project.endDate
    document.getElementById("edit-project-description").value = project.description || ""

    // Mettre à jour les communes
    updateEditCommuneOptions()
    setTimeout(() => {
      document.getElementById("edit-project-commune").value = project.commune.toLowerCase().replace(/\s+/g, "-")
    }, 100)

    // Afficher les observations existantes
    const observationsList = document.getElementById("edit-observations-list")
    if (observationsList && project.observations) {
      displayObservations(project.observations, observationsList, false)
    }

    editProjectModal?.classList.add("show")
  }

  function generateProjectCode() {
    const year = new Date().getFullYear()
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
    const existingCodes = electrificationProjects.map((p) => p.code)
    let counter = 1

    while (true) {
      const code = `ELEC-${year}-${month}-${counter.toString().padStart(3, "0")}`
      if (!existingCodes.includes(code)) {
        return code
      }
      counter++
    }
  }

  function handleAddProject(e) {
    e.preventDefault();

    const formData = new FormData(addProjectForm);

    // Construire l'objet JSON attendu par l'API
    const data = {
        intitule: formData.get("title"),
        code_projet: formData.get("code"),
        nature_juridique: formData.get("nature"),
        localisation: "", // Si tu veux ajouter une valeur
        daira: formData.get("daira"),
        commune: formData.get("commune"),
        adresse: "", // facultatif
        type_installation: formData.get("installationType"),
        description_technique: formData.get("description"),
        budget: parseFloat(formData.get("budget")),
        entrepreneur: formData.get("contractor"),
        statut: formData.get("status"),
        date_debut: formData.get("startDate"),
        date_prevue_fin: formData.get("endDate"),
        date_reception_demande: formData.get("dateReceptionDemande") || null,
        date_envoi_sonelgaz: formData.get("dateEnvoiSonelgaz") || null,
        date_accord_sonelgaz: formData.get("dateAccordSonelgaz") || null,
        observations: "", // ou laisse null
        fichier_justificatif: null,
        created_by: 1
    }

    // Envoi de la requête POST à ton API
    fetch("http://localhost/DSA1/API/electrification/ajouter.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((result) => {
        if (result.message?.includes("créé")) {
            showNotification("Projet ajouté avec succès", "success");
            closeModal();
            addProjectForm.reset();
        } else {
            showNotification("Erreur: " + result.message, "error");
        }
    })
    .catch((error) => {
        console.error("Erreur réseau:", error);
        showNotification("Erreur lors de l’envoi de la requête", "error");
    });
}
function ajouterObservation(codeProjet, texte, date) {
  const projet = electrificationProjects.find(p => p.code === codeProjet);

  if (!projet || !projet.id) {
    console.warn("Projet introuvable pour observation :", codeProjet);
    showNotification("Projet non trouvé pour ajouter l'observation", "error");
    return;
  }

  const data = {
    projet_id: projet.id,
    observation_text: texte,
    date_observation: date,
    created_by: 1
  };

  fetch("http://localhost/DSA1/API/electrification/ajouter_observation.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        console.log("Réponse de l'API observation :", json);

        if (json.message?.includes("succès")) {
          showNotification("Observation ajoutée", "success");
        } else {
          showNotification("Erreur : " + json.message, "error");
        }
      } catch (e) {
        console.error("Erreur JSON (contenu brut) :", text);
        showNotification("Erreur : réponse inattendue du serveur", "error");
      }
    })
    .catch((err) => {
      console.error("Erreur fetch observation :", err);
      showNotification("Erreur réseau lors de l’ajout de l’observation", "error");
    });
}



function handleEditProjectSubmit(e) {
  e.preventDefault();

  const formData = new FormData(editProjectForm);
  const codeProjet = formData.get("code");

  const updatedProject = {
    code_projet: codeProjet,
    intitule: formData.get("title"),
    nature_juridique: formData.get("nature"),
    daira: formData.get("daira"),
    commune: formData.get("commune"),
    type_installation: formData.get("installationType"),
    budget: parseFloat(formData.get("budget")),
    statut: formData.get("status"),
    date_debut: formData.get("startDate"),
    date_prevue_fin: formData.get("endDate"),
    description_technique: formData.get("description") || null,
    entrepreneur: formData.get("contractor") || null
  };

  fetch("http://localhost/DSA1/API/electrification/modifier.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProject)
  })
    .then(res => res.json())
    .then(result => {
      console.log("Résultat brut de l'API :", result); // 🔍 Ajouté pour vérif

      if (result.message === "Projet mis à jour avec succès.") {
        showNotification("Projet modifié avec succès", "success");

        const obsText = formData.get("newObservation");
        if (obsText && obsText.trim().length > 0) {
          const today = new Date().toISOString().slice(0, 10);
          ajouterObservation(codeProjet, obsText, today);
        }

        closeModal();
        loadProjects();
      } else {
        showNotification("Erreur : " + result.message, "error");
      }
    })
    .catch(err => {
      console.error("Erreur API modification :", err);
      showNotification("Erreur lors de la mise à jour", "error");
    });
}



  function showProjectDetails(projectId) {
    const project = electrificationProjects.find((p) => p.id === projectId)
    if (!project) return

    const modal = document.getElementById("project-details-modal")
    const content = modal?.querySelector(".project-details-content")

    if (!content) return

    const natureLabels = {
      "installation-lignes": "Installation de lignes",
      raccordement: "Raccordement électrique",
      "extension-reseau": "Extension de réseau",
      maintenance: "Maintenance électrique",
      transformation: "Poste de transformation",
      eclairage: "Éclairage public",
    }

    const wilayaLabels = {
      guelma: "Guelma",
      "oued-zenati": "Oued Zenati",
      heliopolis: "Héliopolis",
      bouchegouf: "Bouchegouf",
    }

    const statusLabels = {
      "in-progress": "En cours",
      planned: "Planifié",
      completed: "Terminé",
    }

    content.innerHTML = `
            <div class="project-detail-header">
                <h4>${project.title}</h4>
                <span style="font-family: monospace; background: var(--electric-light); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9rem;">${project.code}</span>
            </div>
            <div class="project-detail-grid">
                <div class="detail-item">
                    <label>Nature de la tâche</label>
                    <span>${natureLabels[project.nature] || project.nature}</span>
                </div>
                <div class="detail-item">
                    <label>Wilaya</label>
                    <span>${wilayaLabels[project.daira] || project.daira}</span>
                </div>
                <div class="detail-item">
                    <label>Commune</label>
                    <span>${project.commune}</span>
                </div>
                <div class="detail-item">
                    <label>Budget</label>
                    <span>${formatCurrency(project.budget)}</span>
                </div>
                <div class="detail-item">
                    <label>Entrepreneur</label>
                    <span>${project.contractor || "Non assigné"}</span>
                </div>
                <div class="detail-item">
                    <label>Statut</label>
                    <span>${statusLabels[project.status] || project.status}</span>
                </div>
                <div class="detail-item">
                    <label>Date commencement</label>
                    <span>${formatDate(project.startDate)}</span>
                </div>
                <div class="detail-item">
                    <label>Date fin prévue</label>
                    <span>${formatDate(project.endDate)}</span>
                </div>
                ${
                  project.dateReceptionDemande
                    ? `
                <div class="detail-item">
                    <label>Date réception demande</label>
                    <span>${formatDate(project.dateReceptionDemande)}</span>
                </div>`
                    : ""
                }
                ${
                  project.dateEnvoiSonelgaz
                    ? `
                <div class="detail-item">
                    <label>Date envoi Sonelgaz</label>
                    <span>${formatDate(project.dateEnvoiSonelgaz)}</span>
                </div>`
                    : ""
                }
                ${
                  project.dateAccordSonelgaz
                    ? `
                <div class="detail-item">
                    <label>Date accord Sonelgaz</label>
                    <span>${formatDate(project.dateAccordSonelgaz)}</span>
                </div>`
                    : ""
                }
            </div>
            ${
              project.description
                ? `
            <div class="detail-description">
                <label>Description</label>
                <p>${project.description}</p>
            </div>`
                : ""
            }
            ${
              project.observations
                ? `
            <div class="detail-description">
                <label>Observations/Remarques</label>
                <p>${project.observations}</p>
            </div>`
                : ""
            }
        `

    modal?.classList.add("show")
  }

  function deleteProject(projectId) {
    const project = electrificationProjects.find(p => p.id === projectId)
  
    if (!project) {
      showNotification("Projet introuvable", "error")
      return
    }
  
    if (confirm(`Voulez-vous vraiment supprimer le projet "${project.title}" ?`)) {
      fetch("http://localhost/DSA1/API/electrification/supprimer.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code_projet: project.code })
      })
        .then(res => res.json())
        .then(result => {
          if (result.message?.includes("succès")) {
            showNotification("Projet supprimé avec succès", "success")
            loadProjects()
          } else {
            showNotification("Erreur : " + result.message, "error")
          }
        })
        .catch(error => {
          console.error("Erreur :", error)
          showNotification("Erreur réseau lors de la suppression", "error")
        })
    }
  }
  
  

  function printProjectDetails() {
    if (!currentEditingProject && !document.querySelector(".project-details-content h4")) return

    const projectTitle = document.querySelector(".project-details-content h4")?.textContent || "Projet"
    const projectCode = document.querySelector(".project-details-content span")?.textContent || ""

    const printWindow = window.open("", "_blank", "width=800,height=600")
    const detailsContent = document.querySelector(".project-details-content").innerHTML

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Détails du Projet - ${projectTitle}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; color: #1565c0; }
          .print-date { text-align: right; margin-bottom: 20px; font-style: italic; }
          .project-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .detail-item { padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
          .detail-item label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 5px; }
          .detail-item span { color: #1565c0; font-weight: 500; }
          .detail-description { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          .detail-description label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; display: block; }
          .detail-description p { color: #333; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Détails du Projet d'Électrification</h1>
        <div class="print-date">Date d'impression: ${new Date().toLocaleDateString("fr-FR")}</div>
        ${detailsContent}
        <div class="footer">
          Direction des Services Agricoles - Guelma
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
  }

  function exportProjectDetails() {
    if (!currentEditingProject && !document.querySelector(".project-details-content h4")) return

    const projectTitle = document.querySelector(".project-details-content h4")?.textContent || "Projet"

    showNotification("Génération du PDF en cours...", "info")

    setTimeout(() => {
      try {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        // Configuration
        doc.setFontSize(16)
        doc.text(`Détails du Projet: ${projectTitle}`, 20, 20)

        doc.setFontSize(10)
        doc.text(`Date de génération: ${new Date().toLocaleDateString("fr-FR")}`, 20, 30)

        // Extraire les informations du projet affiché
        const detailItems = document.querySelectorAll(".detail-item")
        let yPosition = 50

        detailItems.forEach((item) => {
          const label = item.querySelector("label")?.textContent || ""
          const value = item.querySelector("span")?.textContent || ""

          doc.setFont(undefined, "bold")
          doc.setFontSize(9)
          doc.text(label + ":", 20, yPosition)

          doc.setFont(undefined, "normal")
          doc.text(value, 80, yPosition)

          yPosition += 8
        })

        // Description et observations
        const descriptions = document.querySelectorAll(".detail-description")
        descriptions.forEach((desc) => {
          const label = desc.querySelector("label")?.textContent || ""
          const text = desc.querySelector("p")?.textContent || ""

          yPosition += 5
          doc.setFont(undefined, "bold")
          doc.setFontSize(9)
          doc.text(label + ":", 20, yPosition)

          yPosition += 8
          doc.setFont(undefined, "normal")
          const splitText = doc.splitTextToSize(text, 170)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 5
        })

        // Sauvegarder le PDF
        const fileName = `projet_electrification_${projectTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`
        doc.save(fileName)
        showNotification("PDF généré avec succès !", "success")
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error)
        showNotification("Erreur lors de la génération du PDF", "error")
      }
    }, 1000)
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

  function exportToPDF() {
    exportDropdown?.classList.remove("show")
    showNotification("Génération du PDF en cours...", "info")

    setTimeout(() => {
      try {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        // Configuration
        doc.setFontSize(16)
        doc.text("Rapport des Projets d'Électrification - DSA Guelma", 20, 20)

        doc.setFontSize(10)
        doc.text(`Date de génération: ${new Date().toLocaleDateString("fr-FR")}`, 20, 30)

        // En-têtes du tableau
        const headers = ["Code", "Intitulé", "Nature", "Wilaya", "Budget", "Statut"]
        let yPosition = 50

        // Dessiner les en-têtes
        doc.setFontSize(8)
        doc.setFont(undefined, "bold")
        headers.forEach((header, index) => {
          doc.text(header, 20 + index * 30, yPosition)
        })

        yPosition += 10

        // Dessiner les données
        doc.setFont(undefined, "normal")
        electrificationProjects.forEach((project) => {
          const natureLabels = {
            "installation-lignes": "Inst. lignes",
            raccordement: "Raccord.",
            "extension-reseau": "Ext. réseau",
            maintenance: "Maint.",
            transformation: "Transform.",
            eclairage: "Éclairage",
          }

          const statusLabels = {
            "in-progress": "En cours",
            planned: "Planifié",
            completed: "Terminé",
          }

          const row = [
            project.code,
            project.title.substring(0, 20) + "...",
            natureLabels[project.nature] || project.nature,
            project.daira,
            formatCurrency(project.budget),
            statusLabels[project.status] || project.status,
          ]

          row.forEach((cell, index) => {
            doc.text(cell.toString(), 20 + index * 30, yPosition)
          })

          yPosition += 8

          // Nouvelle page si nécessaire
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
        })

        // Sauvegarder le PDF
        doc.save("projets_electrification_dsa_guelma.pdf")
        showNotification("PDF généré avec succès !", "success")
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error)
        showNotification("Erreur lors de la génération du PDF", "error")
      }
    }, 1000)
  }

  function exportToExcel() {
    exportDropdown?.classList.remove("show");
    showNotification("Génération du fichier Excel en cours...", "info");

    try {
        const natureLabels = {
            "installation-lignes": "Installation de lignes",
            raccordement: "Raccordement électrique",
            "extension-reseau": "Extension de réseau",
            maintenance: "Maintenance électrique",
            transformation: "Poste de transformation",
            eclairage: "Éclairage public",
        };

        const statusLabels = {
            "in-progress": "En cours",
            planned: "Planifié",
            completed: "Terminé",
        };

        // Préparer les données pour Excel
        const excelData = electrificationProjects.map((project) => ({
            Code: project.code,
            Intitulé: project.title,
            "Nature de la tâche": natureLabels[project.nature] || project.nature,
            Wilaya: project.daira,
            Commune: project.commune,
            Budget: project.budget,
            "Date commencement": formatDate(project.startDate),
            "Date fin": formatDate(project.endDate),
            Statut: statusLabels[project.status] || project.status,
            Entrepreneur: project.contractor || "",
            "Date réception demande": project.dateReceptionDemande ? formatDate(project.dateReceptionDemande) : "",
            "Date envoi Sonelgaz": project.dateEnvoiSonelgaz ? formatDate(project.dateEnvoiSonelgaz) : "",
            "Date accord Sonelgaz": project.dateAccordSonelgaz ? formatDate(project.dateAccordSonelgaz) : "",
            Description: project.description || "",
            Observations: project.observations ? project.observations.map(obs => `${formatDate(obs.date)}: ${obs.text}`).join('\n') : ""
        }));

        // Créer un nouveau workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, "Projets Électrification");

        // Sauvegarder le fichier
        XLSX.writeFile(wb, "projets_electrification_dsa_guelma.xlsx");
        showNotification("Fichier Excel généré avec succès !", "success");
    } catch (error) {
        console.error("Erreur lors de la génération du fichier Excel:", error);
        showNotification("Erreur lors de la génération du fichier Excel", "error");
    }
}

  function printProjects() {
    showNotification("Préparation de l'impression...", "info")

    const printWindow = window.open("", "_blank", "width=800,height=600")

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Projets d'Électrification DSA Guelma - Impression</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; color: #1565c0; }
          .print-date { text-align: right; margin-bottom: 20px; font-style: italic; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #444; padding: 8px; text-align: left; font-size: 10px; }
          th { background-color: #1565c0; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .status { padding: 3px 8px; border-radius: 12px; font-size: 10px; display: inline-block; }
          .status-in-progress { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #2e7d32; }
          .status-completed { background-color: #e3f2fd; color: #1565c0; border: 1px solid #1565c0; }
          .status-planned { background-color: #fff8e1; color: #f57f17; border: 1px solid #f57f17; }
        </style>
      </head>
      <body>
        <h1>Liste des Projets d'Électrification - DSA Guelma</h1>
        <div class="print-date">Date d'impression: ${new Date().toLocaleDateString("fr-FR")}</div>
        
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Intitulé</th>
              <th>Nature</th>
              <th>Wilaya/Commune</th>
              <th>Budget</th>
              <th>Période</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${electrificationProjects
              .map((project) => {
                const natureLabels = {
                  "installation-lignes": "Installation lignes",
                  raccordement: "Raccordement",
                  "extension-reseau": "Extension réseau",
                  maintenance: "Maintenance",
                  transformation: "Transformation",
                  eclairage: "Éclairage public",
                }

                const statusLabels = {
                  "in-progress": "En cours",
                  planned: "Planifié",
                  completed: "Terminé",
                }

                return `
                  <tr>
                    <td>${project.code}</td>
                    <td>${project.title}</td>
                    <td>${natureLabels[project.nature] || project.nature}</td>
                    <td>${project.daira}/${project.commune}</td>
                    <td>${formatCurrency(project.budget)}</td>
                    <td>${formatDate(project.startDate)} - ${formatDate(project.endDate)}</td>
                    <td>
                      <span class="status status-${project.status}">
                        ${statusLabels[project.status] || project.status}
                      </span>
                    </td>
                  </tr>
                  `
              })
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          Direction des Services Agricoles - Guelma
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
  }

  // Fonction pour afficher la carte Google Maps
  function showProjectsMap() {
    const mapModal = document.getElementById("map-modal")
    if (mapModal) {
      mapModal.classList.add("show")

      // Fermeture du modal
      mapModal.querySelector(".modal-close").addEventListener("click", () => {
        mapModal.classList.remove("show")
      })

      mapModal.querySelector(".modal-backdrop").addEventListener("click", () => {
        mapModal.classList.remove("show")
      })

      // Utiliser la fonction du map-manager.js
      if (window.showMap) {
        window.showMap()
      } else {
        // Charger Google Maps si ce n'est pas déjà fait
        if (!window.google || !window.google.maps) {
          window.loadGoogleMaps()
        } else {
          window.initMap()
        }
      }
    }
  }

  // Fonction pour gérer les observations
  function displayObservations(observations, container, showAll = false) {
    if (!observations || observations.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Aucune observation</p>'
      return
    }

    const observationsToShow = showAll ? observations : [observations[observations.length - 1]]

    container.innerHTML = observationsToShow
      .map(
        (obs) => `
      <div class="observation-item" style="background: var(--light-bg); padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="color: var(--primary);">Observation du ${formatDate(obs.date)}</strong>
        </div>
        <p style="margin: 0; line-height: 1.5;">${obs.text}</p>
      </div>
    `,
      )
      .join("")
  }

  function closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show")
    })
    currentEditingProject = null
  }

  function animateCounters() {
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        counter.textContent = Math.floor(current)
      }, 16)
    })
  }

  function updateStats() {
    const totalProjects = electrificationProjects.length
    const inProgressProjects = electrificationProjects.filter((p) => p.status === "in-progress").length
    const completedProjects = electrificationProjects.filter((p) => p.status === "completed").length
    const totalBudget = Math.round(electrificationProjects.reduce((sum, p) => sum + p.budget, 0) / 1000000)

    // Mettre à jour les statistiques
    const statValues = document.querySelectorAll(".stat-value")
    if (statValues[0]) statValues[0].textContent = totalProjects
    if (statValues[1]) statValues[1].textContent = inProgressProjects
    if (statValues[2]) statValues[2].textContent = completedProjects
    if (statValues[3]) statValues[3].textContent = totalBudget
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

    // Styles pour la notification
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface);
            border: 2px solid var(--${type === "success" ? "success" : type === "error" ? "error" : "info"});
            border-radius: var(--border-radius-sm);
            padding: 1rem;
            box-shadow: 0 8px 24px var(--shadow);
            z-index: 1100;
            transform: translateX(100%);
            opacity: 0;
            transition: var(--transition);
            max-width: 400px;
        `

    notification.querySelector(".notification-content").style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-primary);
        `

    notification.querySelector("i").style.cssText = `
            color: var(--${type === "success" ? "success" : type === "error" ? "error" : "info"});
            font-size: 1.2rem;
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
        document.body.removeChild(notification)
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

  function formatCurrency(amount) {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(dateString) {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  function updateCurrentDate() {
    const dateElement = document.getElementById("current-date")
    if (dateElement) {
      const now = new Date()
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      dateElement.textContent = now.toLocaleDateString("fr-FR", options)
    }
  }

  // Ajouter après la fonction init()
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

  function updateCurrentDateShort() {
    const dateElement = document.getElementById("current-date-short")
    if (dateElement) {
      const now = new Date()
      const dateString = now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      })
      dateElement.textContent = dateString
    }
  }

  function initCompactCalendar() {
    const calendarGrid = document.getElementById("calendar-grid-compact")
    const monthYearSpan = document.getElementById("calendar-month-year")
    const prevMonthBtn = document.getElementById("prev-month")
    const nextMonthBtn = document.getElementById("next-month")

    const currentDate = new Date()

    function generateCompactCalendar(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)

      // Ajuster pour commencer le dimanche
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      // Mettre à jour le titre
      monthYearSpan.textContent = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })

      // Vider la grille
      calendarGrid.innerHTML = ""

      // Générer 42 jours (6 semaines)
      for (let i = 0; i < 42; i++) {
        const cellDate = new Date(startDate)
        cellDate.setDate(startDate.getDate() + i)

        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day-compact"
        dayElement.textContent = cellDate.getDate()

        // Marquer les jours du mois précédent/suivant
        if (cellDate.getMonth() !== month) {
          dayElement.classList.add("other-month")
        }

        // Marquer le jour actuel
        if (cellDate.toDateString() === new Date().toDateString()) {
          dayElement.classList.add("today")
        }

        // Vérifier s'il y a des projets ce jour-là
        const hasProjects = electrificationProjects.some((project) => {
          const startDate = new Date(project.startDate)
          const endDate = new Date(project.endDate)
          return cellDate >= startDate && cellDate <= endDate
        })

        if (hasProjects) {
          dayElement.classList.add("has-projects")
          dayElement.title = "Projets actifs ce jour"
        }

        // Ajouter l'événement de clic
        dayElement.addEventListener("click", () => {
          // Retirer la sélection précédente
          document.querySelectorAll(".calendar-day-compact.selected").forEach((d) => d.classList.remove("selected"))

          // Ajouter la sélection au jour cliqué
          if (!dayElement.classList.contains("other-month")) {
            dayElement.classList.add("selected")
          }

          if (hasProjects) {
            console.log(`Projets actifs le ${cellDate.toLocaleDateString("fr-FR")}`)
            // Ici on pourrait filtrer les projets par date
          }
        })

        calendarGrid.appendChild(dayElement)
      }
    }

    // Event listeners pour la navigation
    prevMonthBtn?.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      generateCompactCalendar(currentDate)
    })

    nextMonthBtn?.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      generateCompactCalendar(currentDate)
    })

    // Générer le calendrier initial
    generateCompactCalendar(currentDate)
  }
  // Import de la librairie xlsx
  const XLSX = require("xlsx")
})
