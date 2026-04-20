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