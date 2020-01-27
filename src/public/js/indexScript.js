/**
 * Tutaj nie ruszamy
 */
document.addEventListener('DOMContentLoaded', function () {
  main();
})

/**
 * Główna funkcja, tutaj dodajemy skrypty które mają się wywołać po załadowaniu strony
 */
function main() {
  sidenavInit();
}

function sidenavInit() {
  let elems = document.querySelectorAll('.sidenav');
  let instances = M.Sidenav.init(elems);
}

/**
 * {HANDLER}
 * Zmienia poświetlenie konkretnego przycisku w menu po prawej stronie
 * @param {*} str 
 */
function changeActiveMenuItem(str) {
  const allLi = document.getElementsByTagName("li");
  for (let t of allLi) {
    t.classList.remove("active");
  }
  document.getElementById(str).classList.add("active");
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(function () {
      console.log("Service Worker Registered");
    });
  }
}