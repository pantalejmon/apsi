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
    let buttonPacjent = document.getElementById("radio-patient");
    buttonPacjent.onclick = () => showPatient(true);
    let buttonLekarz = document.getElementById("radio-doctor");
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
    let peselPanel = document.getElementById("pesel-panel");
    let dataUrodzeniaPanel = document.getElementById("date-od-birth-panel");
    let specjalizacjaPanel = document.getElementById("specialization-panel");
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
    submittedData.firstName = document.getElementById("first-name").value;
    submittedData.lastName = document.getElementById("last-name").value;
    submittedData.mail = document.getElementById("email").value;
    submittedData.phoneNumber = document.getElementById("phone-number").value;
    // Todo: Check if passwords are equal
    submittedData.password = document.getElementById("password").value;
    
    if (document.getElementById("radio-patient").checked) {
        console.log("Pacjent");
        submittedData.role = "PATIENT"
        submittedData.citizenId = document.getElementById("pesel").value;
        submittedData.password = document.getElementById("date-of-birth").value;
    } else if (document.getElementById("radio-doctor").checked) {
        console.log("Lekarz");
        submittedData.role = "DOCTOR"
        submittedData.specialization = document.getElementById("specialization").value;
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