document.getElementById("navigation-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const distance = parseFloat(document.getElementById("distance").value);
  const speed = parseFloat(document.getElementById("speed").value);
  const additional = parseFloat(document.getElementById("additional-time").value);
  const startTime = document.getElementById("start-time").value;

  if (!distance || !speed || !additional || !startTime) {
    document.getElementById("result").innerText = "יש למלא את כל השדות";
    return;
  }

  const travelTimeMinutes = (distance / speed) * 60 + additional;
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + travelTimeMinutes;
  const arrivalHour = Math.floor(totalMinutes / 60) % 24;
  const arrivalMinute = Math.round(totalMinutes % 60);
  const arrivalFormatted = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;

  document.getElementById("result").innerText = `שעת ההגעה היא: ${arrivalFormatted}`;
});