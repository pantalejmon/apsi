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
    initializeMaterializeSelectors();
    initializeDatepickers();
    getDoctorsListAndAddToSelect();
}

/**
 * Fetch list of doctors from API and add them to select element
 */
function getDoctorsListAndAddToSelect() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = xhr.response;
            // Check if response is not empty
            let selectDoctor = document.getElementById("select-doctor");
            if (response.length) {
                response.forEach(element => {
                    // Add doctors to dropdown
                    let option = document.createElement('option');
                    option.value = element.mail;
                    option.text = element.firstName + " " + element.lastName;

                    selectDoctor.appendChild(option);
                    M.FormSelect.init(selectDoctor);
                });
            }
        }

    });

    xhr.addEventListener("error", function () {
        alert("Niestety nie udało się nawiązać połączenia");
    });

    xhr.open("GET", chooseProtocol() + window.location.host + "/api/doctor/list", true);
    xhr.send();
}
/**
 * Register new appointment by sending data to API
 */
function registerAppointment() {
    const submittedData = {};

    submittedData.startDate = convertDateToTimestamp(document.getElementById("appointment-date").value);

    let selectDuration = document.getElementById("select-duration");
    let appointmentDuration = selectDuration.options[selectDuration.selectedIndex].value;
    // Appointment duration should be presented in seconds
    if (appointmentDuration == 1) {
        submittedData.duration = 3600;
    } else if (appointmentDuration == 2) {
        submittedData.duration = 7200;
    } else submittedData.duration = 0;

    // Doctor email
    let selectDoctor = document.getElementById("select-doctor");
    let doctorValue = selectDoctor.options[selectDoctor.selectedIndex].value;
    submittedData.mail = doctorValue;

    if (!validateFormInput(submittedData)) {
        // Data is not valid, don't send it
        return;
    }

    // Send data to sever and react to responses
    let xhr = new XMLHttpRequest();
    xhr.open("POST", chooseProtocol() + window.location.host + "/api/appointment/new", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = this.response;

            // Show message to user, after user clicks 'OK', redirecting to login screen
            alert("Wizyta została poprawnie utworzona");

        } else if (this.status === 400) {
            const response = JSON.parse(this.responseText);
            // Sent data was wrong, show message to user
            alert(response.error);
        }
    });
    xhr.send(JSON.stringify(submittedData));
}

function validateFormInput(inputJson) {
    if (!inputJson.mail || !inputJson.mail.trim()) {
        alert("Wybierz doktora");
        return false;
    } else if (!inputJson.startDate) {
        alert("Wybierz datę wizyty");
        return false;
    } else if (!inputJson.duration) {
        alert("Wybierz czas trwania wizyty!");
        return false;
    }
    return true
}

/**
 * Convert date to unix timestamp
 * @param {*} strDate - date in format: yyyy/mm/dd
 */
function convertDateToTimestamp(strDate) {
    var dateUnix = Date.parse(strDate.split("/").reverse().join("/"));
    return dateUnix / 1000;
}

function initializeMaterializeSelectors() {
    let elems = document.querySelectorAll('select');
    let options = {};
    let instances = M.FormSelect.init(elems, options);
}

function initializeDatepickers() {
    let todayDate = new Date();

    let elems = document.querySelectorAll('.datepicker');
    let datePickerOptions = {
        format: "dd/mm/yyyy",
        minDate: todayDate
    };
    let instances = M.Datepicker.init(elems, datePickerOptions);
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}