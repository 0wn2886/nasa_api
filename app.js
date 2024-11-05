const API_KEY = 'fLhrIIBeXxL3fRYA4Z4HylrJiJpw5L2jQjL0fzNA';
const API_URL = 'https://api.nasa.gov/planetary/apod';

const apodImage = document.getElementById('apod-image');
const apodTitle = document.getElementById('apod-title');
const apodDate = document.getElementById('apod-date');
const apodExplanation = document.getElementById('apod-explanation');
const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeModal = document.getElementsByClassName('close')[0];

async function fetchAPOD(date = null) {
    let url = `${API_URL}?api_key=${API_KEY}`;

    if (date) {
        url += `&date=${date}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

async function displayAPOD() {
    const apodData = await fetchAPOD();
    apodImage.src = apodData.url;
    apodImage.alt = apodData.title;
    apodTitle.textContent = apodData.title;
    apodDate.textContent = `Date: ${apodData.date}`;
    apodExplanation.textContent = apodData.explanation;
}

let currentSlide = 0;
const autoSlideInterval = 5000; // 5 secondes entre chaque diapositive
let autoSlideTimer;

async function displayGallery() {
    const carousel = document.querySelector('.carousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const today = new Date();
    const images = [];

    // Récupérer toutes les images
    for (let i = 1; i <= 10; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = date.toISOString().split('T')[0];
        const apodData = await fetchAPOD(formattedDate);
        images.push(apodData);
    }

    // Créer les slides
    images.forEach((data, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-item';
        slide.innerHTML = `
            <img src="${data.url}" alt="${data.title}">
            <div class="carousel-caption">
                <h3>${data.title}</h3>
                <p>Date: ${data.date}</p>
            </div>
        `;
        carousel.appendChild(slide);

        // Créer les indicateurs
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    // Initialiser le défilement automatique
    startAutoSlide();

    // Ajouter les événements pour les boutons
    document.querySelector('.prev').addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
    });

    document.querySelector('.next').addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
    });

    // Pause du défilement automatique au survol
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
}

function goToSlide(index) {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');

    // Gérer le défilement circulaire
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentSlide = index;

    // Déplacer le carrousel
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Mettre à jour les indicateurs
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });
}

function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, autoSlideInterval);
}

function stopAutoSlide() {
    clearInterval(autoSlideTimer);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

displayAPOD();
displayGallery();