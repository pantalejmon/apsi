document.addEventListener('DOMContentLoaded', function () {

    let apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", chooseProtocol() + window.location.host + "/api/util/me", true);

    apiRequest.responseType = 'json';
    apiRequest.send();

    apiRequest.onload = () => {
        // get JSON response
        const user = apiRequest.response;
        
        // log details
        let text = user.firstName + " " + user.lastName;


        document.getElementById('first-name').value = text;
        document.getElementById('email').value = user.mail;
        document.getElementById('phone-number').value = user.phoneNumber;
        document.getElementById('pesel').value = user.citizenId;
        document.getElementById('dateofbirth').value = getDateFromTimestamp(user.dateOfBirth);
    }

});


function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
} 

function getDateFromTimestamp(timestamp) {
    let jsDate = new Date(timestamp * 1000);
    let jsMonth = ('0' + (jsDate.getMonth() + 1)).slice(-2);
    let jsDay = ('0' + (jsDate.getDate() + 1)).slice(-2);
    let date = jsDate.getFullYear() + '-' + jsMonth + '-' + jsDay;
    return date;
}