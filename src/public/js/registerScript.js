/**
 * Tutaj nie ruszamy
 */
document.addEventListener('DOMContentLoaded', function () {
    main();
});

/**
 * Główna funkcja, tutaj dodajemy skrypty które mają się wywołać po załadowaniu strony
 */
function main() {
    datepickerInit();
    registerFormInit();
}

/**
 * Inicjacja elementów z materialize
 */
function datepickerInit() {
    let elems = document.querySelectorAll('.datepicker');
    let instances = M.Datepicker.init(elems);
}

/**
 * Funkcja inicjująca formularz rejestracyjny
 */
function registerFormInit() {
    let buttonPacjent = document.getElementById("pacjent");
    buttonPacjent.onclick = () => showPatient(true);
    let buttonLekarz = document.getElementById("lekarz");
    buttonLekarz.onclick = () => showPatient(false);
}

/**
 * Funkcja modyfikująca pole rejestracji
 * @param {*} status True - pacjent
 * true - pacjent
 * false - lekarz
 */
function showPatient(status) {
    console.log("status: " + status);
    let peselPanel = document.getElementById("pesel_panel");
    let dataUrodzeniaPanel = document.getElementById("data_urodzenia_panel");
    let specjalizacjaPanel = document.getElementById("specjalizacja_panel");
    if (status) {
        peselPanel.style.display = "inline";
        dataUrodzeniaPanel.style.display = "inline";
        specjalizacjaPanel.style.display = "none";
    } else {
        peselPanel.style.display = "none";
        dataUrodzeniaPanel.style.display = "none";
        specjalizacjaPanel.style.display = "inline";
    }
}