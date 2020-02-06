const getData = () => {
    fetch(chooseProtocol() + window.location.host + "/api/patient/appointment")
        .then(resp => resp.json())
        .then(data => {
            const tableBody = document.getElementById('visits-list-table')
            data.forEach(visit => {
                row = document.createElement("tr");
                row.setAttribute('id', `${visit.contact}`);

                let date = new Date(visit.startDate * 1000);

                row.innerHTML = `
                    <td>${visit.doctor.firstName + " " + visit.doctor.lastName}</td>
                    <td>${getDateFromTimestamp(visit.startDate)}</td>
                    <td>${getTimeFromTimestamp(visit.startDate)}</td>
                `;
                //tu dodajemy wiersz z pacjentem
                tableBody.appendChild(row);
            })
        });

}

getData();

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

function getTimeFromTimestamp(timestamp) {
    let jsDate = new Date(timestamp * 1000);
    let jsMinutes = ('0' + jsDate.getMinutes()).slice(-2);
    let jsHours = ('0' + jsDate.getHours()).slice(-2);
    let date = jsHours + ':' + jsMinutes;
    return date;
}