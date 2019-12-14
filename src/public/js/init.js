
// Plis nie piszcie w jQuery jeśli nie trzeba!
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  setTimeout(function () {
    alert('oko');
  }, 5000)
})

var peselPanel = document.getElementById("pesel_panel");
var dataUrodzeniaPanel = document.getElementById("data_urodzenia_panel");
var specjalizacjaPanel = document.getElementById("specjalizacja_panel");

var buttonPacjent = document.getElementById("pacjent");
function wyswietlDlaPacjenta() {
  
  peselPanel.style.visibility = "visible";
  dataUrodzeniaPanel.style.visibility = "visible";
  specjalizacjaPanel.style.visibility = "hidden";
}
buttonPacjent.onclick = wyswietlDlaPacjenta;

var buttonLekarz = document.getElementById("lekarz");
function wyswietlDlaLekarza() {
  peselPanel.style.visibility = "hidden";
  dataUrodzeniaPanel.style.visibility = "hidden";
  specjalizacjaPanel.style.visibility = "visible";
  
}
buttonLekarz.onclick = wyswietlDlaLekarza;



document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, options);
});
