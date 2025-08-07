document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("intro-screen").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("intro-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
  }, 3000);
});