document.addEventListener("DOMContentLoaded", () => {
   let projectsData = [];
  // Éléments du DOM
  const projectsTableBody = document.getElementById("projects-table-body")
  const searchInput = document.querySelector(".search-input")
  const typeFilter = document.getElementById("type-filter")
  const statusFilter = document.getElementById("status-filter")
  const exportBtn = document.getElementById("export-btn")
  const exportDropdown = document.getElementById("export-dropdown")
  const exportPdf = document.getElementById("export-pdf")
  const exportExcel = document.getElementById("export-excel")
  const addProjectBtn = document.getElementById("add-project-btn")
  const counters = document.querySelectorAll(".counter")
  const projectTypeModal = document.getElementById("project-type-modal")

  // Données combinées des projets (électrification + investissement)
  

  // Importation de XLSX
  const XLSX = window.XLSX

  // Initialisation
  init()

  function init() {
    fetchProjects()
    
    animateCounters()
    setupEventListeners()
    updateStats()
  }

  function setupEventListeners() {
    // Recherche
    searchInput?.addEventListener("input", filterProjects)

    // Filtres
    typeFilter?.addEventListener("change", filterProjects)
    statusFilter?.addEventListener("change", filterProjects)

    // Export
    exportBtn?.addEventListener("click", toggleExportMenu)
    document.addEventListener("click", closeExportMenu)

    // Export options
    exportPdf?.addEventListener("click", exportToPDF)
    exportExcel?.addEventListener("click", exportToExcel)

    // Impression
    const printBtn = document.getElementById("print-btn")
    printBtn?.addEventListener("click", printProjects)

    // Nouveau projet - Ouvrir le modal de sélection
    addProjectBtn?.addEventListener("click", openProjectTypeModal)

    // Sélection du type de projet
    document.querySelectorAll(".type-option").forEach((option) => {
      option.addEventListener("click", handleProjectTypeSelection)
    })

    // Fermeture des modals
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        closeModal()
      }
    })

    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", closeModal)
    })
  }

  function openProjectTypeModal() {
    projectTypeModal.classList.add("show")
  }

  function handleProjectTypeSelection(e) {
    const selectedType = e.currentTarget.getAttribute("data-type")
    closeModal()

    // Rediriger vers la page appropriée avec un paramètre
    if (selectedType === "investment") {
      // Rediriger vers la page d'investissement
      window.location.href = "investissement.html?action=new"
    } else if (selectedType === "electrification") {
      // Rediriger vers la page d'électrification
      window.location.href = "electrification.html?action=new"
    }
  }
  





 async function fetchProjects() {
    try {
      console.log("Tentative de chargement des projets...");
      const response = await fetch("../API/projects/lire.php", {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Réponse non-JSON reçue");
      }

      const result = await response.json();
      console.log("Données reçues :", result);

      if (!result.success) {
        throw new Error(result.message || "Erreur serveur");
      }

      projectsData = result.data || [];
      console.log(`${projectsData.length} projets chargés avec succès`);

      loadProjects();
      updateStats();

    } catch (error) {
      console.error("Échec du chargement des projets:", error);
      displayError(error.message);
    }
  }

 function displayError(message) {
    const container = document.getElementById("projects-container") || document.body;

    const errorHTML = `
      <div class="error-message">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="error-content">
          <h3>Erreur de chargement</h3>
          <p>${message}</p>
          <button onclick="window.location.reload()" class="btn-retry">
            <i class="fas fa-sync-alt"></i> Réessayer
          </button>
        </div>
      </div>
    `;

    container.innerHTML = errorHTML;

    const style = document.createElement('style');
    style.textContent = `
      .error-message {
        padding: 2rem;
        margin: 2rem auto;
        max-width: 600px;
        background: #fff8f8;
        border: 1px solid #ffdddd;
        border-radius: 8px;
        text-align: center;
      }
      .error-icon {
        color: #d32f2f;
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .btn-retry {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #d32f2f;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

// Ajoutez ceci à votre CSS
const style = document.createElement('style');
style.textContent = `
  .error-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #FFF8F8;
    border: 1px solid #FFDDDD;
    border-radius: 8px;
    max-width: 600px;
    margin: 2rem auto;
    color: #D32F2F;
  }
  
  .error-icon {
    font-size: 2.5rem;
  }
  
  .error-content h3 {
    margin: 0 0 0.5rem 0;
  }
  
  .reload-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #D32F2F;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
document.head.appendChild(style);






  
  function loadProjects() {
  console.log("Chargement des projets dans le tableau..."); // ← ajoute ça
  if (!projectsTableBody) return;

  projectsTableBody.innerHTML = "";

  projectsData.forEach((project, index) => {
    const row = createProjectRow(project);
    projectsTableBody.appendChild(row);

    setTimeout(() => {
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, index * 100);
  });

  addRowEventListeners();
}



  function createProjectRow(project) {
  const row = document.createElement("tr");
  row.style.opacity = "0";
  row.style.transform = "translateY(20px)";
  row.style.transition = "all 0.3s ease";

  const typeClass = project.type === "electrification" ? "electrification" : "investment";
  const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement";

  let statusClass = "";
  let statusLabel = "";

  switch (project.status) {
    case "in-progress":
      statusClass = "in-progress";
      statusLabel = "En cours";
      break;
    case "planned":
      statusClass = "planned";
      statusLabel = "Planifié";
      break;
    case "completed":
      statusClass = "completed";
      statusLabel = "Terminé";
      break;
    default:
      statusClass = "unknown";
      statusLabel = "—";
  }

  row.innerHTML = `
    <td>
      <div class="project-code">
        <strong>${project.code || "-"}</strong>
      </div>
    </td>
    <td>
      <span class="type-badge type-${typeClass}">${typeLabel}</span>
    </td>
    <td>
      <div class="project-title">
        <strong>${project.title || "-"}</strong>
        <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">
          ${project.contractor || "-"}
        </small>
      </div>
    </td>
    <td>${project.location || "-"}</td>
    <td><strong>${formatCurrency(project.budget || 0)}</strong></td>
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
        <button class="action-btn delete-btn" data-id="${project.id}" title="Supprimer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </td>
  `;

  return row;
 }


  function addRowEventListeners() {
    // Boutons de visualisation
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-id")
        showProjectDetails(projectId)
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
    const selectedType = typeFilter?.value || "all"
    const selectedStatus = statusFilter?.value || "all"

    const rows = document.querySelectorAll("#projects-table-body tr")

    rows.forEach((row) => {
      const title = row.querySelector(".project-title strong")?.textContent.toLowerCase() || ""
      const code = row.querySelector(".project-code strong")?.textContent.toLowerCase() || ""
      const type = row.querySelector(".type-badge")?.classList.contains("type-electrification")
        ? "electrification"
        : "investment"
      const status = getStatusFromBadge(row.querySelector(".status-badge"))

      const matchesSearch = title.includes(searchTerm) || code.includes(searchTerm)
      const matchesType = selectedType === "all" || type === selectedType
      const matchesStatus = selectedStatus === "all" || status === selectedStatus

      if (matchesSearch && matchesType && matchesStatus) {
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

  function showProjectDetails(projectId) {
    const project = projectsData.find((p) => p.id === projectId)
    if (!project) return

    const modal = document.getElementById("project-details-modal")
    const content = modal?.querySelector(".project-details-content")

    if (!content) return

    content.innerHTML = `
            <div class="project-detail-header" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
                <h4 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 0.5rem;">${project.title}</h4>
                <span style="font-family: monospace; background: var(--warm-beige); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9rem;">${project.code}</span>
            </div>
            <div class="project-detail-body">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="padding: 1rem; background: var(--warm-beige); border-radius: 8px;">
                        <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Type</label>
                        <span style="display: block; margin-top: 0.25rem; color: var(--primary); font-weight: 500;">${project.type === "electrification" ? "Électrification" : "Investissement"}</span>
                    </div>
                    <div style="padding: 1rem; background: var(--warm-beige); border-radius: 8px;">
                        <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Localisation</label>
                        <span style="display: block; margin-top: 0.25rem; color: var(--primary); font-weight: 500;">${project.location}</span>
                    </div>
                    <div style="padding: 1rem; background: var(--warm-beige); border-radius: 8px;">
                        <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Budget</label>
                        <span style="display: block; margin-top: 0.25rem; color: var(--primary); font-weight: 500;">${formatCurrency(project.budget)}</span>
                    </div>
                    <div style="padding: 1rem; background: var(--warm-beige); border-radius: 8px;">
                        <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Entrepreneur</label>
                        <span style="display: block; margin-top: 0.25rem; color: var(--primary); font-weight: 500;">${project.contractor}</span>
                    </div>
                    <div style="padding: 1rem; background: var(--warm-beige); border-radius: 8px;">
                        <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Période</label>
                        <span style="display: block; margin-top: 0.25rem; color: var(--primary); font-weight: 500;">${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
                    </div>
                </div>
                <div style="background: var(--cream-beige); padding: 1.5rem; border-radius: 12px;">
                    <label style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; display: block;">Description</label>
                    <p style="color: var(--text-primary); line-height: 1.6;">${project.description}</p>
                </div>
            </div>
        `

    modal?.classList.add("show")
  }

  function deleteProject(projectId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      const index = projectsData.findIndex((p) => p.id === projectId)
      if (index > -1) {
        projectsData.splice(index, 1)
        loadProjects()
        updateStats()
        showNotification("Projet supprimé avec succès", "success")
      }
    }
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

    // Utiliser jsPDF pour créer le PDF
    setTimeout(() => {
      try {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        // Configuration
        doc.setFontSize(16)
        doc.text("Rapport des Projets - DSA Guelma", 20, 20)

        doc.setFontSize(10)
        doc.text(`Date de génération: ${new Date().toLocaleDateString("fr-FR")}`, 20, 30)

        // En-têtes du tableau
        const headers = ["Code", "Type", "Intitulé", "Localisation", "Budget", "Statut"]
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
        projectsData.forEach((project) => {
          const row = [
            project.code,
            project.type === "electrification" ? "Élec." : "Inv.",
            project.title.substring(0, 20) + "...",
            project.location,
            formatCurrency(project.budget),
            project.status === "in-progress" ? "En cours" : project.status === "completed" ? "Terminé" : "Planifié",
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
        doc.save("projets_dsa_guelma.pdf")
        showNotification("PDF généré avec succès !", "success")
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error)
        showNotification("Erreur lors de la génération du PDF", "error")
      }
    }, 1000)
  }

  function exportToExcel() {
    exportDropdown?.classList.remove("show")
    showNotification("Génération du fichier Excel en cours...", "info")

    setTimeout(() => {
      try {
        // Préparer les données pour Excel
        const excelData = projectsData.map((project) => ({
          Code: project.code,
          Type: project.type === "electrification" ? "Électrification" : "Investissement",
          Intitulé: project.title,
          Localisation: project.location,
          Budget: project.budget,
          "Date début": formatDate(project.startDate),
          "Date fin": formatDate(project.endDate),
          Statut:
            project.status === "in-progress" ? "En cours" : project.status === "completed" ? "Terminé" : "Planifié",
          Entrepreneur: project.contractor,
          Description: project.description,
        }))

        // Créer un nouveau workbook
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(excelData)

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, "Projets")

        // Sauvegarder le fichier
        XLSX.writeFile(wb, "projets_dsa_guelma.xlsx")
        showNotification("Fichier Excel généré avec succès !", "success")
      } catch (error) {
        console.error("Erreur lors de la génération du fichier Excel:", error)
        showNotification("Erreur lors de la génération du fichier Excel", "error")
      }
    }, 1000)
  }

  function printProjects() {
    showNotification("Préparation de l'impression...", "info")

    // Créer une fenêtre d'impression
    const printWindow = window.open("", "_blank", "width=800,height=600")

    // Contenu à imprimer
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Projets DSA Guelma - Impression</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; color: #2d4f4f; }
          .print-date { text-align: right; margin-bottom: 20px; font-style: italic; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #444; padding: 8px; text-align: left; }
          th { background-color: #3a6363; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .status { padding: 3px 8px; border-radius: 12px; font-size: 12px; display: inline-block; }
          .status-in-progress { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #2e7d32; }
          .status-completed { background-color: #e3f2fd; color: #1565c0; border: 1px solid #1565c0; }
          .status-planned { background-color: #fff8e1; color: #f57f17; border: 1px solid #f57f17; }
        </style>
      </head>
      <body>
        <h1>Liste des Projets - DSA Guelma</h1>
        <div class="print-date">Date d'impression: ${new Date().toLocaleDateString("fr-FR")}</div>
        
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Intitulé</th>
              <th>Localisation</th>
              <th>Budget</th>
              <th>Période</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${projectsData
              .map(
                (project) => `
              <tr>
                <td>${project.code}</td>
                <td>${project.type === "electrification" ? "Électrification" : "Investissement"}</td>
                <td>${project.title}</td>
                <td>${project.location}</td>
                <td>${formatCurrency(project.budget)}</td>
                <td>${formatDate(project.startDate)} - ${formatDate(project.endDate)}</td>
                <td>
                  <span class="status status-${project.status}">
                    ${project.status === "in-progress" ? "En cours" : project.status === "completed" ? "Terminé" : "Planifié"}
                  </span>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          Direction des Services Agricoles - Guelma
        </div>
      </body>
      </html>
    `

    // Écrire le contenu dans la fenêtre d'impression
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Attendre que le contenu soit chargé
    printWindow.onload = () => {
      // Imprimer
      setTimeout(() => {
        printWindow.print()
        printWindow.onafterprint = () => {
          printWindow.close()
        }
        showNotification("Impression lancée avec succès", "success")
      }, 500)
    }
  }

  function closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show")
    })
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
    const visibleProjects = document.querySelectorAll("#projects-table-body tr:not([style*='display: none'])")
    const electrificationProjects = projectsData.filter((p) => p.type === "electrification").length
    const investmentProjects = projectsData.filter((p) => p.type === "investment").length
    const completedProjects = projectsData.filter((p) => p.status === "completed").length

    // Mettre à jour les statistiques
    const statValues = document.querySelectorAll(".stat-value")
    if (statValues[0]) statValues[0].textContent = projectsData.length
    if (statValues[1]) statValues[1].textContent = electrificationProjects
    if (statValues[2]) statValues[2].textContent = investmentProjects
    if (statValues[3]) statValues[3].textContent = completedProjects
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
    return new Date(dateString).toLocaleDateString("fr-FR")
  }
})
