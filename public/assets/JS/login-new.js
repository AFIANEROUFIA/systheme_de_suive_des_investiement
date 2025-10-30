document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const themeToggle = document.getElementById("themeToggle")
  const languageSelect = document.getElementById("languageSelect")
  const errorMessage = document.getElementById("errorMessage")

  // Load saved settings
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
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      themeToggle.title = "Passer au mode clair"
    } else {
      document.body.classList.remove("dark-theme")
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      themeToggle.title = "Passer au mode sombre"
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
  languageSelect.value = settings.language

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const settings = loadSettings()
    const newTheme = settings.theme === "dark" ? "light" : "dark"
    settings.theme = newTheme
    localStorage.setItem("dsaAppSettings", JSON.stringify(settings))
    applyTheme(newTheme)
  })

  // Language change
  languageSelect.addEventListener("change", function () {
    const settings = loadSettings()
    settings.language = this.value
    localStorage.setItem("dsaAppSettings", JSON.stringify(settings))
    applyLanguage(this.value)
  })

  // Form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    try {
      const response = await fetch("api/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user session
        localStorage.setItem("userSession", JSON.stringify(data.user))
        // Redirect to dashboard
        window.location.href = "electrification.html"
      } else {
        showError(data.message || "Erreur de connexion")
      }
    } catch (error) {
      console.error("Login error:", error)
      showError("Erreur de connexion. Veuillez réessayer.")
    }
  })

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.add("show")
    setTimeout(() => {
      errorMessage.classList.remove("show")
    }, 5000)
  }
})
