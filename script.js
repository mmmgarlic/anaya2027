/* script.js */

// Constants
const BLUE = '#2A00FF';
const WHITE = '#FFFFFF';

const projects = [
  {
    id: 1,
    title: 'Way–farer',
    year: '2024',
    tags: ['Motion Graphics','Video Editing','3D Animation'],
    description: 'Creating a sleek product advert for Wayfarer, a speculative satellite-powered travel companion.',
    href: 'projects/wayfarer.html',
    media: { type: 'video', src: 'images/homepage/wayfarer.mp4' }
  },
  {
    id: 2,
    title: 'Sharp Cheddar',
    year: '2022',
    tags: ['Type Design', 'Animation'],
    description: 'Designing a funky (semi)modular typeface, inspired by 70s cartoons.',
    href: 'projects/sharpcheddar.html',
    media: { type: 'video', src: 'images/homepage/sharpcheddar.mp4' }
  },
  {
    id: 3,
    title: 'On The Groove',
    year: '2024',
    tags: ['Campaign Design','Branding & Marketing'],
    description: 'Conceptualising a speculative Spotify feature + campaign that connects London Underground commuters through music.',
    href: 'projects/onthegroove.html',
    media: { type: 'image', src: 'images/homepage/otg.png' }
  },
  {
    id: 4,
    title: 'The Ritual',
    year: '2024',
    tags: ['Video Shooting + Editing', 'Set Creation', 'Creative Direction'],
    description: 'An original 16mm short film, exploring romance and resurrection.',
    href: 'projects/theritual.html',
    media: { type: 'video', src: 'images/homepage/ritual.m4v' }
  },
  {
    id: 5,
    title: 'Back to School with Goodnotes',
    year: '2024',
    tags: ['Illustration', 'Sticker Design', 'Branding + Marketing Design'],
    description: 'Refreshing and reimagining Goodnotes’ Back-to-School sticker pack, released in-app to 24M+ subscribers.',
    href: 'projects/goodnotes.html',
    media: { type: 'image', src: 'images/homepage/goodnotes.png' }
  },
  {
    id: 6,
    title: 'Thirsty Robots',
    year: '2025',
    tags: ['Creative Coding', 'AI Chatbot Creation', 'Experimental'],
    description: 'Building a series of playful, interactive web experiences that reveal the hidden environmental cost of AI.',
    href: 'projects/thirstyrobots.html',
    media: { type: 'video', src: 'images/homepage/thirstyrobots.mov' }
  },
  {
    id: 7,
    title: 'Archive – Editorial Design',
    year: '',
    tags: ['Layouting','Cover Design','Zines + Pamphlets','Publication Design'],
    description: 'A collection of selected editorial design work.',
    href: null,
    media: { type: 'image', src: 'images/homepage/editorial.png' }
  },
  {
    id: 8,
    title: 'Archive – Miscellaneous',
    year: '',
    tags: ['Random', 'Lol', 'Idk'],
    description: 'A collection of selected design experiments.',
    href: null,
    media: { type: 'image', src: 'images/homepage/misc.png' }
  }
];

// Scrolling text words
const scrollingWords = [
  'creative code',
  'graphic design',
  'branding',
  'film',
  'game design'
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

// --- Direction reset helpers (prevents "stuck backwards" + avoids snap/turbo) ---
let scrollTextDirectionTimeout;
function scheduleScrollDirectionReset() {
  clearTimeout(scrollTextDirectionTimeout);
  scrollTextDirectionTimeout = setTimeout(() => {
    if (scrollBoost < 1.2) {
      scrollingTextDirection = 1;
    } else {
      scheduleScrollDirectionReset();
    }
  }, 160);
}

let spinDirectionTimeout;
function scheduleSpinDirectionReset() {
  clearTimeout(spinDirectionTimeout);
  spinDirectionTimeout = setTimeout(() => {
    if (spinBoost < 0.8) {
      currentDirection = 1;
    } else {
      scheduleSpinDirectionReset();
    }
  }, 160);
}

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

// --- Fix iOS "one hitch" when returning to landing ---
// While user is actively scrolling, disable clover CSS transition (iOS Safari stutter fix)
let scrollingActiveTimeout;

function setScrollingActive(active) {
  const isMobile = viewportWidth < 1024;
  if (!isMobile) return;

  if (!clover) return;
  clover.style.transition = active
    ? 'none'
    : 'transform 0.30s cubic-bezier(0.4, 0, 0.2, 1)';
}

function wrapSpecialChars(el) {
  if (!el) return;

  // Replace only text nodes inside el
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  // Define what counts as "special"
  // This catches common symbols like ✦ ↓ ↑ • — etc (non A-Z, a-z, 0-9, basic punctuation)
  const specialRegex = /([^\w\s✦.,'])/g;

  textNodes.forEach(node => {
    const text = node.nodeValue;
    if (!specialRegex.test(text)) return;

    const span = document.createElement('span');
    span.innerHTML = text.replace(specialRegex, `<span class="special-char">$1</span>`);
    node.parentNode.replaceChild(span, node);
  });
}

let layoutRaf = null;
function requestLayoutUpdate() {
  if (layoutRaf) return;
  layoutRaf = requestAnimationFrame(() => {
    layoutRaf = null;

    // keep heroTextRect fresh while title is scaling
    if (mainTitle) heroTextRect = mainTitle.getBoundingClientRect();

    updateLayout();
  });
}

/* =========================
   MOBILE: Block project clicks + show overlay
   ========================= */
function setupMobileProjectLock() {
  if (!projectsList) return;

  const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;

  projectsList.addEventListener('click', (e) => {
    const link = e.target.closest('a.project-link');
    if (!link) return;

    // mobile only
    if (!isMobile()) return;

    // ignore disabled (coming soon) projects
    if (link.classList.contains('is-disabled')) return;

    // stop navigation + show overlay
    e.preventDefault();

    link.classList.add('is-mobile-locked');
    window.setTimeout(() => {
      link.classList.remove('is-mobile-locked');
    }, 900);
  }, { passive: false });
}

// Initialize
function init() {
  if (scrollingText) {
    // Set up scrolling text
    const text = scrollingWords.join('  ✦  ');
    const fullText = `${text}  ✦  ${text}  ✦  ${text}  ✦  ${text}`;
    scrollingText.textContent = fullText;
  }

  wrapSpecialChars(document.body);

  // Render projects
  renderProjects();

  // Update viewport dimensions
  updateViewportDimensions();

  // Start animation loops
  if (cloverLeaves) requestAnimationFrame(animateClover);
  if (scrollingText) requestAnimationFrame(animateScrollingText);

  // Event listeners
  window.addEventListener('resize', updateViewportDimensions);
  if (container) container.addEventListener('scroll', handleScroll);
  window.addEventListener('mousemove', handleMouseMove);

  if (clover) clover.addEventListener('click', () => window.location.reload());
  if (workButton) workButton.addEventListener('click', scrollToWork);

  // --- Mobile: make scroll boost work on touch (no wheel on phones) ---
  let lastTouchY = null;
  let lastTouchTime = 0;

  window.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    lastTouchY = e.touches[0].clientY;
    lastTouchTime = performance.now();
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0] || lastTouchY == null) return;

    const y = e.touches[0].clientY;
    const now = performance.now();
    const dy = lastTouchY - y; // + = scrolling down
    const dt = Math.max(1, now - lastTouchTime);

    const dir = dy > 0 ? 1 : -1;
    const velocity = Math.min(40, Math.abs(dy) * (16 / dt)); // roughly normalized

    // Clover boost
    spinBoost = Math.min(12, velocity * 0.9);
    currentDirection = dir;

    // Scrolling text boost
    scrollBoost = Math.min(30, velocity * 1.4);
    scrollingTextDirection = dir;

    // after touch stops, drift back to default direction
    scheduleScrollDirectionReset();
    scheduleSpinDirectionReset();

    lastTouchY = y;
    lastTouchTime = now;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    lastTouchY = null;
  }, { passive: true });

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
  requestLayoutUpdate();

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateViewportDimensions();
      requestLayoutUpdate();
    }, 250);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      updateViewportDimensions();
      requestLayoutUpdate();
    });
  }
}

function renderProjects() {
  if (!projectsList) return;

  projectsList.innerHTML = projects.map((project, index) => {
    const mediaHTML = project.media?.type === 'video'
      ? `
        <video class="project-media" autoplay loop muted playsinline preload="metadata">
          <source src="${project.media.src}">
        </video>
      `
      : `
        <img class="project-media" src="${project.media?.src || ''}" alt="${project.title}">
      `;

    const wrapperTag = project.href ? 'a' : 'div';
    const wrapperAttrs = project.href ? `href="${project.href}"` : '';
    const wrapperClass = `project-link${project.href ? '' : ' is-disabled'}`;

    return `
      <${wrapperTag} class="${wrapperClass}" ${wrapperAttrs}>
        <div class="project-card">
          <div class="project-image">
            ${mediaHTML}
          </div>

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
      </${wrapperTag}>
      ${index < projects.length - 1 ? '<div class="project-divider"></div>' : ''}
    `;
  }).join('');

  // enable mobile-only overlay behavior for real (non-disabled) projects
  setupMobileProjectLock();
}

function updateViewportDimensions() {
  const vv = window.visualViewport;

  // iOS landscape: visualViewport is more reliable than innerWidth/innerHeight
  viewportWidth = vv ? vv.width : window.innerWidth;
  viewportHeight = vv ? vv.height : window.innerHeight;

  if (mainTitle) heroTextRect = mainTitle.getBoundingClientRect();
  requestLayoutUpdate();
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

  // iOS: prevent the one-time clover hitch by disabling transition during active scroll
  setScrollingActive(true);
  clearTimeout(scrollingActiveTimeout);
  scrollingActiveTimeout = setTimeout(() => {
    setScrollingActive(false);
  }, 120);

  const scrollPosition = container ? container.scrollTop : 0;

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

      const isMobile = viewportWidth < 1024;
      if (container) container.scrollTo({ top: targetScroll, behavior: isMobile ? 'auto' : 'smooth' });

      // Reset auto-scrolling flag after animation completes
      setTimeout(() => {
        isAutoScrolling = false;
      }, 600);
    }
  }, 150);

  requestLayoutUpdate();
}

// Handle mouse movement
function handleMouseMove() {
  mouseActive = true;
}

// Scroll to work section
function scrollToWork() {
  scrollProgress = 1;
  setTimeout(() => {
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 50);
}

// Animate clover rotation
function animateClover() {
  const isMobile = viewportWidth < 1024;

  // decay (mobile holds boost a bit longer)
  spinBoost *= isMobile ? 0.94 : 0.92;

  // base rotation (mobile faster)
  const baseSpeed = isMobile ? 0.75 : 0.3;

  // Rotate with base speed + scroll boost, TIMES direction
  const totalSpeed = (baseSpeed + spinBoost) * currentDirection;
  cloverAngle += totalSpeed;

  // Apply rotation
  if (cloverLeaves) {
    cloverLeaves.style.transform = `translate(-50%, -50%) rotate(${cloverAngle}deg)`;
  }

  requestAnimationFrame(animateClover);
}

// Update spin boost when scrolling
window.addEventListener('wheel', (e) => {
  const boost = Math.abs(e.deltaY) * 0.15;
  spinBoost = Math.min(boost, 12);
  currentDirection = e.deltaY > 0 ? 1 : -1;

  // return to default direction only when boost is calm
  scheduleSpinDirectionReset();
}, { passive: true });

function animateScrollingText() {
  const isMobile = viewportWidth < 1024;

  scrollBoost *= isMobile ? 0.90 : 0.95;

  // base speed
  const baseSpeed = isMobile ? 1.3 : 0.8;

  // current speed
  const currentSpeed = (baseSpeed + scrollBoost) * scrollingTextDirection;
  scrollingTextOffset += currentSpeed;

  // Normalize offset for looping
  const textWidth = 2000;
  const normalizedOffset = ((scrollingTextOffset % textWidth) + textWidth) % textWidth;

  if (scrollingText) scrollingText.style.transform = `translateX(-${normalizedOffset}px)`;
  requestAnimationFrame(animateScrollingText);
}

// Update scrolling text boost when scrolling
window.addEventListener('wheel', (e) => {
  const isMobile = viewportWidth < 1024;
  const boost = Math.abs(e.deltaY) * (isMobile ? 0.2 : 0.3);

  scrollBoost = Math.min(boost, isMobile ? 20 : 30);
  scrollingTextDirection = e.deltaY > 0 ? 1 : -1;

  // return to default direction only when boost is calm
  scheduleScrollDirectionReset();
}, { passive: true });

// Update layout based on scroll progress
function updateLayout() {
  const isMobile = viewportWidth < 1024;

  // Calculate dynamic styles based on scroll progress
  const titleOpacity = Math.max(0, 1 - scrollProgress * 1.3);
  const titleScale = 1 - scrollProgress * 0.15;
  const scrollingTextOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const scrollingTextTranslateY = scrollProgress * 80;

  // Clover positioning
  const CLOVER_SIZE = isMobile ? 48 : 96;
  const MIN_GAP = isMobile ? 12 : 20;

  let startX;
  let startY;
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
      baseCloverScale *= 0.95;
    } else if (viewportWidth < 1024) {
      baseCloverScale *= 0.98;
    }

    startY = heroTextRect.top + heroTextRect.height * 0.55 - 10;
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

    const minH = 520;
    const maxH = 820;
    const t = Math.max(0, Math.min(1, (viewportHeight - minH) / (maxH - minH)));
    const factor = 0.38 + (0.45 - 0.38) * t;
    startY = viewportHeight * factor;
  }

  const endY = 35;
  const endX = viewportWidth * 0.5;

  const cloverY = viewportHeight > 0 ? startY - (startY - endY) * scrollProgress : startY;
  const cloverX = viewportWidth > 0 ? startX - (startX - endX) * scrollProgress : startX;

  const finalCloverScale = baseCloverScale * (1 - scrollProgress * 0.35);

  // Work content animations
  const workContentOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.5));
  const workContentTranslateY = Math.max(0, (1 - scrollProgress) * 40);
  const headerGradientOpacity = Math.min(0.95, scrollProgress * 3);
  const bottomGradientOpacity = Math.max(0, 1 - scrollProgress * 2.5);

  if (clover) {
    clover.style.transform =
      `translate3d(${cloverX}px, ${cloverY}px, 0) translate(-50%, -50%) scale(${finalCloverScale})`;
  }

  if (mainTitle) {
    mainTitle.style.opacity = titleOpacity;
    mainTitle.style.transform = `scale(${titleScale})`;
  }

  if (scrollingTextContainer) {
    scrollingTextContainer.style.opacity = scrollingTextOpacity;
    scrollingTextContainer.style.transform = `translateY(${scrollingTextTranslateY}px)`;
  }

  if (workButton) {
    workButton.style.opacity = showWorkButton ? 1 : 0;
    workButton.style.pointerEvents = showWorkButton ? 'auto' : 'none';
  }

  if (headerGradient) headerGradient.style.opacity = headerGradientOpacity;
  if (bottomGradient) bottomGradient.style.opacity = bottomGradientOpacity;

  if (topLine) {
    topLine.style.opacity = workContentOpacity * 0.3;
    topLine.style.transform = `translateY(${workContentTranslateY}px)`;
  }

  if (projectsList) {
    projectsList.style.opacity = workContentOpacity;
    projectsList.style.transform = `translateY(${workContentTranslateY}px)`;
  }

  if (footer) footer.style.opacity = workContentOpacity;

  // Update scrolling text container width to match hero content
  if (heroContent && scrollingTextContainer) {
    scrollingTextContainer.style.width = `${heroContent.offsetWidth}px`;
  }

  // Update clover placeholder size for mobile
  if (cloverPlaceholder) {
    if (isMobile) {
      cloverPlaceholder.style.width = '52px';
      cloverPlaceholder.style.height = '52px';
    } else {
      cloverPlaceholder.style.width = '96px';
      cloverPlaceholder.style.height = '96px';
    }
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
