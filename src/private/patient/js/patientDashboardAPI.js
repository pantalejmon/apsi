document.addEventListener('DOMContentLoaded', function () {
});

welcomeUser = document.getElementById('welcomeUser');


window.onload = function writeWelcomeAndUserName() {
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "http://" + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;

        // log details
        var text = "Witaj " + user.firstName + " " + user.lastName;
        welcomeUser.innerHTML = text;
    }

}