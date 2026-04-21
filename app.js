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
  const lightbox = document.querySelector('[data-signature-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-signature-lightbox-image]');
  const lightboxCloseButtons = Array.from(document.querySelectorAll('[data-signature-lightbox-close]'));

  let activeIndex = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isPointerDown = false;
  let isHorizontalSwipe = false;

  const render = (nextIndex) => {
    if (!slides.length) return;
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });
  };

  const goNext = () => render(activeIndex + 1);
  const goPrev = () => render(activeIndex - 1);

  const updateLightboxImage = () => {
    const activeImage = slides[activeIndex]?.querySelector('img');
    if (!activeImage || !lightboxImage) return;
    lightboxImage.src = activeImage.currentSrc || activeImage.src;
    lightboxImage.alt = activeImage.alt || 'Fullscreen gallery image';
  };

  const openLightbox = () => {
    if (!lightbox) return;
    updateLightboxImage();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const onSwipeStart = (clientX, clientY) => {
    isPointerDown = true;
    isHorizontalSwipe = false;
    pointerStartX = clientX;
    pointerStartY = clientY;
  };

  const onSwipeMove = (clientX, clientY, event) => {
    if (!isPointerDown) return;
    const deltaX = clientX - pointerStartX;
    const deltaY = clientY - pointerStartY;

    if (!isHorizontalSwipe && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isHorizontalSwipe = true;
    }

    if (isHorizontalSwipe && event?.cancelable) {
      event.preventDefault();
    }
  };

  const onSwipeEnd = (clientX) => {
    if (!isPointerDown) return;
    const deltaX = clientX - pointerStartX;
    if (Math.abs(deltaX) >= 45) {
      if (deltaX < 0) goNext();
      if (deltaX > 0) goPrev();
    }
    isPointerDown = false;
    isHorizontalSwipe = false;
  };

  prevButton?.addEventListener('click', goPrev);
  nextButton?.addEventListener('click', goNext);

  viewport?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('[data-signature-prev], [data-signature-next]')) return;
    openLightbox();
  });

  viewport?.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    onSwipeStart(touch.clientX, touch.clientY);
  }, { passive: true });

  viewport?.addEventListener('touchmove', (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    onSwipeMove(touch.clientX, touch.clientY, event);
  }, { passive: false });

  viewport?.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    onSwipeEnd(touch.clientX);
  }, { passive: true });

  viewport?.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') return;
    onSwipeStart(event.clientX, event.clientY);
  });

  viewport?.addEventListener('pointermove', (event) => {
    if (!isPointerDown || event.pointerType !== 'mouse') return;
    onSwipeMove(event.clientX, event.clientY, event);
  });

  viewport?.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') return;
    onSwipeEnd(event.clientX);
  });

  viewport?.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    isPointerDown = false;
    isHorizontalSwipe = false;
  });

  lightboxCloseButtons.forEach((button) => {
    button.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox?.hidden !== false) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') {
      goNext();
      updateLightboxImage();
    }
    if (event.key === 'ArrowLeft') {
      goPrev();
      updateLightboxImage();
    }
  });
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
