const getData = () => {
    fetch(chooseProtocol() + window.location.host + "/api/patient/appointment")
        .then(resp => resp.json())
        .then(data => {
            const tableBody = document.getElementById('visits-list-table')
            console.log(data);
            data.forEach(visit => {
                console.log(visit);
                row = document.createElement("tr");
                row.setAttribute('id', `${visit.contact}`);

                var date = new Date(visit.startDate * 1000);

                row.innerHTML = `
                    <td>${visit.doctor.firstName + " " + visit.doctor.lastName}</td>
                    <td>${date.getUTCFullYear() +
                        '-' + ('0' + date.getUTCMonth()).slice(-2) +
                        '-' + ('0' + date.getUTCDate()).slice(-2)}</td>
                    <td>${('0' + date.getUTCHours()).slice(-2) +
                    ':' + ('0' + date.getUTCMinutes()).slice(-2)}</td>
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