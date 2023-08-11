// Sélectionne les éléments du DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const submitButton = document.querySelector('.submit');

// Fonction de gestion de la soumission du formulaire
const handleSubmit = async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

  // Récupère les valeurs des champs email et password
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Vérifie si l'email et le mot de passe sont renseignés
  if (email && password) {
    // URL de l'API pour la connexion
    const url = 'http://localhost:5678/api/users/login';

    try {
      // Effectue une requête POST vers l'API avec les informations de connexion
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        // Enregistre les informations de connexion dans le localStorage
        localStorage.setItem('token', data.token);
        // Redirige vers la page index.html si la requête est réussie
        window.location.href = 'index.html';
      } else {
        // Affiche un message d'erreur si les identifiants sont invalides
        errorMessage.textContent = 'Identifiants invalides';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Affiche un message d'erreur générique en cas d'erreur lors de la requête
      errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.';
    }
  } else {
    errorMessage.textContent = 'Veuillez entrer votre email et votre mot de passe.';
  }
};

// Ajoute un écouteur d'événement de soumission du formulaire
loginForm.addEventListener('submit', handleSubmit);