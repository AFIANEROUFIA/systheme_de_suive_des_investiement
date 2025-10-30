document.addEventListener("DOMContentLoaded", () => {
  // Load settings
  function loadSettings() {
    const saved = localStorage.getItem("dsaAppSettings")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return getDefaultSettings()
      }
    }
    return getDefaultSettings()
  }

  function getDefaultSettings() {
    return {
      theme: "light",
      language: "fr",
      offlineMode: false,
      region: "24",
      currency: "DZD",
    }
  }

  // Apply theme
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
      const themeBtn = document.getElementById("themeToggle")
      if (themeBtn) {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>'
        themeBtn.title = "Passer au mode clair"
      }
    } else {
      document.body.classList.remove("dark-theme")
      const themeBtn = document.getElementById("themeToggle")
      if (themeBtn) {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>'
        themeBtn.title = "Passer au mode sombre"
      }
    }
  }

  // Apply language
  function applyLanguage(lang) {
    if (lang === "ar") {
      document.documentElement.dir = "rtl"
      document.body.classList.add("rtl")
    } else {
      document.documentElement.dir = "ltr"
      document.body.classList.remove("rtl")
    }
  }

  // Initialize
  const settings = loadSettings()
  applyTheme(settings.theme)
  applyLanguage(settings.language)

  // Update selectors
  const langSelect = document.getElementById("languageSelect")
  if (langSelect) {
    langSelect.value = settings.language
  }

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const settings = loadSettings()
      const newTheme = settings.theme === "dark" ? "light" : "dark"
      settings.theme = newTheme
      localStorage.setItem("dsaAppSettings", JSON.stringify(settings))
      applyTheme(newTheme)
    })
  }

  // Language change
  if (langSelect) {
    langSelect.addEventListener("change", function () {
      const settings = loadSettings()
      settings.language = this.value
      localStorage.setItem("dsaAppSettings", JSON.stringify(settings))
      applyLanguage(this.value)
    })
  }

  // Update time
  function updateTime() {
    const now = new Date()
    const timeElement = document.getElementById("current-time")
    if (timeElement) {
      timeElement.textContent = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  updateTime()
  setInterval(updateTime, 1000)
})
