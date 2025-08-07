// ===== Helper Functions =====
const pad = n => String(n).padStart(2, '0');

// ===== Clock =====
function tickClock() {
  const el = document.getElementById('currentTime');
  if (!el) return;
  const d = new Date();
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
setInterval(tickClock, 1000);
tickClock();

// ===== Background by Hour =====
function setBg() {
  const h = new Date().getHours();
  document.body.classList.remove('morning', 'noon', 'evening', 'night');
  if (h >= 6 && h < 12) document.body.classList.add('morning');
  else if (h >= 12 && h < 17) document.body.classList.add('noon');
  else if (h >= 17 && h < 20) document.body.classList.add('evening');
  else document.body.classList.add('night');
}
setBg();

// ===== Start App =====
function startApp(e) {
  if (e) e.preventDefault();
  const intro = document.getElementById('intro');
  if (intro) {
    intro.classList.add('hide');
    setTimeout(() => intro.remove(), 450);
  }
  document.getElementById('app')?.removeAttribute('hidden');
  document.getElementById('distance')?.focus();
}

// ===== Auto Speed by Time =====
function autoSpeed() {
  const h = new Date().getHours();
  return (h >= 6 && h < 18) ? 4 : 2.5;
}

// ===== Calculate Arrival =====
function calculate() {
  const dist = parseFloat(document.getElementById('distance').value);
  let spd = parseFloat(document.getElementById('speed').value);
  const extraEnabled = document.getElementById('extraToggle').checked;
  const extra = extraEnabled ? parseInt(document.getElementById('extra').value || '0', 10) : 0;
  const startVal = document.getElementById('startTime').value;

  if (!dist || dist <= 0) {
    showResult('נא להזין מרחק חיובי', true);
    return;
  }
  if (isNaN(spd) || spd <= 0) spd = autoSpeed();

  const start = new Date();
  if (startVal) {
    const [hh, mm] = startVal.split(':').map(Number);
    start.setHours(hh, mm, 0, 0);
  }

  const minutes = (dist / spd) * 60 + extra;
  const arrive = new Date(start.getTime() + minutes * 60000);
  const out = `זמן הגעה משוער: ${pad(arrive.getHours())}:${pad(arrive.getMinutes())}`;
  showResult(out, false);
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });

  const row = {
    unit: document.getElementById('unit').value.trim() || '-',
    name: document.getElementById('name').value.trim() || '-',
    distance: +dist.toFixed(2),
    speed: +spd.toFixed(2),
    extra: extra,
    start: startVal ? `${pad(start.getHours())}:${pad(start.getMinutes())}` : 'כעת',
    arrive: `${pad(arrive.getHours())}:${pad(arrive.getMinutes())}`
  };

  const arr = JSON.parse(localStorage.getItem('navHistory') || '[]');
  arr.push(row);
  localStorage.setItem('navHistory', JSON.stringify(arr));
  renderTable();

  const shareBtn = document.getElementById('share');
  if (shareBtn) {
    shareBtn.disabled = false;
    shareBtn.onclick = () => shareWhatsApp(row);
  }
}

// ===== Show Result =====
function showResult(text, isErr) {
  const el = document.getElementById('result');
  el.textContent = text;
  el.style.color = isErr ? '#ff9aa2' : '#3ee58d';
}

// ===== Table Functions =====
function renderTable() {
  const tbody = document.querySelector('#historyTable tbody');
  const arr = JSON.parse(localStorage.getItem('navHistory') || '[]');
  tbody.innerHTML = arr.map(r => `
    <tr>
      <td>${r.unit}</td><td>${r.name}</td><td>${r.distance}</td>
      <td>${r.speed}</td><td>${r.extra}</td><td>${r.start}</td><td>${r.arrive}</td>
    </tr>`).join('');
}
renderTable();

function clearTable() {
  if (!confirm('לנקות את הטבלה?')) return;
  localStorage.removeItem('navHistory');
  renderTable();
}

// ===== Share to WhatsApp =====
function shareWhatsApp(r) {
  const t = [
    '*פק"ל ניווט – תוצאה*',
    `*חוליה:* ${r.unit}`,
    `*שם:* ${r.name}`,
    `*מרחק:* ${r.distance} ק"מ`,
    `*מהירות:* ${r.speed} קמ"ש`,
    `*תוספת:* ${r.extra} דק׳`,
    `*יציאה:* ${r.start}`,
    `*הגעה:* ${r.arrive}`
  ].join('\n');
  window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('start-button'); // ← תואם ל־HTML
  if (btn) btn.addEventListener('click', startApp, { passive: true });

  const extraToggle = document.getElementById('extraToggle');
  const extra = document.getElementById('extra');
  if (extraToggle && extra) {
    extraToggle.addEventListener('change', () => {
      extra.disabled = !extraToggle.checked;
      if (!extraToggle.checked) extra.value = 0;
    });
  }

  document.getElementById('calc')?.addEventListener('click', calculate);
  document.getElementById('toggleTable')?.addEventListener('click', () => {
    const wrap = document.getElementById('tableWrap');
    wrap.hidden = !wrap.hidden;
  });
  document.getElementById('clearTable')?.addEventListener('click', clearTable);
});
