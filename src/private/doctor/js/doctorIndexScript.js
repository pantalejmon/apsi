/**
 * Tutaj nie ruszamy
 */
document.addEventListener('DOMContentLoaded', function() {
    main();
})

/**
 * Główna funkcja, tutaj dodajemy skrypty które mają się wywołać po załadowaniu strony
 */
function main() {
    sidenavInit();
    me();
}

function sidenavInit() {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems);
}

/**
 * {HANDLER}
 * Zmienia poświetlenie konkretnego przycisku w menu po prawej stronie
 * @param {*} str 
 */
function changeActiveMenuItem(str) {
    const allLi = document.getElementsByTagName("li");
    for (let t of allLi) {
        t.classList.remove("active");
    }
    document.getElementById(str).classList.add("active");
}

function me() {
    loggedAsUser = document.getElementById('loggedAsUser');
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", chooseProtocol() + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;

        // log details
        let text = "Jesteś zalogowany jako " + user.firstName + " " + user.lastName;
        loggedAsUser.innerHTML = text;
    }

}

function logoutUser() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", chooseProtocol() + window.location.host + "/api/logout", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            top.location.replace(chooseProtocol() + window.location.host + "/index.html");

        } else if (this.status === 400) {
            const response = this.responseText;
            // Sent data was wrong, show message to user
            alert(response.error);
        }
    });
    xhr.send();
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}