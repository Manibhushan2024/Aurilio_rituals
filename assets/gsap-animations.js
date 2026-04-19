/* Aurilio Rituals — GSAP premium animations */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero entrance ── */
  const heroEyebrow  = document.querySelector('.hero-banner__eyebrow');
  const heroHeading  = document.querySelector('.hero-banner__heading');
  const heroSub      = document.querySelector('.hero-banner__subheading');
  const heroCtas     = document.querySelector('.hero-banner__ctas');

  if (heroHeading) {
    const heroTl = gsap.timeline({ delay: 0.2 });
    if (heroEyebrow) heroTl.from(heroEyebrow, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
    heroTl
      .from(heroHeading, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
      .from(heroSub,     { y: 24, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from(heroCtas,    { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }

  /* ── Scroll-triggered fade-up (replaces CSS-only version) ── */
  gsap.utils.toArray('.animate-fade-up').forEach(function (el) {
    gsap.fromTo(el,
      { y: 32, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ── Staggered collection cards ── */
  const cardGroups = document.querySelectorAll('.collection-cards__grid, .gifting-cards__grid, .product-grid');
  cardGroups.forEach(function (grid) {
    const cards = grid.querySelectorAll('.collection-card, .gifting-card, .product-card');
    gsap.fromTo(cards,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ── Animated stat counters ── */
  document.querySelectorAll('.stat-counter').forEach(function (el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.2,
          ease: 'power1.inOut',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val).toLocaleString('en-IN');
          }
        });
      }
    });
  });

  /* ── Parallax hero image ── */
  const heroBg = document.querySelector('.hero-banner__bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-banner', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ── Section image parallax ── */
  document.querySelectorAll('.parallax-img').forEach(function (img) {
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('section') || img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });

  /* ── Process steps stagger ── */
  const stepsGrid = document.querySelector('.process-steps__grid');
  if (stepsGrid) {
    gsap.fromTo(stepsGrid.querySelectorAll('.process-step'),
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.15,
        scrollTrigger: { trigger: stepsGrid, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Marquee pause on hover ── */
  document.querySelectorAll('.marquee__inner').forEach(function (track) {
    track.addEventListener('mouseenter', function () { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', function () { track.style.animationPlayState = 'running'; });
  });
});
