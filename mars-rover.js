const roverPhotos = document.querySelector('.carousel');
const indicators = document.querySelector('.carousel-indicators');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const galleryContainer = document.getElementById('gallery-container');

let currentIndex = 0;

// Hide the gallery container initially
galleryContainer.style.display = 'none';

async function fetchRoverPhotos() {
    const response = await fetch('fLhrIIBeXxL3fRYA4Z4HylrJiJpw5L2jQjL0fzNA'); // Replace with your API endpoint
    const data = await response.json();
    displayRoverPhotos(data.photos.slice(0, 15)); // Limit to 15 photos
}

function displayRoverPhotos(photos) {
    if (photos.length === 0) {
        roverPhotos.innerHTML = '<p>Aucune photo disponible pour ce sol. Essayez un autre sol.</p>';
        return;
    }

    roverPhotos.innerHTML = photos.map((photo, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${photo.img_src}" alt="Mars Rover Photo">
            <div class="carousel-caption">
                <h3>${photo.camera.full_name}</h3>
                <p>${photo.earth_date}</p>
            </div>
        </div>
    `).join('');

    indicators.innerHTML = photos.map((_, index) => `
        <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    // Show the gallery container after images are loaded
    galleryContainer.style.display = 'block';

    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');

    items.forEach((item, index) => {
        item.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : roverPhotos.children.length - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < roverPhotos.children.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
});

indicators.addEventListener('click', (e) => {
    if (e.target.classList.contains('indicator')) {
        currentIndex = parseInt(e.target.dataset.index);
        updateCarousel();
    }
});

fetchRoverPhotos();