/* ═══════════════════════════════════════
   LaserTag & Medals — Script condiviso
   ═══════════════════════════════════════ */

/* ── Hamburger menu mobile ── */
let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('mobMenu').classList.toggle('open', menuOpen);
}

/* ── Segna voce attiva nel navbar ── */
function setActiveNav() {
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-p]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-p') === page);
  });
}

/* ── Modal preventivo ── */
function openModal() {
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow = '';
  const fw = document.getElementById('mFormWrap');
  const ms = document.getElementById('mSuccess');
  if (fw) fw.style.display = 'block';
  if (ms) ms.style.display = 'none';
}
function submitModal() {
  document.getElementById('mFormWrap').style.display = 'none';
  document.getElementById('mSuccess').style.display = 'block';
}

/* ── Form contatti ── */
function submitContact() {
  document.getElementById('cFormWrap').style.display = 'none';
  document.getElementById('cSuccess').style.display = 'block';
}

/* ── FAQ accordion ── */
function faq(el) {
  el.parentElement.classList.toggle('open');
}

/* ── Chiudi modal cliccando overlay ── */
document.addEventListener('DOMContentLoaded', function () {
  setActiveNav();
  const overlay = document.getElementById('orderModal');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }
});
