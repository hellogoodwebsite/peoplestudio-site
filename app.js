const navToggle = document.querySelector('[data-nav-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const mobileHero = document.querySelector('[data-mobile-hero]');
if (mobileHero) {
  const slides = Array.from(mobileHero.querySelectorAll('[data-mobile-slide]'));
  const dots = Array.from(mobileHero.querySelectorAll('[data-mobile-dot]'));
  let index = 0;

  const showSlide = (next) => {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === next));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === next));
  };

  if (slides.length > 1) {
    setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 3500);
  }
}


const signatureGallery = document.querySelector('[data-signature-gallery]');
if (signatureGallery) {
  const slides = Array.from(signatureGallery.querySelectorAll('[data-signature-slide]'));
  const prevButton = signatureGallery.querySelector('[data-signature-prev]');
  const nextButton = signatureGallery.querySelector('[data-signature-next]');
  const viewport = signatureGallery.querySelector('[data-signature-viewport]');
  let activeIndex = 0;
  let touchStartX = 0;

  const render = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });
  };

  const goNext = () => render(activeIndex + 1);
  const goPrev = () => render(activeIndex - 1);

  prevButton?.addEventListener('click', goPrev);
  nextButton?.addEventListener('click', goNext);

  viewport?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  viewport?.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) < 45) return;
    if (deltaX < 0) goNext();
    if (deltaX > 0) goPrev();
  }, { passive: true });
}

const filters = Array.from(document.querySelectorAll('[data-filter]'));
const galleryGroups = Array.from(document.querySelectorAll('.portfolio-group[data-category]'));

if (filters.length && galleryGroups.length) {
  const setFilter = (filterValue) => {
    filters.forEach((filterBtn) => {
      const active = filterBtn.dataset.filter === filterValue;
      filterBtn.classList.toggle('is-active', active);
      filterBtn.setAttribute('aria-selected', String(active));
    });

    galleryGroups.forEach((group) => {
      const categories = (group.dataset.category || '').split(/\s+/);
      const visible = filterValue === 'all' || categories.includes(filterValue);
      group.hidden = !visible;
    });
  };

  filters.forEach((filterBtn) => {
    filterBtn.addEventListener('click', () => setFilter(filterBtn.dataset.filter));
  });
}

const lightbox = document.querySelector('[data-lightbox]');
if (lightbox) {
  const triggerItems = Array.from(document.querySelectorAll('[data-lightbox-item]'));
  const closeButtons = Array.from(document.querySelectorAll('[data-lightbox-close]'));
  const nextButton = lightbox.querySelector('[data-lightbox-next]');
  const prevButton = lightbox.querySelector('[data-lightbox-prev]');
  const lightboxImg = lightbox.querySelector('[data-lightbox-image]');
  const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');
  const lightboxSurface = lightbox.querySelector('[data-lightbox-surface]');

  let activeItems = triggerItems;
  let activeIndex = 0;
  let touchStartX = 0;

  const updateSource = () => {
    const item = activeItems[activeIndex];
    if (!item) return;
    lightboxImg.src = item.dataset.full || '';
    lightboxImg.alt = item.dataset.alt || '';
    lightboxCaption.textContent = item.dataset.caption || '';
  };

  const openLightbox = (clicked) => {
    const visibleItems = triggerItems.filter((item) => !item.closest('.portfolio-group')?.hidden);
    activeItems = visibleItems.length ? visibleItems : triggerItems;
    activeIndex = Math.max(activeItems.indexOf(clicked), 0);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    updateSource();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const goNext = () => {
    activeIndex = (activeIndex + 1) % activeItems.length;
    updateSource();
  };

  const goPrev = () => {
    activeIndex = (activeIndex - 1 + activeItems.length) % activeItems.length;
    updateSource();
  };

  triggerItems.forEach((item) => item.addEventListener('click', () => openLightbox(item)));
  closeButtons.forEach((button) => button.addEventListener('click', closeLightbox));
  nextButton?.addEventListener('click', goNext);
  prevButton?.addEventListener('click', goPrev);

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') goNext();
    if (event.key === 'ArrowLeft') goPrev();
  });

  lightboxSurface?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  lightboxSurface?.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const deltaX = endX - touchStartX;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) goNext();
    if (deltaX > 0) goPrev();
  }, { passive: true });
}
