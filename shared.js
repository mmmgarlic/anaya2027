/* shared.js */

          
(() => {
  // blunt config
  const HOME_FROM_PROJECT = '../index.html';
  const HOME_FROM_ROOT = 'index.html';

  const orderedProjects = [
    'wayfarer.html',
    'sharpcheddar.html',
    'onthegroove.html',
    'theritual.html',
    'goodnotes.html',
    'thirstyrobots.html'
  ];

  const clover = document.getElementById('clover');
  const leaves = document.getElementById('cloverLeaves');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');

  const isProjectPage = window.location.pathname.includes('/projects/');
  const filename = window.location.pathname.split('/').pop();

  const getContainer = () => document.getElementById('container');

  function goHome() {
    window.location.href = isProjectPage ? HOME_FROM_PROJECT : HOME_FROM_ROOT;
  }

  function getNeighbors() {
    const i = orderedProjects.indexOf(filename);
    if (i === -1) return { prev: null, next: null };
    return {
      prev: orderedProjects[i - 1] || null,
      next: orderedProjects[i + 1] || null
    };
  }

  function goToProject(file) {
    if (!file) return;
    window.location.href = `./${file}`;
  }

  // clover click = home
  if (clover) clover.addEventListener('click', goHome);

  // arrows
  const { prev, next } = getNeighbors();

  if (prevBtn) {
    if (!prev) prevBtn.classList.add('is-disabled');
    prevBtn.addEventListener('click', () => goToProject(prev));
  }

  if (nextBtn) {
    if (!next) nextBtn.classList.add('is-disabled');
    nextBtn.addEventListener('click', () => goToProject(next));
  }

  // keyboard arrows
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToProject(prev);
    if (e.key === 'ArrowRight') goToProject(next);
    if (e.key === 'Escape') goHome();
  });

  // clover rotation: auto + scroll
  if (leaves) {
    let autoA = 0;
    let scrollA = 0;
    let lastScrollTop = 0;

    const getScrollTop = () => {
      const c = getContainer();
      return c ? c.scrollTop : window.scrollY || 0;
    };

    lastScrollTop = getScrollTop();

    const onScroll = () => {
      const st = getScrollTop();
      const delta = st - lastScrollTop;
      lastScrollTop = st;

      // tune this: bigger = more spin per scroll
      scrollA += delta * 0.25;
    };

    const scrollTarget = getContainer() || window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      autoA += 0.35;
      const total = autoA + scrollA;
      leaves.style.transform = `translate(-50%, -50%) rotate(${total}deg)`;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
})();

// project pages: force clover + header gradient to match homepage "work view" state
(() => {
  if (!document.body.classList.contains('project-page')) return;

  const container = document.getElementById('container');
  const clover = document.getElementById('clover');
  const headerGradient = document.getElementById('headerGradient');

  if (container) container.scrollTop = 0;

  const applyWorkViewClover = () => {
    if (!clover) return;

    const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const isMobile = viewportWidth < 1024;

    let baseCloverScale = 1.0;
    if (viewportWidth < 805) baseCloverScale = 0.6;
    else if (viewportWidth < 1024) baseCloverScale = 0.85;

    const finalCloverScale = baseCloverScale * 0.65;
    const endX = viewportWidth * 0.5;
    const endY = isMobile ? 22 : 35;

    clover.style.transform =
      `translate3d(${endX}px, ${endY}px, 0) translate(-50%, -50%) scale(${finalCloverScale})`;
  };

  // stop the "fly-in" on first paint, but keep transitions after
  if (clover) {
    const prevTransition = clover.style.transition;
    clover.style.transition = 'none';
    applyWorkViewClover();

    requestAnimationFrame(() => {
      clover.style.transition = prevTransition; // falls back to your css transition
    });
  } else {
    applyWorkViewClover();
  }

  window.addEventListener('resize', applyWorkViewClover);

  if (headerGradient) headerGradient.style.opacity = '0.95';
})();

// info page: pin clover to the "default top" position (no fly-in / no script.js dependency)
(() => {
  const clover = document.getElementById('clover');
  if (!clover) return;

  const filename = window.location.pathname.split('/').pop();
  const isInfoPage = filename === 'info.html';
  if (!isInfoPage) return;

  const applyStaticClover = () => {
    const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const isMobile = viewportWidth < 1024;

    let baseCloverScale = 1.0;
    if (viewportWidth < 805) baseCloverScale = 0.6;
    else if (viewportWidth < 1024) baseCloverScale = 0.85;

    // match the project-page "work view" clover values
    const finalCloverScale = baseCloverScale * 0.65;
    const endX = viewportWidth * 0.5;
    const endY = isMobile ? 22 : 35;

    clover.style.transform =
      `translate3d(${endX}px, ${endY}px, 0) translate(-50%, -50%) scale(${finalCloverScale})`;
  };

  // IMPORTANT: kill any transition so it doesn't "fly in"
  const prevTransition = clover.style.transition;
  clover.style.transition = 'none';
  applyStaticClover();

  requestAnimationFrame(() => {
    clover.style.transition = prevTransition; // restore for other interactions
  });

  window.addEventListener('resize', applyStaticClover);
})();
