document.addEventListener("DOMContentLoaded", () => {
  const archivedProjectsBody = document.getElementById("archived-projects-body")
  const searchInput = document.querySelector(".search-input")
  const typeFilter = document.getElementById("type-filter")
  let archivedProjects = []

  // Load user info
  const SessionManager = window.SessionManager // Declare the SessionManager variable
  const user = SessionManager.getUser()
  if (user) {
    document.getElementById("username-display").textContent = user.username || "Admin DSA"
    document.getElementById("email-display").textContent = user.email || "admin@dsa-agriculture.dz"
  }

  // Load archived projects
  loadArchivedProjects()

  async function loadArchivedProjects() {
    try {
      const response = await fetch("../api/projects/get-archived.php")
      const data = await response.json()

      if (data.success) {
        archivedProjects = data.data || []
        displayArchivedProjects(archivedProjects)
        updateArchivedCount()
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  function displayArchivedProjects(projects) {
    archivedProjectsBody.innerHTML = ""

    projects.forEach((project, index) => {
      const row = document.createElement("tr")
      row.style.opacity = "0"
      row.style.transform = "translateY(20px)"
      row.style.transition = "all 0.3s ease"

      const typeLabel = project.type === "electrification" ? "Électrification" : "Investissement"

      row.innerHTML = `
        <td><strong>${project.code || "-"}</strong></td>
        <td><span class="type-badge type-${project.type}">${typeLabel}</span></td>
        <td><strong>${project.title || "-"}</strong></td>
        <td>${project.location || "-"}</td>
        <td><strong>${formatCurrency(project.budget || 0)}</strong></td>
        <td>${formatDate(project.archived_at)}</td>
        <td>
          <div class="actions-cell">
            <button class="action-btn restore-btn" data-id="${project.id}" title="Restaurer">
              <i class="fas fa-undo"></i>
            </button>
          </div>
        </td>
      `

      archivedProjectsBody.appendChild(row)

      setTimeout(() => {
        row.style.opacity = "1"
        row.style.transform = "translateY(0)"
      }, index * 100)
    })

    addRestoreListeners()
  }

  function addRestoreListeners() {
    document.querySelectorAll(".restore-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = e.currentTarget.getAttribute("data-id")
        restoreProject(projectId)
      })
    })
  }

  async function restoreProject(projectId) {
    if (confirm("Êtes-vous sûr de vouloir restaurer ce projet ?")) {
      try {
        const response = await fetch("../api/projects/restore.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id: projectId, status: "planned" }),
        })

        const data = await response.json()
        if (data.success) {
          showNotification("Projet restauré avec succès", "success")
          loadArchivedProjects()
        } else {
          showNotification("Erreur lors de la restauration", "error")
        }
      } catch (error) {
        console.error("Erreur:", error)
        showNotification("Erreur réseau", "error")
      }
    }
  }

  function updateArchivedCount() {
    document.querySelector(".users-count").textContent = archivedProjects.length
  }

  searchInput?.addEventListener("input", filterProjects)
  typeFilter?.addEventListener("change", filterProjects)

  function filterProjects() {
    const searchTerm = searchInput?.value.toLowerCase() || ""
    const selectedType = typeFilter?.value || "all"

    const rows = document.querySelectorAll("#archived-projects-body tr")

    rows.forEach((row) => {
      const title = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || ""
      const code = row.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || ""
      const type = row.querySelector(".type-badge")?.textContent.toLowerCase() || ""

      const matchesSearch = title.includes(searchTerm) || code.includes(searchTerm)
      const matchesType = selectedType === "all" || type.includes(selectedType)

      row.style.display = matchesSearch && matchesType ? "" : "none"
    })
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1100;
      animation: slideIn 0.3s ease;
    `
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
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
