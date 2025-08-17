// Variable para almacenar el índice del slide actual
let currentSlideIndex = 0;
const slides = [];

// Función para inicializar los slides
function initSlides() {
  const slideElements = document.querySelectorAll('.slide');
  slideElements.forEach((slide, index) => {
    slides.push(slide);
    slide.dataset.slideIndex = index;
  });
  
  // Establecer el slide inicial
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }
  updateCurrentSlide();
}

// Función para navegar a un slide específico por número
function goToSlide(slideNumber) {
  const slideIndex = slideNumber - 1;
  if (slideIndex >= 0 && slideIndex < slides.length) {
    currentSlideIndex = slideIndex;
    updateCurrentSlide();
  }
}

// Función para ir al siguiente slide
function nextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    updateCurrentSlide();
  }
}

// Función para ir al slide anterior
function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    updateCurrentSlide();
  }
}

// Función para actualizar el slide actual
function updateCurrentSlide() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'previous');
    if (index === currentSlideIndex) {
      slide.classList.add('active');
    } else if (index < currentSlideIndex) {
      slide.classList.add('previous');
    }
  });
  
  updateProgress();
  
  const prevButton = document.querySelector('.nav-arrow.prev');
  const nextButton = document.querySelector('.nav-arrow.next');
  
  if (prevButton && nextButton) {
    prevButton.disabled = currentSlideIndex === 0;
    nextButton.disabled = currentSlideIndex === slides.length - 1;
  }
}
  
  // --- Navegación de Slides ---
  document.addEventListener('DOMContentLoaded', function () {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    let current = 0;
  
    function showSlide(idx) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'previous');
        if (i === idx) {
          slide.classList.add('active');
        } else if (i === idx - 1) {
          slide.classList.add('previous');
        }
      });
      // Deshabilitar prev si es el primero, next si es el último
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === slides.length - 1;
    }
  
    window.prevSlide = function () {
      if (current > 0) {
        current--;
        showSlide(current);
      }
    };
    window.nextSlide = function () {
      if (current < slides.length - 1) {
        current++;
        showSlide(current);
      }
    };
  
  // Aplicar fondo tipo hero a todos los slides
  slides.forEach(slide => slide.classList.add('hero'));

  // Inicializar
  showSlide(current);

    // Navegación con teclas Av Pág y Re Pág
    document.addEventListener('keydown', function (e) {
      // PageDown: siguiente slide
      if (e.key === 'PageDown') {
        e.preventDefault();
        window.nextSlide();
      }
      // PageUp: slide anterior
      if (e.key === 'PageUp') {
        e.preventDefault();
        window.prevSlide();
      }
    });
  });

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
  initSlides();
  createProgressBar();
  
  const firstSlide = document.querySelector('.slide.hero');
  if (firstSlide) {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶ Pantalla Completa';
    fullscreenBtn.style.cssText = `
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      backdrop-filter: blur(10px);
      z-index: 1001;
    `;
    fullscreenBtn.onclick = toggleFullscreen;
    document.body.appendChild(fullscreenBtn);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
      e.preventDefault();
    }
  });
  
  updateProgress();
});
