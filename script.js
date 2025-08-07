function hideIntro() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    updateBackground();
}

function calculate() {
    const distance = parseFloat(document.getElementById("distance").value);
    const startTime = document.getElementById("startTime").value;
    const extra = parseInt(document.getElementById("extraTime").value);
    const timeOfDay = document.getElementById("timeOfDay").value;
    const speed = timeOfDay === "day" ? 4 : 2.5;

    if (!distance || !startTime) {
        alert("נא למלא את כל השדות.");
        return;
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0);

    const durationMinutes = (distance / speed) * 60 + extra;
    const arrival = new Date(start.getTime() + durationMinutes * 60000);

    const result = arrival.toTimeString().slice(0,5);
    document.getElementById("result").innerText = `זמן הגעה משוער: ${result}`;

    addToHistory(distance, startTime, extra, speed, result);
}

function addToHistory(distance, time, extra, speed, result) {
    const table = document.getElementById("historyTable").querySelector("tbody");
    const row = table.insertRow();
    row.innerHTML = `
        <td>${distance}</td>
        <td>${time}</td>
        <td>${extra}</td>
        <td>${speed}</td>
        <td>${result}</td>
        <td><button onclick="deleteRow(this)">X</button></td>
    `;
}

function deleteRow(btn) {
    const row = btn.parentElement.parentElement;
    row.remove();
}

function share() {
    const text = document.getElementById("result").innerText;
    if (text) {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

function updateBackground() {
    const hour = new Date().getHours();
    let bg = "bg_morning.jpg";
    if (hour >= 6 && hour < 12) bg = "bg_morning.jpg";
    else if (hour >= 12 && hour < 17) bg = "bg_noon.jpg";
    else if (hour >= 17 && hour < 20) bg = "bg_sunset.jpg";
    else bg = "bg_night.jpg";

    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}