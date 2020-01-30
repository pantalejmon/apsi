document.addEventListener('DOMContentLoaded', function () {
});

loggedAsUser = document.getElementById('loggedAsUser');

window.onload = function writeYouAreLoggedAsAndUserName() {
    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "http://" + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;

        // log details
        var text = "Jesteś zalogowany jako " + user.firstName + " " + user.lastName;
        loggedAsUser.innerHTML = text;
    }

}
