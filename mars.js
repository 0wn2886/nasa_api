// Récupérer la clé d'API de la NASA
const API_KEY = 'fLhrIIBeXxL3fRYA4Z4HylrJiJpw5L2jQjL0fzNA';

// Sélectionner l'élément où insérer les photos
const photoContainer = document.getElementById('rover-photos');

// Fonction pour récupérer les photos d'un rover
async function fetchRoverPhotos(roverName) {
    try {
        // Construire l'URL de l'API
        const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=1000&api_key=${API_KEY}`;

        // Faire la requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier s'il y a des photos
        if (data.photos.length > 0) {
            // Parcourir les photos et les afficher
            data.photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.img_src;
                img.alt = `Photo du rover ${roverName}`;
                photoContainer.appendChild(img);
            });
        } else {
            photoContainer.textContent = `Aucune photo disponible pour le rover ${roverName}.`;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des photos :', error);
        photoContainer.textContent = 'Erreur lors du chargement des photos.';
    }
}

// Appeler la fonction pour récupérer les photos de différents rovers
fetchRoverPhotos('curiosity');
fetchRoverPhotos('perseverance');
fetchRoverPhotos('spirit');