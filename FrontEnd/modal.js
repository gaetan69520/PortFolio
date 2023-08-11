const imageContainer = document.getElementById('imageContainer');
const closeModalIcons = document.getElementsByClassName('closeModalIcon');
const projectDiv = document.getElementById('projectDiv')
const boddyBackgroundDiv = document.getElementById('boddyBackground');
const modalDiv = document.getElementById('modal');
const modalPhoto = document.getElementById('modalPhoto');
const addButton = document.getElementById('ajout');
const modalContainer = document.getElementById('modalContainer');
const backToModalDivIcon = document.getElementById('backToModalDivIcon');
const token = localStorage.getItem('token');
console.log(token,'token');
// Variable pour suivre l'état actuel de la modal
let currentModal = null;

// Fonction pour copier les propriétés pertinentes de modalDiv vers modalPhoto
function copyModalProperties() {
  modalPhoto.style.display = modalDiv.style.display;
  modalPhoto.style.background = modalDiv.style.background;
  
}
// Fonction pour réinitialiser le formulaire
function resetForm() {
  formulaire.reset();
  fileInput.value = '';
  const previewImageToRemove = document.querySelector(".imageContain");
  console.log(previewImageToRemove); 
  if (previewImageToRemove) {
    previewImageToRemove.remove();
  }
  modalToHide.style.display = "block";
  imageURL = "";
}

// Fonction pour fermer les modals
function closeModal() {
  submitButton.disabled = true;
  errorMessage.style.display = "none";
  submitButton.style.backgroundColor = "";
  modalDiv.style.display = 'none';
  modalPhoto.style.display = 'none';
  boddyBackgroundDiv.style.background = 'white';
  // Vide le contenu du conteneur des images lorsque vous fermez la modal
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
    // Réinitialise le formulaire lorsque vous fermez la modal
    resetForm();
  }

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
modifierDiv.addEventListener('click', (event) => {
  event.stopPropagation();
  modalDiv.style.display = 'block';
  modalPhoto.style.display = 'none'; 
  boddyBackgroundDiv.style.background = 'rgba(0, 0, 0, 0.30)';
  addImagesToModal(); 
  currentModal = modalDiv; // Mettre à jour l'état actuel de la modal
});

// Gestionnaire d'événement pour le clic sur l'icône "Retourner à la Modal Principale"
backToModalDivIcon.addEventListener('click', (event) => {
  event.stopPropagation();
  errorMessage.style.display = "none";
  submitButton.disabled = true;
  submitButton.style.backgroundColor = "";
  if (currentModal === modalPhoto) {
    modalDiv.style.display = 'block';
    modalPhoto.style.display = 'none';
    currentModal = modalDiv; // Mettre à jour l'état actuel de la modal
  }
    // Réinitialise le formulaire lorsque vous fermez la modal
    resetForm();
});

// Gestionnaire d'événement pour le clic sur les icônes de fermeture de la modal principale et de la modal de la photo
Array.from(closeModalIcons).forEach(closeIcon => {
  //  Transforme closeModalIcons en un tableau pour parcourir plus facilement les éléments pour ajouter le gestionnaire d'événement.
  closeIcon.addEventListener('click', event => {
    event.stopPropagation();
    closeModal();
  });
  
});

// Gestionnaire d'événement pour le clic sur le bouton "Ajouter"
addButton.addEventListener('click', (event) => {
  event.stopPropagation();
  modalDiv.style.display = 'none';
  modalPhoto.style.display = 'block';
  currentModal = modalPhoto; // Mettre à jour l'état actuel de la modal
});

// Gestionnaire d'événement pour le clic en dehors des modals
window.addEventListener('click', () => {
  closeModal();
  
});

// Gestionnaire d'événement pour le clic à l'intérieur de la modal principale
modalDiv.addEventListener('click', (event) => {
  event.stopPropagation();
});

// Gestionnaire d'événement pour le clic à l'intérieur de la modal de la photo
modalPhoto.addEventListener('click', (event) => {
  event.stopPropagation();
});



// Fonction pour ajouter les images à la modal
function addImagesToModal() {
  const galleryImages = gallery.querySelectorAll('img[data-id]');
console.log(galleryImages);

  // Crée un conteneur flex pour aligner les images horizontalement
  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'grid';
  flexContainer.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr'; 
  flexContainer.style.padding = '50px'; 


  // Style des images
  const imageStyle = `
    width: 76px; 
    height: 102px;
    padding: 5px;
  `;

  const editTextStyle = `
    text-align: center;
    font-size: 12px;
    color: black;
  `;

  // Ajoute les images de la galerie au conteneur flex avec le texte "Éditer"
  galleryImages.forEach(image => {
    const imageContainer = document.createElement('div');
    imageContainer.style.textAlign = 'center';
    imageContainer.style.position = 'relative'; 

    const imageClone = image.cloneNode();
    imageClone.style = imageStyle;

    const editText = document.createElement('p');
    editText.textContent = 'Éditer';
    editText.style = editTextStyle;

    const moveIcon = document.createElement('i');
    moveIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'moveIcone');
    moveIcon.style.display = 'none'; // Masque l'icône de déplacement par défaut
    moveIcon.style.alignItems='center';
    moveIcon.style.fontSize = '11px';
    
// Crée un élément div pour contenir l'icône de suppression
const deleteContainer = document.createElement('div');
deleteContainer.classList.add('carre'); 
const deleteIcon = document.createElement('i');
deleteIcon.classList.add('fa-solid', 'fa-trash-can'); 
deleteContainer.appendChild(deleteIcon); // Ajoute l'icône au conteneur de suppression
// Ajoute un écouteur d'événements pour gérer le clic sur le conteneur de suppression
deleteContainer.addEventListener('click', function () {
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
  if (confirmation) {
    const imageId = image.getAttribute('data-id'); // Récupère l'ID de l'image à supprimer
    deleteImg(imageId); // Appelle la fonction pour supprimer l'élément avec l'ID de l'image
    console.log('Élément supprimé :', imageId); // Affiche un message dans la console indiquant l'ID de l'image supprimée
  }
});
// Fonction asynchrone pour supprimer une Id en utilisant une requête HTTP DELETE
async function deleteImg(id) {
  try {
    // Envoie une requête pour supprimer une image en utilisant l'ID spécifié
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token, 
      },
    });

    // Vérifie si la suppression a été effectuée avec succès en vérifiant le statut de la réponse
    if (response.ok) {
      // Si la suppression réussit, vous pouvez rafraîchir la galerie pour afficher les images mises à jour
      const updatedWorks = await getWorks();
      generateGallery(updatedWorks);
    } else {
      console.error("Échec de la suppression : ", response.status);
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
}   
    


    imageContainer.appendChild(imageClone);
    imageContainer.appendChild(editText);
    imageContainer.appendChild(deleteContainer); // Ajoute le conteneur de suppression à l'image container
    imageContainer.appendChild(moveIcon); // Ajoute l'icône de déplacement à l'image container

    
    flexContainer.appendChild(imageContainer);

    // Ajoute un gestionnaire d'événement pour afficher/masquer l'icône de déplacement lors du survol de l'image
  imageContainer.addEventListener('mouseenter', () => {
    moveIcon.style.display = 'block'; // Affiche l'icône de déplacement lors du survol
  });

  imageContainer.addEventListener('mouseleave', () => {
    moveIcon.style.display = 'none'; // Masque l'icône de déplacement lorsque le survol se termine
  });
  });

  imageContainer.appendChild(flexContainer); // Ajoute le conteneur flex au conteneur des images
}


// Sélectionnez le bouton "Ajouter Photo" et l'input de type "file"
const addButtons = document.getElementById('fileInputeUniqueButtonId');
const fileInput = document.getElementById('fileInpute');
const modalSearch = document.getElementById('modalSearch');
const formulaire = document.getElementById('formulaire'); 

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton "Ajouter Photo"
addButtons.addEventListener('click', () => {
  // Cliquez sur l'input de type "file" pour ouvrir la boîte de dialogue de sélection de fichier
  fileInput.click();
});

// Ajouter le gestionnaire d'événements pour le formulaire
formulaire.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le comportement par défaut de la soumission du formulaire

  const title = document.getElementById('title').value;
  const categories = document.getElementById('categories').value;
  const selectedFile = fileInput.files[0];

 // Pour que le bloc de code à l'intérieur du if ne s'exécute que lorsque selectedFile n'a aucune fichier sélectionné
  if (!selectedFile) {
    console.log('Veuillez sélectionner un fichier.');
    return; // Quitte la fonction si aucun fichier n'est sélectionné
  }

  //Création d'un ensemble de paires clé-valeur pour les données envoyer au serveur.
  let formData = new FormData();
  formData.append('title', title);
  formData.append('category', categories);
  formData.append('image', selectedFile);

  try {
    // Envoi de la requête POST à l'API
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    // Vérifiez si la requête a réussi
    if (!response.ok) {
      // Gérer les erreurs ici
      console.log('La requête a échoué');
    }

    const data = await response.json();
    // Gérer la réponse de l'API ici (data contiendra la réponse)
    console.log(data);
  } catch (error) {
    // Gérer les erreurs ici
    console.error('Erreur lors de la requête:', error);
  }
});


// Fonction pour récupérer les catégories depuis l'API
async function menuDeroulant() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Fonction pour mettre à jour le menu déroulant avec les nouvelles catégories
async function menuOption() {
  const categories = await menuDeroulant();
  const selectOption= document.getElementById("categories");

 
  // Ajoute les nouvelles catégories au menu déroulant
  categories.forEach(category => {
    let option = document.createElement("option");
    option.value = category.id;
    option.text = category.name;
    selectOption.appendChild(option);
  });
}
// Appel de la fonction pour mettre à jour le menu déroulant au chargement de la page
window.onload = async function () {
  await menuOption();
  generateFiltres(); // Appel à l'ancienne fonction pour générer les filtres
};





let imageURL;
let previewImage;
const modalToHide= document.querySelector(".modalToHide")
// Ajoute un gestionnaire d'événements pour le changement de l'input de type "file"
fileInput.addEventListener('change', (event) => {
  console.log(fileInput);
  const file = event.target.files[0]; // Récupérez le fichier sélectionné
  if (file) {
    //Un objet URL pour obtenir l'URL de l'image locale
    imageURL = URL.createObjectURL(file);

    //Une balise <img> pour afficher l'image ajoutée
    previewImage = document.createElement('img');
    previewImage.src = imageURL;

    // Ajoute la classe .imageContain à l'image
    previewImage.classList.add('imageContain');

    // Vide le contenu de la div "modalSearch" avant d'ajouter l'aperçu de l'image
   
   modalToHide.style.display="none";

    modalSearch.appendChild(previewImage);
  }
});



const form = document.getElementById("formulaire");
const submitButton = document.getElementById("submitButton");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("categories");
const errorMessage = document.getElementById("errorMessage"); // Récupère l'élément d'erreur

form.addEventListener("input", () => {
  if (isFormFilled()) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#1D6154";
    errorMessage.style.display = "none"; // Cache le message d'erreur
  } else {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "";
    errorMessage.style.display = "block"; // Affiche le message d'erreur
    errorMessage.textContent = "Veuillez remplir tous les champs.";
  }
});

function isFormFilled() {
  return (
    titleInput.value.trim() !== "" &&
    categorySelect.value !== "option1" &&
    fileInput.files.length > 0
  );
}

 