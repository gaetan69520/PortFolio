const portfolioSection = document.getElementById('portfolio');
let Count = 0; 

const gallery = document.querySelector(".gallery");

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

async function generateGallery(works) {
  // Efface la galerie existante
  gallery.innerHTML = "";

  works.forEach(work => {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.setAttribute("src", work.imageUrl);
    img.setAttribute("alt", work.title);
    img.setAttribute("data-id", work.id);
    figure.appendChild(img);
   
    gallery.appendChild(figure);
  });
}

// Fonction pour supprimer tous les éléments enfants d'un élément HTML
function removeOption(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

async function generateFiltres() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  
  // Ajouter l'élément "Tous" au début du tableau des catégories
  categories.unshift({ id: 0, name: "Tous" });
  
  // Sélectionne l'élément conteneur pour les filtres
  const filtres = document.getElementById("filtres");
 // Supprime les filtres existants
 removeOption(filtres);
  // Boucle forEach pour itérer sur les catégories
  categories.forEach(category => {
    let bouton = document.createElement("button");
    bouton.innerHTML = category.name;
    bouton.id = category.id;

    bouton.classList.add("bouttons");
    bouton.classList.add("filtres");
    bouton.addEventListener("click", async (e) => {
      // Supprime la classe 'selected' de tous les boutons
      const boutons = filtres.querySelectorAll("button");
      boutons.forEach((btn) => {
        btn.classList.remove("selected");
      });

      // Ajoute la classe 'selected' au bouton cliqué
      bouton.classList.add("selected");

      const works = await getWorks();

      const filteredWorks = works.filter(function (work) {
        if (work.category.id === category.id || category.id === 0) {
          return true;
        }
      });

      // Efface la galerie existante
      gallery.innerHTML = "";

      // Génére la nouvelle galerie avec les travaux filtrés
      generateGallery(filteredWorks);
    });

    // Ajoute le bouton au conteneur des filtres
    filtres.appendChild(bouton);
  });
}

async function init() {
  const works = await getWorks();
  console.log(works);
  generateGallery(works);
  generateFiltres();
}
init();

const blockTopDiv = document.getElementById('blockTop');
const positionDiv = document.getElementById('position');
const modifierDiv = document.getElementById('modifier');
const filtresDiv = document.getElementById('filtres');
const isLoggedIn = localStorage.getItem('token');
console.log(isLoggedIn);
const loginLink = document.getElementById('login-link');
// Vérifie si l'utilisateur est connecté
if (isLoggedIn) {
  loginLink.textContent = 'logout';
  loginLink.addEventListener('click', handleLogout);
  blockTopDiv.classList.remove('hidden');
  positionDiv.classList.remove('hidden');
  modifierDiv.classList.remove('hidden');
  filtresDiv.classList.add('hidden');
  projectDiv.style.marginBottom = '7rem';
  console.log('connecté');
  // Fonction de gestion de la déconnexion
} else {
  loginLink.textContent = 'login';
  blockTopDiv.classList.add('hidden');
  positionDiv.classList.add('hidden');
  modifierDiv.classList.add('hidden');
  filtresDiv.classList.remove('hidden');
  projectDiv.style.marginBottom = '1rem';
  console.log('deconecté');
}
function handleLogout() {
  // Supprime les informations de connexion du localStorage
  localStorage.removeItem('token');

  // Redirige vers la page index.html
  window.location.href = 'index.html';
}

