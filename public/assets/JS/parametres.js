document.addEventListener("DOMContentLoaded", () => {
  // Données utilisateurs simulées
  let users = [
    {
      id: 1,
      name: "Admin Système",
      email: "admin@electrification.dz",
      role: "admin",
      status: "active",
      lastLogin: "2023-05-15",
    },
    {
      id: 2,
      name: "Mohamed Ali",
      email: "m.ali@electrification.dz",
      role: "manager",
      status: "active",
      lastLogin: "2023-05-14",
    },
    {
      id: 3,
      name: "Karim Bensaid",
      email: "k.bensaid@electrification.dz",
      role: "technician",
      status: "active",
      lastLogin: "2023-05-10",
    },
    {
      id: 4,
      name: "Fatima Zohra",
      email: "f.zohra@electrification.dz",
      role: "viewer",
      status: "inactive",
      lastLogin: "2023-04-28",
    },
  ]

  // Textes traduits
  const translations = {
    fr: {
      addUser: "Ajouter utilisateur",
      editUser: "Modifier un utilisateur",
      password: "Mot de passe",
      newPassword: "Nouveau mot de passe (laisser vide pour ne pas changer)",
      update: "Mettre à jour",
      cancel: "Annuler",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      userUpdated: "Utilisateur mis à jour avec succès",
      userAdded: "Utilisateur ajouté avec succès",
      userDeleted: "Utilisateur supprimé avec succès",
      settingsSaved: "Paramètres enregistrés avec succès",
      settingsReset: "Paramètres réinitialisés avec succès",
      confirmReset: "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
      roles: {
        admin: "Administrateur",
        manager: "Chef de projet",
        technician: "Technicien",
        viewer: "Observateur",
      },
      status: {
        active: "Actif",
        inactive: "Inactif",
      },
      enabled: "Activé",
      disabled: "Désactivé",
      currency: {
        DZD: "DA",
        EUR: "€",
        USD: "$",
      },
      systemSettings: "Paramètres du système",
      configureSettings: "Configurez les paramètres de l'application selon vos besoins",
      generalSettings: "Paramètres généraux",
      userManagement: "Gestion des utilisateurs",
      notifications: "Notifications",
      security: "Sécurité",
      backupRestore: "Sauvegarde et restauration",
      displaySettings: "Paramètres d'affichage",
      notificationSettings: "Paramètres de notification",
      securitySettings: "Paramètres de sécurité",
      languageRegion: "Langue et région",
      appearance: "Apparence",
      dataFormat: "Format des données",
      appLanguage: "Langue de l'application",
      region: "Région",
      theme: "Thème",
      offlineMode: "Mode hors ligne",
      currency: "Devise",
      saveSettings: "Enregistrer les paramètres",
      reset: "Réinitialiser",
      french: "Français",
      arabic: "العربية (Arabe)",
      english: "English (Anglais)",
      light: "Clair",
      dark: "Sombre",
    },
    en: {
      // Traductions en anglais...
    },
    ar: {
      // Traductions en arabe...
    },
  }

  // État de l'application
  let editingUserId = null
  let appSettings = {
    language: "fr",
    theme: "light",
    offlineMode: false,
    region: "24",
    currency: "DZD",
  }

  // Charger les paramètres sauvegardés
  loadSettings()

  // Charger la liste des utilisateurs
  loadUsers()

  // Navigation entre les sections
  const menuItems = document.querySelectorAll(".settings-menu li")

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Retirer la classe active de tous les éléments
      menuItems.forEach((i) => i.classList.remove("active"))
      document.querySelectorAll(".settings-section").forEach((s) => s.classList.remove("active"))

      // Ajouter la classe active à l'élément cliqué
      this.classList.add("active")
      const target = this.getAttribute("data-target")
      document.getElementById(target).classList.add("active")
    })
  })

  // Gestion du formulaire utilisateur
  const userForm = document.getElementById("add-user-form")
  const cancelEditBtn = document.getElementById("cancel-edit-btn")

  if (userForm) {
    userForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = document.getElementById("user-name").value
      const email = document.getElementById("user-email").value
      const role = document.getElementById("user-role").value
      const password = document.getElementById("user-password").value

      if (editingUserId) {
        // Mise à jour de l'utilisateur existant
        const userIndex = users.findIndex((u) => u.id === editingUserId)

        if (userIndex !== -1) {
          users[userIndex].name = name
          users[userIndex].email = email
          users[userIndex].role = role

          // Si un nouveau mot de passe a été saisi
          if (password) {
            // Ici vous pourriez mettre à jour le mot de passe dans votre système
            console.log(`Mot de passe de ${email} mis à jour`)
          }

          loadUsers()
          showToast(getTranslation("userUpdated"), "success")
        }

        // Réinitialiser le formulaire
        resetUserForm()
      } else {
        // Ajout d'un nouvel utilisateur
        const newUser = {
          id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
          name,
          email,
          role,
          status: "active",
          lastLogin: new Date().toISOString().split("T")[0],
        }

        users.push(newUser)
        loadUsers()
        showToast(getTranslation("userAdded"), "success")

        // Réinitialiser le formulaire
        this.reset()
      }
    })
  }

  // Annuler l'édition
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      resetUserForm()
    })
  }

  // Modifier la fonction pour sauvegarder les paramètres
  const saveSettingsBtn = document.getElementById("save-settings")
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      const newLanguage = document.getElementById("app-language").value
      const newTheme = document.getElementById("app-theme").value
      const newCurrency = document.getElementById("currency").value

      appSettings = {
        language: newLanguage,
        theme: newTheme,
        offlineMode: document.getElementById("offline-mode").checked,
        region: document.getElementById("region").value,
        currency: newCurrency,
      }

      // Enregistrer dans localStorage
      localStorage.setItem("dsaAppSettings", JSON.stringify(appSettings))
      showToast(getTranslation("settingsSaved"), "success")

      // Appliquer le thème sélectionné
      applyTheme(newTheme)

      // Appliquer la langue sélectionnée
      applyLanguage(newLanguage)

      // Appliquer la devise sélectionnée
      applyCurrency(newCurrency)
    })
  }

  // Bouton réinitialiser les paramètres
  const resetSettingsBtn = document.getElementById("reset-settings")
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", () => {
      if (confirm(getTranslation("confirmReset"))) {
        // Réinitialiser les valeurs par défaut
        document.getElementById("app-language").value = "fr"
        document.getElementById("app-theme").value = "light"
        document.getElementById("offline-mode").checked = false
        document.getElementById("region").value = "24"
        document.getElementById("currency").value = "DZD"

        // Mettre à jour les paramètres
        appSettings = {
          language: "fr",
          theme: "light",
          offlineMode: false,
          region: "24",
          currency: "DZD",
        }

        // Enregistrer dans localStorage
        localStorage.setItem("dsaAppSettings", JSON.stringify(appSettings))
        showToast(getTranslation("settingsReset"), "success")

        // Réappliquer le thème light
        applyTheme("light")

        // Réappliquer la langue française
        applyLanguage("fr")

        // Réappliquer la devise DZD
        applyCurrency("DZD")
      }
    })
  }

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }

    // Mettre à jour le texte du statut du mode sombre
    const themeSelect = document.getElementById("app-theme")
    if (themeSelect) {
      themeSelect.value = theme
    }

    // Mettre à jour les textes des statuts des toggles
    document.querySelectorAll(".toggle-container span:not(.slider)").forEach((span) => {
      const input = span.parentElement.querySelector("input")
      if (input) {
        span.textContent = input.checked ? getTranslation("enabled") : getTranslation("disabled")
      }
    })
  }

  // Fonction pour appliquer la langue
  function applyLanguage(language) {
    // Mettre à jour le sélecteur de langue
    const languageSelect = document.getElementById("app-language")
    if (languageSelect) {
      languageSelect.value = language
    }

    // Mettre à jour les textes de l'interface
    const userFormTitle = document.getElementById("user-form-title")
    if (userFormTitle) {
      userFormTitle.textContent = getTranslation("addUser")
    }

    const passwordLabel = document.getElementById("password-label")
    if (passwordLabel) {
      passwordLabel.textContent = getTranslation("password")
    }

    const submitUserBtn = document.getElementById("submit-user-btn")
    if (submitUserBtn) {
      submitUserBtn.innerHTML = `<i class="fas fa-user-plus"></i> ${getTranslation("addUser")}`
    }

    const cancelEditBtn = document.getElementById("cancel-edit-btn")
    if (cancelEditBtn) {
      cancelEditBtn.innerHTML = `<i class="fas fa-times"></i> ${getTranslation("cancel")}`
    }

    // Mettre à jour les textes des statuts des toggles
    document.querySelectorAll(".toggle-container span:not(.slider)").forEach((span) => {
      const input = span.parentElement.querySelector("input")
      if (input) {
        span.textContent = input.checked ? getTranslation("enabled") : getTranslation("disabled")
      }
    })

    // Mettre à jour les titres des sections
    document.querySelectorAll(".settings-header h2").forEach((el) => {
      if (el.textContent.includes("Paramètres")) {
        el.textContent = getTranslation("systemSettings")
      }
    })

    document.querySelectorAll(".settings-header p").forEach((el) => {
      if (el.textContent.includes("Configurez")) {
        el.textContent = getTranslation("configureSettings")
      }
    })

    // Mettre à jour les éléments du menu
    const menuItems = {
      "general-settings": "generalSettings",
      "user-management": "userManagement",
      notifications: "notifications",
      security: "security",
      backup: "backupRestore",
    }

    document.querySelectorAll(".settings-menu li").forEach((item) => {
      const target = item.getAttribute("data-target")
      if (menuItems[target]) {
        const icon = item.querySelector("i").outerHTML
        item.innerHTML = `${icon} ${getTranslation(menuItems[target])}`
      }
    })

    // Mettre à jour les titres des cartes
    document.querySelectorAll(".settings-card h3").forEach((el) => {
      if (el.textContent.includes("Paramètres d'affichage")) {
        el.innerHTML = `<i class="fas fa-globe"></i> ${getTranslation("displaySettings")}`
      } else if (el.textContent.includes("Gestion des utilisateurs")) {
        el.innerHTML = `<i class="fas fa-users"></i> ${getTranslation("userManagement")}`
      } else if (el.textContent.includes("Paramètres de notification")) {
        el.innerHTML = `<i class="fas fa-bell"></i> ${getTranslation("notificationSettings")}`
      } else if (el.textContent.includes("Paramètres de sécurité")) {
        el.innerHTML = `<i class="fas fa-shield-alt"></i> ${getTranslation("securitySettings")}`
      } else if (el.textContent.includes("Sauvegarde et restauration")) {
        el.innerHTML = `<i class="fas fa-database"></i> ${getTranslation("backupRestore")}`
      }
    })

    // Mettre à jour les sous-titres
    document.querySelectorAll(".settings-group h4").forEach((el) => {
      if (el.textContent.includes("Langue et région")) {
        el.textContent = getTranslation("languageRegion")
      } else if (el.textContent.includes("Apparence")) {
        el.textContent = getTranslation("appearance")
      } else if (el.textContent.includes("Format des données")) {
        el.textContent = getTranslation("dataFormat")
      }
    })

    // Mettre à jour les labels des formulaires
    document.querySelectorAll(".form-group label").forEach((el) => {
      if (el.textContent.includes("Langue de l'application")) {
        el.textContent = getTranslation("appLanguage")
      } else if (el.textContent.includes("Région")) {
        el.textContent = getTranslation("region")
      } else if (el.textContent.includes("Thème")) {
        el.textContent = getTranslation("theme")
      } else if (el.textContent.includes("Mode hors ligne")) {
        el.textContent = getTranslation("offlineMode")
      } else if (el.textContent.includes("Devise")) {
        el.textContent = getTranslation("currency")
      }
    })

    // Mettre à jour les options des sélecteurs
    const languageOptions = {
      fr: "french",
      ar: "arabic",
      en: "english",
    }

    if (languageSelect) {
      Array.from(languageSelect.options).forEach((option) => {
        const langCode = option.value
        if (languageOptions[langCode]) {
          option.textContent = getTranslation(languageOptions[langCode])
        }
      })
    }

    const themeOptions = document.getElementById("app-theme")
    if (themeOptions) {
      Array.from(themeOptions.options).forEach((option) => {
        if (option.value === "light") {
          option.textContent = getTranslation("light")
        } else if (option.value === "dark") {
          option.textContent = getTranslation("dark")
        }
      })
    }

    // Mettre à jour les boutons
    const saveSettingsBtn = document.getElementById("save-settings")
    if (saveSettingsBtn) {
      saveSettingsBtn.innerHTML = `<i class="fas fa-save"></i> ${getTranslation("saveSettings")}`
    }

    const resetSettingsBtn = document.getElementById("reset-settings")
    if (resetSettingsBtn) {
      resetSettingsBtn.innerHTML = `<i class="fas fa-undo"></i> ${getTranslation("reset")}`
    }

    // Recharger la liste des utilisateurs pour mettre à jour les textes
    loadUsers()
  }

  // Fonction pour appliquer la devise
  function applyCurrency(currency) {
    // Mettre à jour l'affichage de la devise dans l'interface
    // Cette fonction serait utilisée pour mettre à jour l'affichage des montants dans l'application
    console.log(`Devise mise à jour: ${currency} (${getTranslation("currency")[currency]})`)
  }

  // Fonctions utilitaires
  function loadUsers() {
    const usersList = document.getElementById("users-list")
    if (!usersList) return

    usersList.innerHTML = ""

    users.forEach((user) => {
      const row = document.createElement("tr")

      // Déterminer la classe du badge de rôle
      let roleClass = ""
      const roleText = getTranslation("roles")[user.role] || user.role

      switch (user.role) {
        case "admin":
          roleClass = "role-admin"
          break
        case "manager":
          roleClass = "role-manager"
          break
        case "technician":
          roleClass = "role-technician"
          break
        case "viewer":
          roleClass = "role-viewer"
          break
      }

      const statusText = getTranslation("status")[user.status] || user.status

      row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                <td class="${user.status === "active" ? "status-active" : "status-inactive"}">
                    ${statusText}
                </td>
                <td>
                    <button class="action-btn edit-user" data-id="${user.id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-user" data-id="${user.id}" title="Supprimer">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `

      usersList.appendChild(row)
    })

    // Ajouter les événements aux boutons
    attachUserButtonEvents()
  }

  // Attacher les événements aux boutons d'édition et de suppression
  function attachUserButtonEvents() {
    document.querySelectorAll(".edit-user").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = Number.parseInt(this.getAttribute("data-id"))
        editUser(userId)
      })
    })

    document.querySelectorAll(".delete-user").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = Number.parseInt(this.getAttribute("data-id"))
        deleteUser(userId)
      })
    })
  }

  // Éditer un utilisateur
  function editUser(userId) {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    // Mettre à jour le titre du formulaire
    document.getElementById("user-form-title").textContent = getTranslation("editUser")
    document.getElementById("password-label").textContent = getTranslation("newPassword")

    // Remplir le formulaire avec les données de l'utilisateur
    document.getElementById("user-name").value = user.name
    document.getElementById("user-email").value = user.email
    document.getElementById("user-role").value = user.role
    document.getElementById("user-password").value = ""
    document.getElementById("user-password").required = false

    // Changer le texte du bouton
    const submitBtn = document.getElementById("submit-user-btn")
    submitBtn.innerHTML = `<i class="fas fa-save"></i> ${getTranslation("update")}`

    // Afficher le bouton d'annulation
    document.getElementById("cancel-edit-btn").style.display = "flex"

    // Stocker l'ID de l'utilisateur en cours d'édition
    editingUserId = userId

    // Faire défiler jusqu'au formulaire
    document.getElementById("add-user-form").scrollIntoView({
      behavior: "smooth",
    })

    // Activer l'onglet utilisateurs si ce n'est pas déjà le cas
    if (!document.getElementById("user-management").classList.contains("active")) {
      document.querySelector('[data-target="user-management"]').click()
    }
  }

  // Réinitialiser le formulaire utilisateur
  function resetUserForm() {
    editingUserId = null
    document.getElementById("user-form-title").textContent = getTranslation("addUser")
    document.getElementById("password-label").textContent = getTranslation("password")
    document.getElementById("user-password").required = true
    document.getElementById("submit-user-btn").innerHTML =
      `<i class="fas fa-user-plus"></i> ${getTranslation("addUser")}`
    document.getElementById("cancel-edit-btn").style.display = "none"
    document.getElementById("add-user-form").reset()
  }

  // Supprimer un utilisateur
  function deleteUser(userId) {
    if (confirm(getTranslation("confirmDelete"))) {
      users = users.filter((user) => user.id !== userId)
      loadUsers()
      showToast(getTranslation("userDeleted"), "success")

      // Si l'utilisateur supprimé était en cours d'édition, réinitialiser le formulaire
      if (editingUserId === userId) {
        resetUserForm()
      }
    }
  }

  // Modifier la fonction loadSettings pour qu'elle applique correctement les paramètres au chargement
  function loadSettings() {
    const savedSettings = localStorage.getItem("dsaAppSettings")
    if (savedSettings) {
      try {
        appSettings = JSON.parse(savedSettings)

        const appLanguageEl = document.getElementById("app-language")
        if (appLanguageEl) {
          appLanguageEl.value = appSettings.language || "fr"
        }

        const appThemeEl = document.getElementById("app-theme")
        if (appThemeEl) {
          appThemeEl.value = appSettings.theme || "light"
        }

        const offlineModeEl = document.getElementById("offline-mode")
        if (offlineModeEl) {
          offlineModeEl.checked = appSettings.offlineMode || false
        }

        const regionEl = document.getElementById("region")
        if (regionEl) {
          regionEl.value = appSettings.region || "24"
        }

        const currencyEl = document.getElementById("currency")
        if (currencyEl) {
          currencyEl.value = appSettings.currency || "DZD"
        }

        // Appliquer le thème au chargement
        applyTheme(appSettings.theme)

        // Appliquer la langue au chargement
        applyLanguage(appSettings.language)
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres:", e)
        // En cas d'erreur, utiliser les valeurs par défaut
        resetSettings()
      }
    }
  }

  // Réinitialiser les paramètres
  function resetSettings() {
    appSettings = {
      language: "fr",
      theme: "light",
      offlineMode: false,
      region: "24",
      currency: "DZD",
    }

    // Enregistrer dans localStorage
    localStorage.setItem("dsaAppSettings", JSON.stringify(appSettings))

    // Appliquer les paramètres par défaut
    applyTheme("light")
    applyLanguage("fr")
    applyCurrency("DZD")
  }

  // Obtenir une traduction
  function getTranslation(key, subKey = null) {
    const lang = appSettings.language || "fr"

    if (!translations[lang]) {
      return key // Langue non prise en charge, retourner la clé
    }

    if (subKey) {
      return translations[lang][key] && translations[lang][key][subKey] ? translations[lang][key][subKey] : key
    }

    return translations[lang][key] || key
  }

  // Afficher une notification toast
  function showToast(message, type) {
    // Supprimer les toasts existants
    const existingToasts = document.querySelectorAll(".toast")
    existingToasts.forEach((toast) => toast.remove())

    // Créer un nouveau toast
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    // Supprimer le toast après 3 secondes
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  // Ajouter des écouteurs d'événements pour les toggles
  document.querySelectorAll('.switch input[type="checkbox"]').forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const statusText = this.parentElement.nextElementSibling
      if (statusText) {
        statusText.textContent = this.checked ? getTranslation("enabled") : getTranslation("disabled")
      }
    })
  })
})
