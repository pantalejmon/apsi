document.addEventListener('DOMContentLoaded', function () {
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

});


function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
} 

