
// אינטרו והפעלה
function startApp(){
  document.getElementById('intro-screen').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  setBackgroundByHour();
  loadHistory();
}

// רקע לפי שעה
function setBackgroundByHour(){
  const h = new Date().getHours();
  document.body.classList.remove('morning','noon','sunset','night');
  if (h >= 6 && h < 12) document.body.classList.add('morning');
  else if (h >= 12 && h < 17) document.body.classList.add('noon');
  else if (h >= 17 && h < 20) document.body.classList.add('sunset');
  else document.body.classList.add('night');
}

// חישוב זמן הגעה
function calculate(){
  const distance = parseFloat(document.getElementById('distance').value);
  let speed = parseFloat(document.getElementById('speed').value);
  const extra = parseInt(document.getElementById('extra-time').value || '0', 10);
  const start = document.getElementById('start-time').value;
  if (!distance || !start){
    alert('נא למלא מרחק ושעת יציאה');
    return;
  }
  // אם אין מהירות – קובע לפי שעה (ברירת מחדל)
  if (isNaN(speed)){
    const h = new Date().getHours();
    speed = (h >= 6 && h < 18) ? 4 : 2.5;
  }
  const [sh, sm] = start.split(':').map(Number);
  const sDate = new Date();
  sDate.setHours(sh, sm, 0, 0);
  const minutes = (distance / speed) * 60 + extra;
  const arrival = new Date(sDate.getTime() + minutes * 60000);
  const ah = String(arrival.getHours()).padStart(2,'0');
  const am = String(arrival.getMinutes()).padStart(2,'0');
  const txt = `שעת הגעה משוערת: ${ah}:${am}`;
  document.getElementById('result').textContent = txt;
  document.getElementById('share-btn').classList.remove('hidden');
  appendRow(distance, speed, start, `${ah}:${am}`);
  saveHistory();
}

// טבלה – הוספה/מחיקה/שמירה
function appendRow(distance, speed, start, end){
  const tbody = document.getElementById('history-table');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td contenteditable="true" data-placeholder="שם שליח">—</td>
    <td>${distance}</td>
    <td>${speed}</td>
    <td>${start}</td>
    <td>${end}</td>
    <td><button class="del" onclick="delRow(this)">מחיקה</button></td>
  `;
  tbody.appendChild(tr);
}
function delRow(btn){
  btn.closest('tr').remove();
  saveHistory();
}
function saveHistory(){
  const rows = [...document.querySelectorAll('#history-table tr')].map(tr =>
    [...tr.children].slice(0,5).map(td => td.textContent)
  );
  localStorage.setItem('pn_history', JSON.stringify(rows));
}
function loadHistory(){
  const data = JSON.parse(localStorage.getItem('pn_history') || '[]');
  const tbody = document.getElementById('history-table');
  tbody.innerHTML = '';
  data.forEach(([name, dist, speed, start, end])=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td contenteditable="true">${name||'—'}</td>
      <td>${dist}</td>
      <td>${speed}</td>
      <td>${start}</td>
      <td>${end}</td>
      <td><button class="del" onclick="delRow(this)">מחיקה</button></td>
    `;
    tbody.appendChild(tr);
  });
}
document.getElementById('clear-history')?.addEventListener('click', ()=>{
  localStorage.removeItem('pn_history');
  loadHistory();
});

// שיתוף וואטסאפ
function shareWhatsApp(){
  const r = document.getElementById('result').textContent.trim();
  if (!r) { alert('אין תוצאה לשיתוף'); return; }
  window.open(`https://wa.me/?text=${encodeURIComponent(r)}`, '_blank');
}

// מצפן (גרסה פשוטה – תצוגת תמונה; אפשר לשדרג ל-deviceorientation)
function openCompass(){ document.getElementById('compass-popup').classList.remove('hidden'); }
function closeCompass(){ document.getElementById('compass-popup').classList.add('hidden'); }

// אירועי UI
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('start-btn').addEventListener('click', startApp);
  document.getElementById('calculate-btn').addEventListener('click', calculate);
  document.getElementById('share-btn').addEventListener('click', shareWhatsApp);
  document.getElementById('close-compass').addEventListener('click', closeCompass);
  // כפתור מצפן זמני: דאבל-קליק על הכותרת הראשית פותח מצפן
  document.querySelector('#calculator h2').addEventListener('dblclick', openCompass);
  // קבע רקע גם אם האינטרו עדיין פתוח (כשנטען)
  setBackgroundByHour();
});

// PWA – רישום SW
if ('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}
