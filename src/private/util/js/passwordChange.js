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

    // If passwords are not valid don't send them to server
    if (!validatePassword(pass1, pass2)) {
        return;
    }

    const message = {};
    message.pass = pass1;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", chooseProtocol() + window.location.host + "/api/passchange", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
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

/**
 * Function that checks if provided passwords are valid before they
 * are send to server to perform password change
 * Function @returns true if passwords are valid 
 * @param {*} pass1 new password entered first time
 * @param {*} pass2 new password entered second time as confirmation
 */
function validatePassword(pass1, pass2) {
    if (!pass1 || !pass2 || pass1.length < 8 || pass2.length < 8) {
        pass1.classList.add("invalid");
        pass1.classList.remove("valid");
        return false;
    } else if (pass1.value !== pass2.value) {
        pass2.classList.add("invalid");
        pass2.classList.remove("valid");
        return false;
    } else if (pass1.value === pass2.value) {
        pass2.classList.add("valid");
        pass2.classList.remove("invalid");
        pass1.classList.add("valid");
        pass1.classList.remove("invalid");
        return true;
    } else {
        pass1.classList.add("invalid");
        pass1.classList.remove("valid");
        pass2.classList.add("invalid");
        pass2.classList.remove("valid");
        return false;
    }
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}