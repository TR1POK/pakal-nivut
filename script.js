
function calculate() {
  const distance = parseFloat(document.getElementById("distance").value);
  const speed = parseFloat(document.getElementById("speed").value);
  const startTime = document.getElementById("startTime").value;
  if (!distance || !speed || !startTime) return;

  const totalHours = distance / speed;
  const [hours, minutes] = startTime.split(":").map(Number);
  const start = new Date();
  start.setHours(hours);
  start.setMinutes(minutes);

  const arrival = new Date(start.getTime() + totalHours * 60 * 60 * 1000);
  document.getElementById("result").textContent = "זמן הגעה: " + arrival.toLocaleTimeString();
}
