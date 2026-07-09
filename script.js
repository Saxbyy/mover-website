/* =========================================================
   Movers Institute of Technology and Education — site interactions
   Vanilla JS, no dependencies.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     0. Hero image carousel
  ----------------------------------------------------- */
  const heroSlider = document.getElementById('hero-slider');
  const slides = heroSlider ? Array.from(heroSlider.querySelectorAll('.hero__slide')) : [];
  const dots = heroSlider ? Array.from(heroSlider.querySelectorAll('.hero__dot')) : [];
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  let currentSlide = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000; // ms between automatic slide changes

  function goToSlide(index) {
    if (!slides.length) return;
    // Wrap around so index always lands within [0, slides.length - 1]
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentSlide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-selected', String(i === currentSlide));
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (slides.length) {
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(Number(dot.dataset.slide));
        startAutoplay();
      });
    });

    // Pause autoplay while the user's mouse is over the hero
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* -----------------------------------------------------
     1. Mobile burger menu toggle
  ----------------------------------------------------- */
  const burger = document.getElementById('burger-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      burger.classList.toggle('is-active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));

      // Close the search panel if it happens to be open, to avoid
      // two expandable panels being open at once on small screens.
      closeSearch();
    });

    // Close the mobile menu whenever a link inside it is clicked
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------
     2. Search panel toggle
  ----------------------------------------------------- */
  const searchToggle = document.getElementById('search-toggle');
  const searchPanel = document.getElementById('search-panel');

  function closeSearch() {
    if (searchPanel && searchPanel.classList.contains('is-open')) {
      searchPanel.classList.remove('is-open');
      searchToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      const isOpen = searchPanel.classList.toggle('is-open');
      searchToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        // Move focus into the search field for keyboard users
        const input = searchPanel.querySelector('input');
        if (input) input.focus();
      }
    });
  }

  /* -----------------------------------------------------
     3. Sticky header — add a shadow once the page scrolls
  ----------------------------------------------------- */
  const header = document.getElementById('site-header');

  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* -----------------------------------------------------
     4. Auto-update copyright year in the footer
  ----------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------
     5. Close mobile nav / search on Escape key
  ----------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      }
    }
  });

});