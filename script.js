
function initializePage() {
  const hour = new Date().getHours();
  let bg = 'black';
  if (hour >= 6 && hour < 12) bg = '#ffff99';
  else if (hour >= 12 && hour < 18) bg = '#ffcc99';
  else if (hour >= 18 && hour < 20) bg = '#ff9999';
  document.body.style.backgroundColor = bg;

  loadHistory();
}

function calculate() {
  const distance = parseFloat(document.getElementById("distance").value);
  const speed = parseFloat(document.getElementById("speed").value);
  const startTime = document.getElementById("startTime").value;
  const extra = parseFloat(document.getElementById("extraTime").value) || 0;

  if (!distance || !speed || !startTime) return;

  const [hours, minutes] = startTime.split(":").map(Number);
  const start = new Date();
  start.setHours(hours);
  start.setMinutes(minutes);

  const totalMinutes = (distance / speed) * 60 + extra;
  const arrival = new Date(start.getTime() + totalMinutes * 60000);
  const arrivalTime = arrival.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  document.getElementById("result").textContent = "זמן הגעה: " + arrivalTime;

  const row = document.createElement("tr");
  row.innerHTML = `<td>שליח</td><td>${distance}</td><td>${arrivalTime}</td><td><button onclick="this.parentElement.parentElement.remove(); saveHistory();">X</button></td>`;
  document.querySelector("#history tbody").appendChild(row);
  saveHistory();
}

function shareWhatsapp() {
  const text = document.getElementById("result").textContent;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function saveHistory() {
  const rows = Array.from(document.querySelectorAll("#history tbody tr"));
  const data = rows.map(row => row.innerHTML);
  localStorage.setItem("history", JSON.stringify(data));
}

function loadHistory() {
  const data = JSON.parse(localStorage.getItem("history") || "[]");
  const tbody = document.querySelector("#history tbody");
  data.forEach(html => {
    const row = document.createElement("tr");
    row.innerHTML = html;
    tbody.appendChild(row);
  });
}

function clearTable() {
  document.querySelector("#history tbody").innerHTML = "";
  localStorage.removeItem("history");
}
