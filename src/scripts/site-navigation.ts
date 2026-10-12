export {};

const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const navigation = document.querySelector<HTMLElement>('[data-collapsible]');

if (toggle && navigation) {
  document.documentElement.classList.add('js-enabled');

  const closeMenu = (returnFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector<HTMLElement>('[data-menu-label]')!.textContent = 'Menu';
    navigation.dataset.open = 'false';
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.querySelector<HTMLElement>('[data-menu-label]')!.textContent = isOpen ? 'Menu' : 'Close';
    navigation.dataset.open = String(!isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 781px)').matches) closeMenu();
  });
}
