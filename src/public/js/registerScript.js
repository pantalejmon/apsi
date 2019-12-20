
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
    submittedData.firstName = document.getElementById("first-name").value.trim();
    submittedData.lastName = document.getElementById("last-name").value.trim();
    submittedData.mail = document.getElementById("email").value.trim();
    submittedData.phoneNumber = document.getElementById("phone-number").value.trim();
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
        submittedData.specialization = document.getElementById("specialization").value.trim();
    } else {
        console.log("brak roli");
    }

    console.log(submittedData);
    if (!validateFormInput(submittedData)) {
        // Data is not valid, don't send it
        return;
    }

    // Send data to sever and react to responses
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.host + "/api/register", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            // Show message to user, after user clicks 'OK', redirecting to login screen
            alert(response.message);
            top.location.replace("http://" + window.location.host + "/login.html");

        } else if (this.status === 400) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            // Sent data was wrong, show message to user
            alert(response.error);
        }
    });
    xhr.send(JSON.stringify(submittedData));
}

/**
 * Function checks if form data is valid before sending it to server
 * @param inputJson contains data inserted by user in form
 */
function validateFormInput(inputJson) {
    // Validate fields shared by patient and doctor
    if (!validateName(inputJson.firstName)) {
        alert("Incorrect first name!");
        return false;
    } else if (!validateName(inputJson.lastName)) {
        alert("Incorrect last name!");
        return false;
    } else if (!validateEmail(inputJson.mail)) {
        alert("Incorrect email!");
        return false;
    } else if (!validatePhoneNumber(inputJson.phoneNumber)) {
        alert("Incorrect phone number!");
        return false;
    } else if (!arePasswordsEqual()) {
        alert("Passwords don't match!");
        return false;
    } else if (!validatePassword(inputJson.password)) {
        alert("Password invalid!");
        return false;
    } else if (!validateRole(inputJson.role)) {
        alert("Select a Role!");
        return false;
    }
    // validate role
    if (inputJson.role === "PATIENT") {
        if (!validateCitizenId(inputJson.citizenId)) {
            alert("Invalid PESEL!");
            return false;
        } else if (!validateDateOfBirth(inputJson.dateOfBirth)) {
            alert("Invalid date of birth!");
            return false;
        }
    } else if (inputJson.role === "DOCTOR") {
        if (!validateSpecialization(inputJson.specialization)) {
            alert("Invalid specialization!");
            return false;
        }
    }

    return true;
}

/**
 * Function checks if name is valid
 * @param name as a string
 */
function validateName(name) {
    let regexNoNumbers = /\D{1,20}/;
    if (!name || !name.trim() || !regexNoNumbers.test(name)) {
        return false;
    } else return true;
}

//ToDo: further validation
function validateEmail(email) {
    if (!email || !email.trim()) {
        return false;
    } else return true;
}

/**
 * Function checks if phone number is valid
 * @param phoneNumber as a string
 */
function validatePhoneNumber(phoneNumber) {
    let regexLetters = /[a-z]+/g;
    if (!phoneNumber || !phoneNumber.trim() || regexLetters.test(phoneNumber)) {
        return false;
    } else return true;
}

// Check if inserted password and repeated password match
function arePasswordsEqual() {
    let password = document.getElementById("password").value;
    let passwordRepeat = document.getElementById("password-repeat").value;
    if (password !== passwordRepeat) {
        return false;
    } else return true
}

function validatePassword(password) {
    if (!password || !password.trim()) {
        return false;
    } else return true;
}

/**
 * Function checks if role is valid
 * @param role as a string
 */
function validateRole(role) {
    if (role === "PATIENT" || role === "DOCTOR") {
        return true;
    } else return false;
}

function validateSpecialization(specialization) {
    if (!specialization || !specialization.trim()) {
        return false;
    } else return true;
}

// Function checks if citizenId (PESEL) contains only digits (11)
function validateCitizenId(citizenId) {
    let onlyDigitsRegex = /^\d{11}$/;
    if (!citizenId || !citizenId.trim() || !onlyDigitsRegex.test(citizenId)) {
        return false;
    } else return true;
}

function validateDateOfBirth(dateOfBirth) {
    if (!dateOfBirth || isNaN(dateOfBirth)) {
        return false;
    } else return true;
}

/**
 * Convert date to unix timestamp
 * @param {*} strDate - date in format: yyyy/mm/dd
 */
function convertDateToTimestamp(strDate) {
    var dateUnix = Date.parse(strDate.split("/").reverse().join("/"));
    return dateUnix / 1000;
}