document.addEventListener("DOMContentLoaded", () => {
  // Référence aux éléments du formulaire et des vues
  const form = document.getElementById("project-form")
  const fileInput = document.getElementById("fichier_justificatif")
  const fileName = document.querySelector(".file-name")
  const cancelBtn = document.getElementById("cancel-project")
  const addProjectBtn = document.getElementById("add-project-btn")
  const listView = document.getElementById("list-view")
  const formView = document.getElementById("form-view")
  const exportBtn = document.getElementById("export-btn")
  const exportOptions = document.getElementById("export-options")
  const exportExcel = document.getElementById("export-excel")
  const exportPdf = document.getElementById("export-pdf")
  const exportCsv = document.getElementById("export-csv")
  const printBtn = document.getElementById("print-btn")
  const mapBtn = document.getElementById("map-btn")
  const mapModal = document.getElementById("map-modal")
  const mapClose = document.getElementById("map-close")
  const searchInput = document.querySelector(".search-input")
  const paginationItems = document.querySelectorAll(".pagination .page-item")
  const statCards = document.querySelectorAll(".stat-card")
  const projectDetailsModal = document.getElementById("project-details-modal")
  const modalClose = document.querySelector(".modal-close")
  const projectDetailsContent = document.querySelector(".project-details-content")
  const projectsTable = document.querySelector(".projects-table tbody")
  const printSection = document.getElementById("print-section")

  // Variable pour suivre si nous sommes en mode édition ou ajout
  let editMode = false
  let currentEditRow = null

  // Animation des compteurs dans les cartes statistiques
  const counters = document.querySelectorAll(".counter")

  counters.forEach((counter) => {
    animateCounter(counter)
  })

  function animateCounter(counter) {
    const target = +counter.getAttribute("data-target")
    const count = +counter.innerText
    const increment = target / 20

    if (count < target) {
      counter.innerText = Math.ceil(count + increment)
      setTimeout(() => {
        animateCounter(counter)
      }, 50)
    } else {
      counter.innerText = target
    }
  }

  // Gestionnaire pour le bouton "Nouveau Projet"
  addProjectBtn.addEventListener("click", () => {
    // Réinitialiser le mode d'édition
    editMode = false
    currentEditRow = null

    listView.classList.remove("active")
    formView.classList.add("active")
    generateProjectCode()
    // Réinitialiser le formulaire pour un nouveau projet
    form.reset()
    fileName.textContent = "Aucun fichier choisi"
    document.querySelector(".form-header h2").innerHTML =
      '<i class="fas fa-bolt"></i> Nouveau Projet d\'Électrification'
  })

  // Gestionnaire pour le bouton d'annulation
  cancelBtn.addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues.")) {
      form.reset()
      fileName.textContent = "Aucun fichier choisi"
      listView.classList.add("active")
      formView.classList.remove("active")

      // Réinitialiser le mode d'édition
      editMode = false
      currentEditRow = null
    }
  })

  // Gestionnaire pour le bouton d'exportation
  exportBtn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    exportOptions.classList.toggle("show")
  })

  // Fermer les options d'exportation si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".btn-export-container") && exportOptions.classList.contains("show")) {
      exportOptions.classList.remove("show")
    }
  })

  // Fonction pour convertir les données du tableau en format CSV
  function tableToCSV() {
    const csv = []
    const rows = document.querySelectorAll(".projects-table tr")

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const cols = row.querySelectorAll("td, th")
      const rowData = []

      for (let j = 0; j < cols.length; j++) {
        // Ne pas inclure la colonne des actions
        if (i === 0 || j < cols.length - 1) {
          // Pour les cellules avec des badges de statut
          if (cols[j].querySelector(".status-badge")) {
            rowData.push(cols[j].querySelector(".status-badge").textContent)
          } else {
            // Échapper les guillemets et ajouter des guillemets autour du texte
            let cellText = cols[j].textContent.trim()
            cellText = cellText.replace(/"/g, '""')
            rowData.push(`"${cellText}"`)
          }
        }
      }

      csv.push(rowData.join(","))
    }

    return csv.join("\n")
  }

  // Fonction pour créer un fichier Excel/CSV
  function createExcelFile() {
    // Créer l'en-tête BOM pour UTF-8
    const BOM = "\uFEFF"
    const csvContent = BOM + tableToCSV()

    // Créer un Blob avec les données CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    return blob
  }

  // Gestionnaire pour l'exportation Excel
  exportExcel.addEventListener("click", () => {
    exportOptions.classList.remove("show")
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
                    <x:Name>Projets d'Électrification</x:Name>
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
        `

        // Ajouter les en-têtes
        document.querySelectorAll(".projects-table th").forEach((th) => {
          if (th.textContent !== "Actions") {
            excelContent += `<th>${th.textContent}</th>`
          }
        })

        excelContent += `
                </tr>
              </thead>
              <tbody>
        `

        // Ajouter les données des lignes
        document.querySelectorAll(".projects-table tbody tr").forEach((tr) => {
          excelContent += "<tr>"
          tr.querySelectorAll("td").forEach((td, index) => {
            // Ne pas inclure la colonne des actions
            if (index < tr.querySelectorAll("td").length - 1) {
              // Pour les cellules avec des badges de statut
              if (td.querySelector(".status-badge")) {
                excelContent += `<td>${td.querySelector(".status-badge").textContent}</td>`
              } else {
                excelContent += `<td>${td.textContent}</td>`
              }
            }
          })
          excelContent += "</tr>"
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
        link.download = "projets_electrification.xls" // Extension .xls au lieu de .xlsx

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
  })

  // Fonction pour générer un PDF à partir du contenu HTML
  function generatePDF(htmlContent) {
    // Créer un iframe invisible pour l'impression
    const printFrame = document.createElement("iframe")
    printFrame.name = "print-frame"
    printFrame.style.position = "absolute"
    printFrame.style.top = "-1000px"
    printFrame.style.left = "-1000px"
    document.body.appendChild(printFrame)

    // Écrire le contenu dans l'iframe
    printFrame.contentDocument.write(htmlContent)
    printFrame.contentDocument.close()

    // Attendre que le contenu soit chargé
    return new Promise((resolve) => {
      printFrame.onload = () => {
        // Simuler le téléchargement d'un PDF
        const pdfBlob = new Blob([htmlContent], { type: "application/pdf" })
        const url = URL.createObjectURL(pdfBlob)

        const link = document.createElement("a")
        link.href = url
        link.download = "projets_electrification.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Libérer l'URL
        URL.revokeObjectURL(url)

        // Supprimer l'iframe
        document.body.removeChild(printFrame)

        resolve()
      }
    })
  }

  // Gestionnaire pour l'exportation PDF
  exportPdf.addEventListener("click", () => {
    exportOptions.classList.remove("show")
    showNotification("Exportation en PDF en cours...")

    // Simuler un délai de traitement
    setTimeout(async () => {
      try {
        // Préparer le contenu pour l'impression PDF
        const printContent = preparePrintContent()

        // Générer le PDF
        await generatePDF(printContent)

        showNotification("Exportation en PDF terminée avec succès !")
      } catch (error) {
        console.error("Erreur lors de l'exportation:", error)
        showNotification("Erreur lors de l'exportation. Veuillez réessayer.")
      }
    }, 1500)
  })

  // Gestionnaire pour l'exportation CSV
  exportCsv.addEventListener("click", () => {
    exportOptions.classList.remove("show")
    showNotification("Exportation en CSV en cours...")

    // Simuler un délai de traitement
    setTimeout(() => {
      try {
        // Créer le fichier CSV
        const blob = createExcelFile()

        // Créer un URL pour le blob
        const url = window.URL.createObjectURL(blob)

        // Créer un élément <a> pour le téléchargement
        const link = document.createElement("a")
        link.href = url
        link.download = "projets_electrification.csv"

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
  })

  // Fonction pour préparer le contenu à imprimer
  function preparePrintContent() {
    const title = document.querySelector(".page-title h2").textContent
    const date = new Date().toLocaleDateString()

    // Cloner le tableau
    const tableClone = document.querySelector(".projects-table").cloneNode(true)

    // Supprimer la colonne des actions
    const rows = tableClone.querySelectorAll("tr")
    rows.forEach((row) => {
      const lastCell = row.lastElementChild
      if (lastCell && (lastCell.classList.contains("actions-cell") || lastCell.textContent.trim() === "Actions")) {
        row.removeChild(lastCell)
      }
    })

    // Créer le contenu HTML pour l'impression
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Projets d'Électrification - ${date}</title>
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
          .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 12px; }
          .status-active { background-color: #28a745; color: white; }
          .status-pending { background-color: #fd7e14; color: white; }
          .status-completed { background-color: #2d4f4f; color: white; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Direction des Services Agricoles - Guelma</h1>
          <h2>${title}</h2>
          <p>Date d'impression: ${date}</p>
        </div>
        ${tableClone.outerHTML}
        <div class="print-footer">
          <p>&copy; 2024 Direction des Services Agricoles - Guelma. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `
  }

  // Gestionnaire pour le bouton d'impression
  printBtn.addEventListener("click", () => {
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
          }, 1000)
        } catch (error) {
          console.error("Erreur lors de l'impression:", error)
          showNotification("Erreur lors de l'impression. Veuillez réessayer.")
        }
      }, 500)
    }
  })

  // Gestionnaire pour le bouton de carte - Utiliser le nouveau gestionnaire de carte
  mapBtn.addEventListener("click", () => {
    showNotification("Chargement de la carte...")

    // Utiliser la fonction showMap du fichier map-manager.js
    if (window.showMap) {
      window.showMap()
    } else {
      console.error("La fonction showMap n'est pas disponible")
      showNotification("Erreur lors du chargement de la carte. Veuillez réessayer.")
    }
  })

  // Fermer la modal de carte
  mapClose.addEventListener("click", () => {
    mapModal.classList.remove("show")
  })

  // Fermer la modal de carte en cliquant en dehors
  mapModal.addEventListener("click", (e) => {
    if (e.target === mapModal) {
      mapModal.classList.remove("show")
    }
  })

  // Gestionnaire pour la recherche
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const tableRows = document.querySelectorAll(".projects-table tbody tr")

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      if (text.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })

    // Mettre à jour les statistiques en fonction des résultats de recherche
    updateStats()
  })

  // Générer un code de projet automatique
  function generateProjectCode() {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const randomNum = Math.floor(Math.random() * 900) + 100

    const code = `ELEC-${year}-${month}-${randomNum}`
    document.getElementById("code_projet").value = code
  }

  // Gestionnaire pour l'affichage du nom de fichier
  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileName.textContent = this.files[0].name
      fileName.style.color = "var(--dark-teal)"
    } else {
      fileName.textContent = "Aucun fichier choisi"
      fileName.style.color = "var(--text-dark)"
    }
  })

  // Gestionnaire pour la soumission du formulaire
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validation du formulaire
    if (validateForm()) {
      // Récupération des données du formulaire
      const formData = new FormData(form)

      // Conversion en objet pour faciliter la manipulation
      const projectData = {}
      formData.forEach((value, key) => {
        projectData[key] = value
      })

      // Simulation d'envoi à la base de données
      saveProject(projectData)
    }
  })

  // Fonction de validation du formulaire
  function validateForm() {
    let isValid = true
    const requiredFields = form.querySelectorAll("[required]")

    // Réinitialiser les styles d'erreur
    form.querySelectorAll(".error-message").forEach((el) => el.remove())
    form.querySelectorAll(".error-input").forEach((el) => el.classList.remove("error-input"))

    // Vérifier chaque champ requis
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false
        field.classList.add("error-input")

        // Créer un message d'erreur
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "Ce champ est obligatoire"
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "0.8rem"
        errorMsg.style.marginTop = "5px"

        // Insérer après le champ
        field.parentNode.insertBefore(errorMsg, field.nextSibling)
      }
    })

    return isValid
  }

  // Fonction pour formater une date au format DD/MM/YYYY
  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Fonction pour sauvegarder le projet
  function saveProject(projectData) {
    // Simulation d'une requête AJAX
    console.log("Données du projet à envoyer:", projectData)

    // Afficher un indicateur de chargement
    const submitBtn = form.querySelector(".btn-submit")
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...'
    submitBtn.disabled = true

    // Simuler un délai réseau
    setTimeout(() => {
      // Afficher une notification de succès
      showNotification(`Projet "${projectData.intitule}" enregistré avec succès !`)

      // Si nous sommes en mode édition, mettre à jour la ligne existante
      if (editMode && currentEditRow) {
        updateTableRow(currentEditRow, projectData)
      } else {
        // Sinon, ajouter une nouvelle ligne au tableau
        addTableRow(projectData)
      }

      // Réinitialiser le formulaire
      form.reset()
      fileName.textContent = "Aucun fichier choisi"

      // Restaurer le bouton
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      // Revenir à la liste des projets
      listView.classList.add("active")
      formView.classList.remove("active")

      // Réinitialiser le mode d'édition
      editMode = false
      currentEditRow = null

      // Mettre à jour les statistiques
      updateStats()
    }, 1500)
  }

  // Fonction pour ajouter une nouvelle ligne au tableau
  function addTableRow(projectData) {
    // Créer une nouvelle ligne
    const newRow = document.createElement("tr")
    newRow.className = "table-row-animate"

    // Déterminer le statut en fonction des dates
    const today = new Date()
    const startDate = new Date(projectData.date_debut)
    const endDate = new Date(projectData.date_prevue_fin)

    let status = ""
    let statusClass = ""

    if (today < startDate) {
      status = "En attente"
      statusClass = "status-pending"
    } else if (today > endDate) {
      status = "Terminé"
      statusClass = "status-completed"
    } else {
      status = "En cours"
      statusClass = "status-active"
    }

    // Formater les dates pour l'affichage
    const formattedStartDate = formatDate(projectData.date_debut)
    const formattedEndDate = formatDate(projectData.date_prevue_fin)

    // Remplir la ligne avec les données du projet
    newRow.innerHTML = `
      <td>${projectData.code_projet}</td>
      <td>${projectData.intitule}</td>
      <td>${projectData.localisation}</td>
      <td>${projectData.type_installation}</td>
      <td>${formattedStartDate}</td>
      <td>${formattedEndDate}</td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      <td class="actions-cell">
        <button class="action-btn" title="Modifier">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" title="Détails">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn" title="Supprimer">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `

    // Ajouter la ligne au tableau
    projectsTable.prepend(newRow)

    // Ajouter les gestionnaires d'événements aux boutons d'action
    const actionButtons = newRow.querySelectorAll(".action-btn")
    actionButtons.forEach((btn) => {
      btn.addEventListener("click", handleActionButtonClick)
    })

    // Ajouter une animation pour mettre en évidence la nouvelle ligne
    newRow.style.backgroundColor = "rgba(212, 175, 55, 0.2)"
    setTimeout(() => {
      newRow.style.backgroundColor = ""
    }, 3000)
  }

  // Fonction pour mettre à jour une ligne existante dans le tableau
  function updateTableRow(row, projectData) {
    // Déterminer le statut en fonction des dates
    const today = new Date()
    const startDate = new Date(projectData.date_debut)
    const endDate = new Date(projectData.date_prevue_fin)

    let status = ""
    let statusClass = ""

    if (today < startDate) {
      status = "En attente"
      statusClass = "status-pending"
    } else if (today > endDate) {
      status = "Terminé"
      statusClass = "status-completed"
    } else {
      status = "En cours"
      statusClass = "status-active"
    }

    // Formater les dates pour l'affichage
    const formattedStartDate = formatDate(projectData.date_debut)
    const formattedEndDate = formatDate(projectData.date_prevue_fin)

    // Mettre à jour les cellules de la ligne
    row.cells[0].textContent = projectData.code_projet
    row.cells[1].textContent = projectData.intitule
    row.cells[2].textContent = projectData.localisation
    row.cells[3].textContent = projectData.type_installation
    row.cells[4].textContent = formattedStartDate
    row.cells[5].textContent = formattedEndDate
    row.cells[6].innerHTML = `<span class="status-badge ${statusClass}">${status}</span>`

    // Ajouter une animation pour mettre en évidence la ligne mise à jour
    row.style.backgroundColor = "rgba(92, 141, 141, 0.2)"
    setTimeout(() => {
      row.style.backgroundColor = ""
    }, 3000)
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

  // Fonction pour gérer les clics sur les boutons d'action
  function handleActionButtonClick(e) {
    e.stopPropagation()
    const action = this.getAttribute("title")
    const row = this.closest("tr")
    const projectTitle = row.querySelector("td:nth-child(2)").textContent

    if (action === "Modifier") {
      // Définir le mode d'édition et stocker la référence à la ligne
      editMode = true
      currentEditRow = row

      // Simuler l'édition d'un projet existant
      listView.classList.remove("active")
      formView.classList.add("active")
      document.querySelector(".form-header h2").innerHTML = '<i class="fas fa-edit"></i> Modifier le Projet'
      document.getElementById("intitule").value = projectTitle
      document.getElementById("code_projet").value = row.querySelector("td:nth-child(1)").textContent
      document.getElementById("localisation").value = row.querySelector("td:nth-child(3)").textContent
      document.getElementById("type_installation").value = row.querySelector("td:nth-child(4)").textContent

      // Simuler des dates
      const dateDebut = row.querySelector("td:nth-child(5)").textContent
      const dateFin = row.querySelector("td:nth-child(6)").textContent

      // Convertir les dates au format YYYY-MM-DD pour l'input date
      const dateDebutParts = dateDebut.split("/")
      const dateFinParts = dateFin.split("/")

      if (dateDebutParts.length === 3) {
        document.getElementById("date_debut").value = `${dateDebutParts[2]}-${dateDebutParts[1]}-${dateDebutParts[0]}`
      }

      if (dateFinParts.length === 3) {
        document.getElementById("date_prevue_fin").value = `${dateFinParts[2]}-${dateFinParts[1]}-${dateFinParts[0]}`
      }
    } else if (action === "Supprimer") {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectTitle}" ?`)) {
        // Simuler la suppression
        row.style.opacity = "0"
        setTimeout(() => {
          row.remove()
          showNotification(`Projet "${projectTitle}" supprimé avec succès !`)
          updateStats()
        }, 300)
      }
    } else if (action === "Détails") {
      showProjectDetails(row)
    }
  }

  // Ajouter les gestionnaires d'événements aux boutons d'action existants
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.removeEventListener("click", handleActionButtonClick) // Supprimer les anciens gestionnaires
    btn.addEventListener("click", handleActionButtonClick)
  })

  // Fonction pour afficher les détails du projet dans une modal
  function showProjectDetails(row) {
    const projectCode = row.querySelector("td:nth-child(1)").textContent
    const projectTitle = row.querySelector("td:nth-child(2)").textContent
    const location = row.querySelector("td:nth-child(3)").textContent
    const type = row.querySelector("td:nth-child(4)").textContent
    const startDate = row.querySelector("td:nth-child(5)").textContent
    const endDate = row.querySelector("td:nth-child(6)").textContent
    const status = row.querySelector("td:nth-child(7) .status-badge").textContent

    // Remplir le contenu de la modal
    projectDetailsContent.innerHTML = `
      <div class="project-detail-card">
        <div class="detail-header">
          <h4>${projectTitle}</h4>
          <span class="detail-code">${projectCode}</span>
        </div>
        <div class="detail-body">
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Localisation:</span>
            <span class="detail-value">${location}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-bolt"></i> Type d'installation:</span>
            <span class="detail-value">${type}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-calendar-alt"></i> Période:</span>
            <span class="detail-value">Du ${startDate} au ${endDate}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-info-circle"></i> Statut:</span>
            <span class="detail-value status-text">${status}</span>
          </div>
        </div>
      </div>
    `

    // Ajouter une classe de couleur au statut
    const statusText = projectDetailsContent.querySelector(".status-text")
    if (status.includes("En cours")) {
      statusText.classList.add("status-active-text")
    } else if (status.includes("En attente")) {
      statusText.classList.add("status-pending-text")
    } else if (status.includes("Terminé")) {
      statusText.classList.add("status-completed-text")
    }

    // Afficher la modal
    projectDetailsModal.classList.add("show")
  }

  // Fermer la modal
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      projectDetailsModal.classList.remove("show")
    })
  }

  // Fermer la modal en cliquant en dehors du contenu
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

  // Animation des cartes statistiques
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = ""
    })
  })

  // Fonction pour mettre à jour les statistiques
  function updateStats() {
    const visibleProjects = document.querySelectorAll(".projects-table tbody tr:not([style*='display: none'])")
    const completedProjects = document.querySelectorAll(
      ".projects-table tbody tr:not([style*='display: none']) .status-completed",
    ).length
    const activeProjects = document.querySelectorAll(
      ".projects-table tbody tr:not([style*='display: none']) .status-active",
    ).length

    // Mettre à jour les statistiques
    document.querySelector(".stats-cards .stat-card:nth-child(1) .stat-value").textContent = visibleProjects.length
    document.querySelector(".stats-cards .stat-card:nth-child(3) .stat-value").textContent = completedProjects
    document.querySelector(".stats-cards .stat-card:nth-child(4) .stat-value").textContent = activeProjects
  }

  // Initialiser les statistiques au chargement
  updateStats()
})
