document.addEventListener('DOMContentLoaded', function() {
    getData();
});

const getData = () => {
    fetch(chooseProtocol() + window.location.host + "/api/patient/list")
        .then(resp => resp.json())
        .then(data => {
            const tableBody = document.getElementById('patient-list-table')

            data.forEach(patient => {
                row = document.createElement("tr");
                row.setAttribute('id', `${patient.contact}`);

                row.innerHTML = `
                    <td>${patient.firstName}</td>
                    <td>${patient.lastName}</td>
                    <td>${patient.mail}</td>
                    <td>${patient.phoneNumber}</td>
                `;
                //tu dodajemy wiersz z pacjentem
                tableBody.appendChild(row);

                row.addEventListener('click', () => {
                    modalEl.setAttribute('data-email', patient.mail);
                    const modalTitle = document.getElementById("modal-title")
                    modalTitle.innerText = `Umów wizytę z: ${patient.firstName} ${patient.lastName}`

                    modalInstance.open();
                })
            })
        });

}
const modalEl = document.getElementById('register-appointment-modal');
const modalInstance = M.Modal.init(modalEl);

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}