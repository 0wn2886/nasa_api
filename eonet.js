const EONET_API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

const eonetForm = document.getElementById('eonet-form');
const eonetInfo = document.getElementById('eonet-info');

eonetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventType = document.getElementById('event-type').value;

    try {
        const eventsData = await fetchEonetData(eventType);
        displayEonetData(eventsData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données des événements naturels:', error);
        eonetInfo.innerHTML = `<p>Erreur lors de la récupération des données. Détails : ${error.message}</p>`;
    }
});

async function fetchEonetData(eventType) {
    const url = `${EONET_API_URL}?status=open&category=${eventType}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.events; // Retourne les événements
}

function displayEonetData(events) {
    if (!events.length) {
        eonetInfo.innerHTML = '<p>Aucun événement trouvé pour ce type.</p>';
        return;
    }

    eonetInfo.innerHTML = events.map(event => `
        <div class="event">
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.geometry[0].date).toLocaleDateString()}</p>
            <p><strong>Coordinates:</strong> ${event.geometry[0].coordinates.join(', ')}</p>
            <p><strong>Description:</strong> ${event.description || 'No description available'}</p>
        </div>
    `).join('');
}