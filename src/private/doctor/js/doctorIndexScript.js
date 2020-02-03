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


function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}