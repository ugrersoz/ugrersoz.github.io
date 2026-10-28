const portraitFlip = document.querySelector('.portrait-flip');
portraitFlip.addEventListener('click', () => {
 portraitFlip.setAttribute('aria-pressed', String(portraitFlip.getAttribute('aria-pressed') !== 'true'));
});
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
let previousFocus;
function openModal(source) {
 previousFocus = document.activeElement;
 modalImage.src = typeof source === 'string' ? source : source.src;
 modalImage.alt = typeof source === 'string' ? (window.portfolioI18n?.message('certificate') || 'Certificate preview') : source.alt;
 modal.showModal(); document.body.style.overflow = 'hidden';
}
function closeModal() { modal.close(); }
modal.querySelector('.close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if(event.target === modal) closeModal(); });
modal.addEventListener('close', () => { document.body.style.overflow = ''; previousFocus?.focus(); });
document.querySelectorAll('img[data-preview]').forEach(img => {
 const button = document.createElement('button'); button.type = 'button'; button.className = 'image-preview';
 button.setAttribute('aria-label', 'Enlarge: ' + img.alt); img.removeAttribute('data-preview');
 img.before(button); button.append(img); button.addEventListener('click', () => openModal(img));
});
const navLinks = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => {
   const current = link.hash === '#' + entry.target.id;
   if(current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  }); });
 }, {rootMargin: '-10% 0px -65% 0px', threshold: 0});
 document.querySelectorAll('main > section').forEach(section => observer.observe(section));
}

document.querySelectorAll('button[data-preview-src]').forEach(button => {
 button.addEventListener('click', () => openModal(button.dataset.previewSrc));
});
