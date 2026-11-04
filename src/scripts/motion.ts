import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | undefined;

/* ---------- smooth scroll ---------- */
if (!reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- hero entrance + sticker parallax ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && !reduceMotion) {
  const tl = gsap.timeline({ defaults: { ease: 'back.out(1.8)' } });
  tl.from('[data-hero-letter]', { yPercent: 120, rotate: () => gsap.utils.random(-25, 25), duration: 0.9, stagger: 0.08 })
    .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
    .from('.hero__sun', { scale: 0.4, opacity: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)' }, 0.1)
    .from('[data-sticker]', { y: 80, scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.3);

  // Gentle bob so the stickers feel alive.
  gsap.utils.toArray<HTMLElement>('[data-sticker]').forEach((el, i) => {
    gsap.to(el, { y: '+=10', duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
  });

  if (finePointer) {
    const stickers = gsap.utils.toArray<HTMLElement>('[data-sticker]').map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      r: gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' }),
      depth: Number(el.dataset.depth ?? 1),
    }));
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      stickers.forEach((s) => {
        s.x(nx * 40 * s.depth);
        s.r(nx * 6 * s.depth);
      });
    });
  }

  // Sun drifts and stickers spread as you scroll past the hero.
  gsap.to('.hero__sun', {
    yPercent: 25,
    rotate: 40,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------- reveal on scroll ---------- */
if (!reduceMotion) {
  ScrollTrigger.batch('[data-tile]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, {
        y: 70,
        opacity: 0,
        rotate: () => gsap.utils.random(-8, 8),
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        clearProps: 'transform,opacity',
      }),
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, i) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 0.8, delay: 0.1 + i * 0.12, ease: 'power3.out' });
  });
}

/* ---------- category filters ---------- */
const filters = document.querySelector<HTMLElement>('[data-filters]');
if (filters) {
  const buttons = [...filters.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const tiles = [...document.querySelectorAll<HTMLElement>('[data-tile]')];

  const apply = (key: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
    tiles.forEach((t) => (t.hidden = key !== 'all' && t.dataset.category !== key));
    if (!reduceMotion) ScrollTrigger.refresh();
  };

  filters.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    const key = btn.dataset.filter!;
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(() => apply(key));
    } else {
      apply(key);
    }
  });
}

/* ---------- lightbox ---------- */
const grid = document.querySelector('[data-grid]');
if (grid) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '[data-grid]',
    children: 'li:not([hidden]) a',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.94,
    showHideAnimationType: reduceMotion ? 'none' : 'zoom',
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        pswp.on('change', () => {
          const a = pswp.currSlide?.data.element as HTMLElement | undefined;
          const title = a?.dataset.caption ?? '';
          const sub = a?.dataset.sub ?? '';
          el.innerHTML = '';
          const t = document.createElement('strong');
          t.textContent = title;
          el.append(t);
          if (sub) {
            const s = document.createElement('span');
            s.textContent = sub;
            el.append(s);
          }
        });
      },
    });
  });

  lightbox.on('openingAnimationStart', () => lenis?.stop());
  lightbox.on('destroy', () => lenis?.start());
  lightbox.init();
}
