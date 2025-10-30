document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm")
  const usernameInput = document.getElementById("username")
  const passwordInput = document.getElementById("password")
  const errorMsg = document.querySelector(".msg")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    errorMsg.textContent = ""

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) {
      errorMsg.textContent = "Veuillez remplir tous les champs."
      return
    }
    if (username.length < 3) {
      errorMsg.textContent = "Nom d'utilisateur trop court (≥ 3)."
      return
    }
    if (password.length < 5) {
      errorMsg.textContent = "Mot de passe trop court (≥ 5)."
      return
    }

    fetch("../api/auth/login.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user))
          window.location.href = "dsa-dashboard.html"
        } else {
          errorMsg.textContent = data.message || "Erreur de connexion"
        }
      })
      .catch((err) => {
        console.error("Erreur:", err)
        errorMsg.textContent = "Erreur réseau. Vérifiez l'URL de l'API."
      })
  })
})
