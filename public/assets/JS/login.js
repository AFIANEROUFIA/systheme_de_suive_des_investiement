document.addEventListener("DOMContentLoaded", function() {
  // Récupération des éléments du formulaire
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");

  // Gestion de la soumission du formulaire
  form.addEventListener("submit", function(e) {
      e.preventDefault(); // Empêche l'envoi classique du formulaire

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Réinitialisation du message d'erreur
      errorMsg.textContent = "";

      // Validation des champs
      if (username === "" || password === "") {
          errorMsg.textContent = "Veuillez remplir tous les champs.";
          return;
      }

      if (username.length < 3) {
          errorMsg.textContent = "Nom d'utilisateur trop court (minimum 3 caractères).";
          return;
      }

      if (password.length < 5) {
          errorMsg.textContent = "Mot de passe trop court (minimum 5 caractères).";
          return;
      }

      // Vérification des identifiants (exemple avec un compte admin)
      if (username === "admin" && password === "admin123") {
          alert("✅ Connexion réussie ! Vous allez être redirigé...");
          window.location.href = "dashboard.html"; // Redirection après connexion
      } else {
          errorMsg.textContent = "❌ Nom d'utilisateur ou mot de passe incorrect.";
      }
  });

  // Réinitialisation des erreurs lors de la saisie
  [usernameInput, passwordInput].forEach(input => {
      input.addEventListener("input", () => {
          errorMsg.textContent = "";
      });
  });
});