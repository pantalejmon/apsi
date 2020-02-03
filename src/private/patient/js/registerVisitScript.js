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
    initializeMaterializeSelectors;
}

function initializeMaterializeSelectors() {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, options);
}

function getDoctorsList() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            // for each appointment make an Event object and add it to calendar
            const json = JSON.parse(xhr.response);
            // Check if json is not empty
            if (!isEmpty(json)) {
                // Add doctors to dropdown

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
 * Check if JSON object is empty
 * @param obj is JSON object on which we perform check
 */
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}