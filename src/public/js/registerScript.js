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
    let datePickerOptions = {
        format: "dd/mm/yyyy"
    };
    let instances = M.Datepicker.init(elems, datePickerOptions);
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
    let dataUrodzeniaPanel = document.getElementById("date-of-birth-panel");
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
        submittedData.dateOfBirth = convertDateToTimestamp(document.getElementById("date-of-birth").value);
    } else if (document.getElementById("radio-doctor").checked) {
        console.log("Lekarz");
        submittedData.role = "DOCTOR"
        submittedData.specialization = document.getElementById("specialization").value;
    } else {
        console.log("brak roli");
    }

    console.log(submittedData);
    if (!validateFormInput(submittedData)) {
        // Data is not valid, show message to user
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.host + "/api/register", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            if (response.error) {
                alert("Niepoprawne dane");
            } else {
                alert(response);
                // ToDo: redirect to login after 5 secs
                //top.location.replace("http://" + window.location.host + "/login.html");
            }
        }
    });
    xhr.send(JSON.stringify(submittedData));
}

/**
 * Function checks if form data is valid before sending it to server
 */
function validateFormInput(inputJson) {
    return true;
}

/**
 * Convert date to unix timestamp
 * @param {*} strDate - date in format: yyyy/mm/dd
 */
function convertDateToTimestamp(strDate) {
    var dateUnix = Date.parse(strDate.split("/").reverse().join("/"));
    return dateUnix / 1000;
}