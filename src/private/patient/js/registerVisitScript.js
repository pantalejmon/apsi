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
    datepickerInit();
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
            console.log(response);
            // Check if response is not empty
            let selectDoctor = document.getElementById("select-doctor");
            if (response.length) {
                response.forEach(element => {
                    // Add doctors to dropdown
                    let option = document.createElement('option');
                    option.value = element.mail;
                    option.text = element.firstName + " " + element.lastName;
                    //console.log(option);
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
    console.log(convertDateToTimestamp(document.getElementById("appointment-date").value));
    submittedData.duration = 7200;
    // Doctor email
    let selectDoctor = document.getElementById("select-doctor");
    let doctorValue = selectDoctor.options[selectDoctor.selectedIndex].value;
    console.log(doctorValue);
    submittedData.mail = doctorValue;

    if (!validateFormInput(submittedData)) {
        // Data is not valid, don't send it
        return;
    }

    // Send data to sever and react to responses
    let xhr = new XMLHttpRequest();
    xhr.open("POST", chooseProtocol() + window.location.host + "appointment/new", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            // Show message to user, after user clicks 'OK', redirecting to login screen
            alert(response.message);
            //top.location.replace("http://" + window.location.host + "/login.html");

        } else if (this.status === 400) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            // Sent data was wrong, show message to user
            alert(response.error);
        }
    });
    xhr.send(JSON.stringify(submittedData));
}

function validateFormInput(inputJson) {
    // Validate fields shared by patient and doctor
    if (!inputJson.startDate) {
        alert("Incorrect start date!");
        return false;
    } else if (inputJson.duration) {
        alert("Incorrect duration!");
        return false;
    } else if (!inputJson.mail) {
        alert("Incorrect doctor!");
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
    let elems = document.getElementById("select-doctor");
    let options = {};
    let instance = M.FormSelect.init(elems, options);
}

function datepickerInit() {
    let elems = document.querySelectorAll('.datepicker');
    let datePickerOptions = {
        format: "dd/mm/yyyy"
    };
    let instances = M.Datepicker.init(elems, datePickerOptions);
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}