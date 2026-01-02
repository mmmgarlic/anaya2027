// Constants
const BLUE = '#2A00FF';
const WHITE = '#FFFFFF';

// Projects data
const projects = [
  {
    id: 1,
    title: 'Lorem Ipsum Dolor',
    year: '2025',
    tags: ['Creative Code', 'Chatbot Creation', 'Web Design', 'Game Design'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 2,
    title: 'Consectetur Adipiscing',
    year: '2025',
    tags: ['Interactive', 'Generative Art', 'Web Design'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 3,
    title: 'Sed Do Eiusmod',
    year: '2024',
    tags: ['Music Production', 'Sound Design', 'Audio'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 4,
    title: 'Tempor Incididunt',
    year: '2024',
    tags: ['UI/UX Design', 'Prototyping', 'Mobile'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 5,
    title: 'Ut Labore Magna',
    year: '2024',
    tags: ['Animation', 'Motion Graphics', 'Video'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 6,
    title: 'Aliqua Enim Minim',
    year: '2023',
    tags: ['Data Visualization', 'Creative Code', 'Interactive'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 7,
    title: 'Veniam Quis Nostrud',
    year: '2023',
    tags: ['Web Development', 'Full Stack', 'API Design'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 8,
    title: 'Exercitation Ullamco',
    year: '2023',
    tags: ['3D Design', 'Blender', 'Rendering'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 9,
    title: 'Laboris Nisi Aliquip',
    year: '2023',
    tags: ['Game Design', 'Unity', 'Interactive'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

// Scrolling text words
const scrollingWords = [
  'GRAPHIC DESIGNER',
  'INTERACTION ARTIST',
  'CREATIVE CODER',
  'MUSIC CREATOR',
  'FILM ENTHUSIAST',
  'VIDEO GAME LOVER'
];

// State variables
let scrollDelta = 0;
let scrollDirection = 1; // 1 = down, -1 = up
let mouseActive = false;
let showWorkButton = true;
let scrollProgress = 0; // 0 to 1 transition progress
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let heroTextRect = null;
let isAutoScrolling = false;

// Animation variables
let cloverAngle = 0;
let spinBoost = 0;
let currentDirection = 1;

let scrollingTextOffset = 0;
let scrollBoost = 0;
let scrollingTextDirection = 1;

// Get DOM elements
const container = document.getElementById('container');
const clover = document.getElementById('clover');
const cloverLeaves = document.getElementById('cloverLeaves');
const headerGradient = document.getElementById('headerGradient');
const workButton = document.getElementById('workButton');
const mainTitle = document.getElementById('mainTitle');
const heroContent = document.getElementById('heroContent');
const scrollingTextContainer = document.getElementById('scrollingTextContainer');
const scrollingText = document.getElementById('scrollingText');
const workSection = document.getElementById('workSection');
const topLine = document.getElementById('topLine');
const projectsList = document.getElementById('projectsList');
const footer = document.getElementById('footer');
const bottomGradient = document.getElementById('bottomGradient');
const cloverPlaceholder = document.getElementById('cloverPlaceholder');
const navigationContent = document.getElementById('navigationContent');

// Initialize
function init() {
  // Set up scrolling text
  const text = scrollingWords.join('  ✦  ');
  const fullText = `${text}  ✦  ${text}  ✦  ${text}  ✦  ${text}`;
  scrollingText.textContent = fullText;

  // Render projects
  renderProjects();

  // Update viewport dimensions
  updateViewportDimensions();

  // Start animation loops
  requestAnimationFrame(animateClover);
  requestAnimationFrame(animateScrollingText);

  // Event listeners
  window.addEventListener('resize', updateViewportDimensions);
  window.addEventListener('wheel', handleWheel);
  container.addEventListener('scroll', handleScroll);
  window.addEventListener('mousemove', handleMouseMove);
  clover.addEventListener('click', () => window.location.reload());
  workButton.addEventListener('click', scrollToWork);

  // Mouse activity tracking
  let mouseTimeout;
  window.addEventListener('mousemove', () => {
    mouseActive = true;
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      mouseActive = false;
    }, 150);
  });

  // Initial update
  updateLayout();
}

// Render projects
function renderProjects() {
  projectsList.innerHTML = projects.map((project, index) => `
    <div>
      <div class="project-card">
        <div class="project-image"></div>
        <div class="project-content">
          <div class="project-header">
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-year">${project.year}</div>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
        </div>
      </div>
      ${index < projects.length - 1 ? '<div class="project-divider"></div>' : ''}
    </div>
  `).join('');
}

// Update viewport dimensions
function updateViewportDimensions() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  
  // Update hero text rect
  if (mainTitle) {
    heroTextRect = mainTitle.getBoundingClientRect();
  }
  
  updateLayout();
}

// Handle wheel events
function handleWheel(e) {
  scrollDelta = Math.abs(e.deltaY);
  scrollDirection = e.deltaY > 0 ? 1 : -1;
}

// Handle scroll events
let scrollTimeout;
function handleScroll() {
  if (isAutoScrolling) return;
  
  const scrollPosition = container.scrollTop;

  // Smoothly transition based on scroll position
  if (scrollPosition > 100) {
    scrollProgress = 1;
    showWorkButton = false;
  } else {
    scrollProgress = scrollPosition / 100;
    showWorkButton = scrollProgress < 0.5;
  }

  // Clear any existing timeout
  clearTimeout(scrollTimeout);

  // Set timeout to detect when scrolling stops
  scrollTimeout = setTimeout(() => {
    // If we're in the transition zone (between 10px and 90px), auto-complete
    if (scrollPosition > 10 && scrollPosition < 90) {
      isAutoScrolling = true;

      // Determine which direction to complete the scroll
      const shouldScrollToWork = scrollPosition > 50;
      const targetScroll = shouldScrollToWork ? 100 : 0;

      // Smooth scroll to target
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      // Reset auto-scrolling flag after animation completes
      setTimeout(() => {
        isAutoScrolling = false;
      }, 600);
    }
  }, 150);

  updateLayout();
}

// Handle mouse movement
function handleMouseMove() {
  mouseActive = true;
}

// Scroll to work section
function scrollToWork() {
  scrollProgress = 1;
  setTimeout(() => {
    workSection.scrollIntoView({
      behavior: 'smooth'
    });
  }, 50);
}

// Animate clover rotation
function animateClover() {
  // Smoothly decay boost
  spinBoost *= 0.92;

  // Always have base rotation (slow clockwise)
  const baseSpeed = 0.3;

  // Rotate with base speed + scroll boost, TIMES direction
  const totalSpeed = (baseSpeed + spinBoost) * currentDirection;
  cloverAngle += totalSpeed;

  // Apply rotation
  cloverLeaves.style.transform = `translate(-50%, -50%) rotate(${cloverAngle}deg)`;

  requestAnimationFrame(animateClover);
}

// Update spin boost when scrolling
let spinDirectionTimeout;
window.addEventListener('wheel', (e) => {
  const boost = Math.abs(e.deltaY) * 0.15;
  spinBoost = Math.min(boost, 12);
  currentDirection = e.deltaY > 0 ? 1 : -1;

  clearTimeout(spinDirectionTimeout);
  spinDirectionTimeout = setTimeout(() => {
    currentDirection = 1;
  }, 150);
});

// Animate scrolling text
function animateScrollingText() {
  // Decay the scroll boost
  scrollBoost *= 0.95;

  // Check if mobile
  const isMobile = viewportWidth < 1024;
  const baseSpeed = isMobile ? 0.5 : 0.8;

  // Calculate current speed (base + boost) TIMES direction
  const currentSpeed = (baseSpeed + scrollBoost) * scrollingTextDirection;

  scrollingTextOffset += currentSpeed;

  // Normalize offset for looping
  const textWidth = 2000;
  const normalizedOffset = ((scrollingTextOffset % textWidth) + textWidth) % textWidth;

  // Apply transform
  scrollingText.style.transform = `translateX(-${normalizedOffset}px)`;

  requestAnimationFrame(animateScrollingText);
}

// Update scrolling text boost when scrolling
let scrollTextDirectionTimeout;
window.addEventListener('wheel', (e) => {
  const isMobile = viewportWidth < 1024;
  const boost = Math.abs(e.deltaY) * (isMobile ? 0.2 : 0.3);
  scrollBoost = Math.min(boost, isMobile ? 20 : 30);
  scrollingTextDirection = e.deltaY > 0 ? 1 : -1;

  clearTimeout(scrollTextDirectionTimeout);
  scrollTextDirectionTimeout = setTimeout(() => {
    scrollingTextDirection = 1;
  }, 150);
});

// Update layout based on scroll progress
function updateLayout() {
  const isMobile = viewportWidth < 1024;

  // Calculate dynamic styles based on scroll progress
  const titleOpacity = Math.max(0, 1 - scrollProgress * 1.3);
  const titleScale = 1 - scrollProgress * 0.15;
  const scrollingTextOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const scrollingTextTranslateY = scrollProgress * 80;

  // Clover positioning
  const CLOVER_SIZE = isMobile ? 60 : 96;
  const MIN_GAP = isMobile ? 12 : 20;

  let startX;
  let baseCloverScale = 1.0;

  if (heroTextRect) {
    const textLeftEdge = heroTextRect.left;
    const availableSpaceForClover = textLeftEdge - MIN_GAP;

    startX = textLeftEdge - CLOVER_SIZE / 2 - MIN_GAP;

    const idealCloverSpace = CLOVER_SIZE + MIN_GAP;
    if (availableSpaceForClover < idealCloverSpace) {
      baseCloverScale = Math.max(0.5, availableSpaceForClover / idealCloverSpace);
      startX = textLeftEdge - (CLOVER_SIZE * baseCloverScale) / 2 - MIN_GAP;
    }

    if (viewportWidth < 805) {
      baseCloverScale *= 0.6;
    } else if (viewportWidth < 1024) {
      baseCloverScale *= 0.85;
    }
  } else {
    if (viewportWidth < 805) {
      startX = viewportWidth * 0.15;
      baseCloverScale = 0.6;
    } else if (viewportWidth < 1024) {
      startX = viewportWidth * 0.18;
      baseCloverScale = 0.85;
    } else {
      startX = viewportWidth * 0.24;
      baseCloverScale = 1.0;
    }
  }

  const startY = viewportHeight * 0.47;
  const endY = 40;
  const endX = viewportWidth * 0.5;

  const cloverY = viewportHeight > 0 ? startY - (startY - endY) * scrollProgress : startY;
  const cloverX = viewportWidth > 0 ? startX - (startX - endX) * scrollProgress : startX;
  const finalCloverScale = baseCloverScale * (1 - scrollProgress * 0.35);

  // Work content animations
  const workContentOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.5));
  const workContentTranslateY = Math.max(0, (1 - scrollProgress) * 40);
  const headerGradientOpacity = Math.min(0.95, scrollProgress * 3);
  const bottomGradientOpacity = Math.max(0, 1 - scrollProgress * 2.5);

  // Apply styles
  clover.style.top = `${cloverY}px`;
  clover.style.left = `${cloverX}px`;
  clover.style.transform = `translate(-50%, -50%) scale(${finalCloverScale})`;

  mainTitle.style.opacity = titleOpacity;
  mainTitle.style.transform = `scale(${titleScale})`;

  scrollingTextContainer.style.opacity = scrollingTextOpacity;
  scrollingTextContainer.style.transform = `translateY(${scrollingTextTranslateY}px)`;

  workButton.style.opacity = showWorkButton ? 1 : 0;
  workButton.style.pointerEvents = showWorkButton ? 'auto' : 'none';

  headerGradient.style.opacity = headerGradientOpacity;
  bottomGradient.style.opacity = bottomGradientOpacity;

  topLine.style.opacity = workContentOpacity * 0.3;
  topLine.style.transform = `translateY(${workContentTranslateY}px)`;

  projectsList.style.opacity = workContentOpacity;
  projectsList.style.transform = `translateY(${workContentTranslateY}px)`;

  footer.style.opacity = workContentOpacity;

  // Update scrolling text container width to match hero content
  if (heroContent) {
    scrollingTextContainer.style.width = `${heroContent.offsetWidth}px`;
  }

  // Update clover placeholder size for mobile
  if (isMobile) {
    cloverPlaceholder.style.width = '60px';
    cloverPlaceholder.style.height = '60px';
  } else {
    cloverPlaceholder.style.width = '96px';
    cloverPlaceholder.style.height = '96px';
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
