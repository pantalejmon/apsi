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

function changePass() {
    let pass1 = document.getElementById('pass');
    let pass2 = document.getElementById('pass2');
    let helper = document.getElementById('help');

    if (!validatePassword(pass1, pass2)) {
        return;
    }

    const message = {};
    message.pass = pass1;
    console.log(message);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.host + "/api/passchange", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        console.log("cos doszlo");
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            console.log(response);
            if (response.error) {
                alert(response.error);
            } else {
                alert("Hasło zmienione pomyślnie");
                top.location.replace("http://" + window.location.host);
            }
        }
    });
    xhr.send(JSON.stringify(message));
}

function validatePassword(pass1, pass2) {
    if (!pass1 || !pass2 || pass1.length < 8 || pass2.length < 8) {
        pass1.classList.add("invalid");
        pass1.classList.remove("valid");
        alert("Hasło za krótkie");
        return false;
    } else if (pass1.value === pass2.value) {
        pass2.classList.add("valid");
        pass2.classList.remove("invalid");
        return true;
    } else {
        pass2.classList.add("invalid");
        pass2.classList.remove("valid");
        return false;
    }
}