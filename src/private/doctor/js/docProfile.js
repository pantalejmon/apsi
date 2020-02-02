document.addEventListener('DOMContentLoaded', function () {

    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", chooseProtocol() + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;
        console.log(user);

        // log details
        let text = user.firstName + " " + user.lastName;
        document.getElementById('first-name').value = text;
        document.getElementById('email').value = user.mail;
        document.getElementById('phone-number').value = user.phoneNumber;
        document.getElementById('specialization').value = user.citizenId;
    }

});


function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
} 