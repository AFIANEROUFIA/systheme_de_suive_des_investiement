class SessionManager {
  static async checkSession() {
    try {
      const response = await fetch("../api/auth/get-user.php", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user))
          return data.user
        }
      }

      // If not authenticated, redirect to login
      const user = localStorage.getItem("user")
      if (!user) {
        window.location.href = "login.html"
      }
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error("Session check error:", error)
      return null
    }
  }

  static getUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  static setUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
  }

  static logout() {
    localStorage.removeItem("user")
    fetch("../api/auth/logout.php", { credentials: "include" })
    window.location.href = "login.html"
  }

  static isAdmin() {
    const user = this.getUser()
    return user && user.role === "admin"
  }

  static isLoggedIn() {
    return !!this.getUser()
  }
}

// Initialize session on page load
document.addEventListener("DOMContentLoaded", () => {
  SessionManager.checkSession()
})
