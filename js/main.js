/* ═══════════════════════════════════════════════════════
   Fratelli Terragni Incisioni — Script condiviso
   ═══════════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY  = 'xRfdKtsteWPiFFkWR';
const EMAILJS_SERVICE_ID  = 'service_oxjy085';
const EMAILJS_TEMPLATE_ID = 'template_6bxasr3';

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

/* ── Modal preventivo — apri/chiudi ── */
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
  ['m-nome','m-email','m-testo','m-quantita'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const fileInput = document.getElementById('m-file');
  if (fileInput) fileInput.value = '';
  const fileInfo = document.getElementById('mFileInfo');
  if (fileInfo) fileInfo.textContent = '';
  const fileDrop = document.getElementById('mFileDrop');
  if (fileDrop) { fileDrop.style.borderColor = 'rgba(201,168,76,0.35)'; fileDrop.style.borderStyle = 'dashed'; fileDrop.style.background = 'rgba(255,255,255,0.02)'; }
  showModalError('');
}

/* ── Gestione selezione file ── */
function handleFileChange() {
  const input = document.getElementById('m-file');
  const info  = document.getElementById('mFileInfo');
  const drop  = document.getElementById('mFileDrop');
  if (!input || !input.files.length) return;
  const file = input.files[0];
  if (file.size > 5 * 1024 * 1024) {
    showModalError('Il file supera i 5 MB. Scegli un file più piccolo.');
    input.value = '';
    if (info) info.textContent = '';
    return;
  }
  if (info) info.textContent = '✓ ' + file.name;
  if (drop) { drop.style.borderColor = '#C9A84C'; drop.style.borderStyle = 'solid'; drop.style.background = 'rgba(201,168,76,0.07)'; }
  showModalError('');
}

/* ── Mostra/nascondi messaggio errore ── */
function showModalError(msg) {
  const el = document.getElementById('mErrMsg');
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

/* ── Converti file in base64 ── */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Lettura file fallita'));
    reader.readAsDataURL(file);
  });
}

/* ── Invio form via EmailJS ── */
async function submitModal() {
  const nome      = (document.getElementById('m-nome')      || {}).value || '';
  const email     = (document.getElementById('m-email')     || {}).value || '';
  const prodotto  = (document.getElementById('m-prodotto')  || {}).value || '';
  const testo     = (document.getElementById('m-testo')     || {}).value || '';
  const materiale = (document.getElementById('m-materiale') || {}).value || '';
  const quantita  = (document.getElementById('m-quantita')  || {}).value || '1';
  const fileInput = document.getElementById('m-file');

  if (!nome.trim()) { showModalError('Inserisci il tuo nome.'); return; }
  if (!email.trim() || !email.includes('@')) { showModalError("Inserisci un'email valida."); return; }

  const btn = document.getElementById('mSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }
  showModalError('');

  try {
    const params = {
      from_name    : nome,
      from_email   : email,
      prodotto     : prodotto,
      testo        : testo || '—',
      materiale    : materiale,
      quantita     : quantita,
      allegato     : '',
      allegato_nome: 'Nessun file allegato',
    };

    if (fileInput && fileInput.files.length) {
      try {
        params.allegato      = await fileToBase64(fileInput.files[0]);
        params.allegato_nome = fileInput.files[0].name;
      } catch (e) { console.warn('File non allegato:', e); }
    }

    const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    console.log('EmailJS OK:', result);

    document.getElementById('mFormWrap').style.display = 'none';
    document.getElementById('mSuccess').style.display  = 'block';

  } catch (err) {
    console.error('EmailJS ERRORE:', err);
    showModalError('Errore invio: ' + (err.text || err.message || JSON.stringify(err)));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Invia richiesta →'; }
  }
}

/* ── Form contatti ── */
function submitContact() {
  document.getElementById('cFormWrap').style.display = 'none';
  document.getElementById('cSuccess').style.display  = 'block';
}

/* ── FAQ accordion ── */
function faq(el) {
  el.parentElement.classList.toggle('open');
}

/* ── Init al caricamento pagina ── */
window.addEventListener('load', function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  setActiveNav();

  const fileInput = document.getElementById('m-file');
  if (fileInput) fileInput.addEventListener('change', handleFileChange);

  const overlay = document.getElementById('orderModal');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }
});
