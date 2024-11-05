const API_KEY = 'fLhrIIBeXxL3fRYA4Z4HylrJiJpw5L2jQjL0fzNA'; // Remplacez par votre clé API NASA
const EARTH_API_URL = 'https://api.nasa.gov/planetary/earth/imagery';
const EXOPLANET_API_URL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';

const earthForm = document.getElementById('earth-form');
const earthImageContainer = document.getElementById('earth-image-container');
const exoplanetForm = document.getElementById('exoplanet-form');
const exoplanetInfo = document.getElementById('exoplanet-info');

earthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const date = document.getElementById('date').value;

    try {
        const imageUrl = await fetchEarthImage(latitude, longitude, date);
        displayEarthImage(imageUrl);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image Earth:', error);
        earthImageContainer.innerHTML = `<p>Erreur lors de la récupération de l'image. Détails : ${error.message}</p>`;
    }
});

async function fetchEarthImage(lat, lon, date) {
    const url = `${EARTH_API_URL}?lon=${lon}&lat=${lat}&date=${date}&dim=0.15&api_key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.url; // L'URL de l'image
}

function displayEarthImage(imageUrl) {
    earthImageContainer.innerHTML = `
        <img src="${imageUrl}" alt="Earth Imagery" onerror="this.onerror=null;this.src='placeholder.jpg';">
    `;
}

exoplanetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const planetName = document.getElementById('planet-name').value;

    try {
        const planetData = await fetchExoplanetData(planetName);
        displayExoplanetData(planetData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'exoplanète:', error);
        exoplanetInfo.innerHTML = `<p>Erreur lors de la récupération des données. Détails : ${error.message}</p>`;
    }
});
