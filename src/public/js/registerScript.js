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

/**
 * Function called after clicking button to submit register form 
 */
function register() {
    const submittedData = {};
    submittedData.firstName = document.getElementById("imie").value;
    submittedData.lastName = document.getElementById("nazwisko").value;
    submittedData.mail = document.getElementById("email").value;
    submittedData.phoneNumber = document.getElementById("numer_telefonu").value;
    submittedData.password = document.getElementById("haslo").value;
    
    // If z checkiem wybranej roli -> uzupelnienie reszty
    if (document.getElementById("pacjent").checked) {
        console.log("Pacjent");
        submittedData.role = "PATIENT"
        submittedData.citizenId = document.getElementById("pesel").value;
        submittedData.password = document.getElementById("kalendarz_urodziny").value;
    } else if (document.getElementById("lekarz").checked) {
        console.log("Lekarz");
        submittedData.role = "DOCTOR"
        submittedData.specialization = document.getElementById("specjalizacja").value;
    } else {
        console.log("brak roli");
    }


    // let selectedOption = document.getElementById('form-register')['radio-group-rola'].value;
    // console.log(selectedOption);

    console.log(submittedData);
    if (!validateFormInput(submittedData)) {
        // Data is not valid, show message to user
        return;
    }





}

/**
 * Function checks if form data is valid before sending it to server
 */
function validateFormInput(inputJson) {
    return true;
}