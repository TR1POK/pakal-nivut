function initPage() {
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
    updateBackground();
    loadHistory();
  }, 2000);
}

function updateBackground() {
  const hour = new Date().getHours();
  let bg = 'bg-night.jpg';
  if (hour >= 6 && hour < 12) bg = 'bg-morning.jpg';
  else if (hour >= 12 && hour < 17) bg = 'bg-day.jpg';
  else if (hour >= 17 && hour < 20) bg = 'bg-evening.jpg';
  document.body.style.backgroundImage = `url('${bg}')`;
}

function calculateArrival() {
  const distance = parseFloat(document.getElementById('distance').value);
  const speed = parseFloat(document.getElementById('speed').value);
  const extraTime = parseFloat(document.getElementById('extraTime').value || 0);
  const startTime = document.getElementById('startTime').value;

  if (isNaN(distance) || isNaN(speed) || !startTime) {
    alert("נא למלא את כל השדות");
    return;
  }

  const travelTimeHours = distance / speed + extraTime / 60;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const arrivalDate = new Date();
  arrivalDate.setHours(startHour, startMinute + travelTimeHours * 60);
  const result = `זמן הגעה משוער: ${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`;
  document.getElementById('result').innerText = result;
  addToHistory(distance, speed, extraTime, startTime, result);
}

function addToHistory(distance, speed, extra, time, result) {
  const table = document.getElementById('historyTable').querySelector('tbody');
  const row = table.insertRow();
  row.innerHTML = `<td>${distance}</td><td>${speed}</td><td>${extra}</td><td>${time}</td><td>${result}</td><td><button onclick="this.parentElement.parentElement.remove()">❌</button></td>`;
}

function shareToWhatsapp() {
  const resultText = document.getElementById('result').innerText;
  if (!resultText) return;
  const url = `https://wa.me/?text=${encodeURIComponent(resultText)}`;
  window.open(url, '_blank');
}