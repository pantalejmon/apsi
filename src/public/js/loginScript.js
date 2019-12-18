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

}

/**
 * Wysłanie zapytania o logowanie
 */
function login() {
    const message = {};
    message.email = document.getElementById("email").value;
    message.password = document.getElementById("password").value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" +
        window.location.host + "/api/login", null);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        console.log("cos doszlo");
        if (this.status === 200) {
            const response = JSON.parse(this.responseText)
            console.log(response);
            if (response.error) {
                alert("Niepoprawne dane logowania!")

                // Tutaj musi być działanie dotyczące nie poprawnego logowania, jakiś komunikat
            }
            if (response.token) {
                if (response.role === "DOCTOR") location.replace("http://" + window.location.host + "/doctor/doctorDashboard.html");
                else if (response.role === "PATIENT") location.replace("http://" + window.location.host + "/patient/patientDashboard.html");
            }
        }
    });

    xhr.send(JSON.stringify(message));
}