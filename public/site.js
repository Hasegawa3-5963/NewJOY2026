const button = document.querySelector('.menu-button');
const nav = document.querySelector('.global-nav');
if (button && nav) {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
}

document.querySelectorAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('details[open]').forEach((other) => {
      if (other !== item && other.closest('.faq-list') === item.closest('.faq-list')) other.open = false;
    });
  });
});
