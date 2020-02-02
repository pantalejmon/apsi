document.addEventListener('DOMContentLoaded', function () {
    welcomeUser = document.getElementById('welcomeUser');
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", chooseProtocol() + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;

        // log details
        let text = "Witaj " + user.firstName + " " + user.lastName;
        welcomeUser.innerHTML = text;
    }

});


function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
} 