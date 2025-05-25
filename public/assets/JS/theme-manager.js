// Gestionnaire de thème et de langue pour toutes les pages
document.addEventListener("DOMContentLoaded", function() {
  // Fonction pour charger les paramètres depuis localStorage
  function loadSettings() {
    const savedSettings = localStorage.getItem("dsaAppSettings");
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres:", e);
        return {
          language: "fr",
          theme: "light",
          offlineMode: false,
          region: "24",
          currency: "DZD",
        };
      }
    } else {
      return {
        language: "fr",
        theme: "light",
        offlineMode: false,
        region: "24",
        currency: "DZD",
      };
    }
  }

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    console.log("Thème appliqué:", theme);
  }

  // Fonction pour appliquer la langue
  function applyLanguage(language) {
    // Cette fonction sera développée plus tard pour traduire les éléments de la page
    console.log("Langue appliquée:", language);
    
    // Si la page est en arabe, ajuster la direction du texte
    if (language === "ar") {
      document.documentElement.dir = "rtl";
      document.body.classList.add("rtl");
    } else {
      document.documentElement.dir = "ltr";
      document.body.classList.remove("rtl");
    }
  }

  // Charger et appliquer les paramètres au chargement de la page
  const settings = loadSettings();
  applyTheme(settings.theme);
  applyLanguage(settings.language);

  // Ajouter les contrôles de thème et de langue dans l'en-tête si ils n'existent pas déjà
  const headerActions = document.querySelector(".header-actions") || 
                        document.querySelector(".main-header .header-actions") ||
                        document.querySelector(".page-actions");
  
  if (headerActions && !document.querySelector(".theme-language-controls")) {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "theme-language-controls";
    controlsContainer.style.display = "flex";
    controlsContainer.style.alignItems = "center";
    controlsContainer.style.marginRight = "15px";

    // Bouton de basculement de thème
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle-btn";
    themeToggle.innerHTML = settings.theme === "dark" ? 
      '<i class="fas fa-sun"></i>' : 
      '<i class="fas fa-moon"></i>';
    themeToggle.title = settings.theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre";
    themeToggle.style.background = "transparent";
    themeToggle.style.border = "none";
    themeToggle.style.color = "inherit";
    themeToggle.style.fontSize = "1.2rem";
    themeToggle.style.cursor = "pointer";
    themeToggle.style.marginRight = "15px";

    // Sélecteur de langue
    const languageSelector = document.createElement("select");
    languageSelector.className = "language-selector";
    languageSelector.style.background = "transparent";
    languageSelector.style.border = "1px solid var(--border-color, #ccc)";
    languageSelector.style.color = "inherit";
    languageSelector.style.padding = "3px 5px";
    languageSelector.style.borderRadius = "4px";
    languageSelector.style.cursor = "pointer";

    const languages = [
      { code: "fr", name: "FR" },
      { code: "en", name: "EN" },
      { code: "ar", name: "عربي" }
    ];

    languages.forEach(lang => {
      const option = document.createElement("option");
      option.value = lang.code;
      option.textContent = lang.name;
      if (settings.language === lang.code) {
        option.selected = true;
      }
      languageSelector.appendChild(option);
    });

    // Ajouter les événements
    themeToggle.addEventListener("click", function() {
      const currentSettings = loadSettings();
      const newTheme = currentSettings.theme === "dark" ? "light" : "dark";
      
      // Mettre à jour les paramètres
      currentSettings.theme = newTheme;
      localStorage.setItem("dsaAppSettings", JSON.stringify(currentSettings));
      
      // Appliquer le nouveau thème
      applyTheme(newTheme);
      
      // Mettre à jour l'icône du bouton
      this.innerHTML = newTheme === "dark" ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
      this.title = newTheme === "dark" ? "Passer au mode clair" : "Passer au mode sombre";
    });

    languageSelector.addEventListener("change", function() {
      const currentSettings = loadSettings();
      currentSettings.language = this.value;
      localStorage.setItem("dsaAppSettings", JSON.stringify(currentSettings));
      
      // Appliquer la nouvelle langue
      applyLanguage(this.value);
      
      // Recharger la page pour appliquer les traductions
      window.location.reload();
    });

    // Ajouter les contrôles à l'en-tête
    controlsContainer.appendChild(themeToggle);
    controlsContainer.appendChild(languageSelector);
    
    // Insérer avant le premier élément ou à la fin
    if (headerActions.firstChild) {
      headerActions.insertBefore(controlsContainer, headerActions.firstChild);
    } else {
      headerActions.appendChild(controlsContainer);
    }
  }
});
