document.addEventListener("DOMContentLoaded", () => {
  const form          = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMsg      = document.querySelector(".msg");

  form.addEventListener("submit", e => {
    e.preventDefault();
    errorMsg.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic front-end validation
    if (!username || !password) {
      errorMsg.textContent = "Veuillez remplir tous les champs.";
      return;
    }
    if (username.length < 3) {
      errorMsg.textContent = "Nom d'utilisateur trop court (≥ 3).";
      return;
    }
    if (password.length < 5) {
      errorMsg.textContent = "Mot de passe trop court (≥ 5).";
      return;
    }

    // Send to PHP login endpoint
    fetch("../API/auth/login.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        window.location.href = "dsa-dashboard.html"; // 👈 your custom redirect
      } else {
        errorMsg.textContent = data.message;
      }
    })
    .catch(() => {
      errorMsg.textContent = "❌ Une erreur réseau est survenue.";
    });
  });
});
