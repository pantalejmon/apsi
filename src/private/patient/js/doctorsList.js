document.addEventListener('DOMContentLoaded', function() {
    getData();
});

const getData = () => {
    fetch(chooseProtocol() + window.location.host + "/api/doctor/list")
        .then(resp => resp.json())
        .then(data => {
            const tableBody = document.getElementById('doctor-list-table')

            data.forEach(doctor => {
                row = document.createElement("tr");
                row.setAttribute('id', `${doctor.contact}`);

                row.innerHTML = `
                    <td>${doctor.firstName}</td>
                    <td>${doctor.lastName}</td>
                    <td>${doctor.mail}</td>
                    <td>${doctor.phoneNumber}</td>
                `;
                tableBody.appendChild(row);
            })
        });

}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}