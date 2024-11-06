const API_KEY = 'fLhrIIBeXxL3fRYA4Z4HylrJiJpw5L2jQjL0fzNA'; // Remplacez par votre clé API NASA
const NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

const neoForm = document.getElementById('neo-form');
const neoData = document.getElementById('neo-data');

neoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Vérification de la plage de dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayDifference = (end - start) / (1000 * 60 * 60 * 24);

    if (dayDifference > 7) {
        neoData.innerHTML = '<p>Erreur : La plage de dates ne peut pas dépasser 7 jours.</p>';
        return;
    }

    try {
        const data = await fetchNEOData(startDate, endDate);
        displayNEOData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données NEO:', error);
        neoData.innerHTML = `<p>Erreur lors de la récupération des données NEO. Détails : ${error.message}</p>`;
    }
});

async function fetchNEOData(startDate, endDate) {
    const url = `${NEO_API_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
}

function displayNEOData(data) {
    const neoByDate = data.near_earth_objects;
    let html = '';

    for (const [date, neos] of Object.entries(neoByDate)) {
        //html += `<h4>${date}</h4>`;
        for (const neo of neos) {
            html += `
                <div class="neo-card" onclick="toggleCard(this)">
                    <div class="neo-name">${neo.name}</div>
                    <div class="neo-details">
                        <ul>
                            <li>Diamètre estimé: ${neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - ${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</li>
                            <li>Potentiellement dangereux: ${neo.is_potentially_hazardous_asteroid ? 'Oui' : 'Non'}</li>
                            <li>Date d'approche: ${neo.close_approach_data[0].close_approach_date_full}</li>
                            <li>Distance manquée: ${parseFloat(neo.close_approach_data[0].miss_distance.kilometers).toFixed(2)} km</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    neoData.innerHTML = html;
}

function toggleCard(card) {
    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        card.style.top = '';
        card.style.left = '';
    } else {
        // Calculer la position actuelle
        const rect = card.getBoundingClientRect();
        card.style.top = `${rect.top}px`;
        card.style.left = `${rect.left}px`;
        card.classList.add('expanded');
    }
}
