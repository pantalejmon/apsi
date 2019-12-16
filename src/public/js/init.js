
// Plis nie piszcie w jQuery jeśli nie trzeba!
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  // Komentuje to bo strasznie drażni xd
  // setTimeout(function () {
  //   alert('oko');
  // }, 5000)
})

var peselPanel = document.getElementById("pesel_panel");
var dataUrodzeniaPanel = document.getElementById("data_urodzenia_panel");
var specjalizacjaPanel = document.getElementById("specjalizacja_panel");

var buttonPacjent = document.getElementById("pacjent");
function wyswietlDlaPacjenta() {

  peselPanel.style.display = "inline";
  dataUrodzeniaPanel.style.display = "inline";
  specjalizacjaPanel.style.display = "none";
}
buttonPacjent.onclick = wyswietlDlaPacjenta;

var buttonLekarz = document.getElementById("lekarz");
function wyswietlDlaLekarza() {
  peselPanel.style.display = "none";
  dataUrodzeniaPanel.style.display = "none";
  specjalizacjaPanel.style.display = "inline";

}
buttonLekarz.onclick = wyswietlDlaLekarza;



document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, options);
});

/**
 * 
 * @param {*} str 
 */
function changeActiveMenuItem(str) {
  const allLi = document.getElementsByTagName("li");
  for (let t of allLi) {
    t.classList.remove("active");
  }
  document.getElementById(str).classList.add("active");
}