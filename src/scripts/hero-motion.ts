export {};

const scene = document.querySelector<HTMLElement>('[data-hero-scene]');
const beatItems = [...document.querySelectorAll<HTMLElement>('[data-hero-beat]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (scene && beatItems.length) {
  let intersecting = false;
  let elapsed = 0;
  let lastTime: number | undefined;
  let frame = 0;
  let settled = false;
  const steps = [0, 760, 1580, 2500, 3500];
  const order = ['request', 'review', 'ledger', 'customer'];

  const clear = () => {
    for (const item of beatItems) delete item.dataset.emphasis;
    delete scene.dataset.activeBeat;
  };

  const settle = () => {
    cancelAnimationFrame(frame);
    clear();
    settled = true;
    observer.disconnect();
  };

  const paint = (active: string) => {
    scene.dataset.activeBeat = active;
    for (const item of beatItems) item.dataset.emphasis = String(item.dataset.heroBeat === active);
  };

  const tick = (time: number) => {
    if (!intersecting || document.hidden || reducedMotion.matches || settled) {
      lastTime = undefined;
      return;
    }

    if (lastTime !== undefined) elapsed += time - lastTime;
    lastTime = time;
    if (elapsed >= steps.at(-1)!) {
      settle();
      return;
    }

    const step = steps.findLastIndex((start) => elapsed >= start);
    if (step >= 0 && step < order.length) paint(order[step]!);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!intersecting || document.hidden || reducedMotion.matches || settled) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(([entry]) => {
    intersecting = entry?.isIntersecting ?? false;
    if (!intersecting) lastTime = undefined;
    else start();
  }, { threshold: 0.25 });

  observer.observe(scene);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) lastTime = undefined;
    else start();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      lastTime = undefined;
      clear();
    } else start();
  });
}
