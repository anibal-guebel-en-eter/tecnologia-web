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

// Función para crear barra de progreso
function createProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.id = 'progress-container';
  progressContainer.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(0,0,0,0.3);
    z-index: 1001;
  `;
  
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.style.cssText = `
    height: 100%;
    background: var(--primary-blue);
    width: 0%;
    transition: width 0.3s ease;
  `;
  
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
}

// Función para actualizar barra de progreso
function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar && slides.length > 0) {
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

// Función para alternar pantalla completa
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Navegación de Slides - Configuración principal
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
  
  // Botón de pantalla completa solo en el primer slide
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
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
      e.preventDefault();
    } else if (e.key === 'Home') {
      // Ir al primer slide
      currentSlideIndex = 0;
      updateCurrentSlide();
      e.preventDefault();
    } else if (e.key === 'End') {
      // Ir al último slide
      currentSlideIndex = slides.length - 1;
      updateCurrentSlide();
      e.preventDefault();
    }
  });
  
  updateProgress();
});

// Funciones adicionales para mejorar la experiencia

// Función para detectar si estamos en dispositivo táctil
function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

// Soporte para gestos táctiles (swipe)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      prevSlide();
    }
  }
}

// Función para manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
  // Recalcular elementos si es necesario
  updateProgress();
});

// Función para pausar/reanudar presentación con spacebar
let isPaused = false;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    // Aquí podrías implementar lógica de pausa si tuvieras auto-avance
  }
});

// Función para mostrar ayuda de teclado
function showKeyboardHelp() {
  const helpText = `
    Navegación por Teclado:
    • Flecha Derecha / Espacio / AvPág: Siguiente slide
    • Flecha Izquierda / RePág: Slide anterior  
    • Inicio: Primer slide
    • Fin: Último slide
    • F11: Pantalla completa
  `;
  
  // Mostrar ayuda (podrías implementar un modal aquí)
  console.log(helpText);
}

// Mostrar ayuda con F1
document.addEventListener('keydown', (e) => {
  if (e.key === 'F1') {
    e.preventDefault();
    showKeyboardHelp();
  }
});

// Exportar funciones para uso global si es necesario
window.slideNavigation = {
  nextSlide,
  prevSlide,
  goToSlide,
  toggleFullscreen
};