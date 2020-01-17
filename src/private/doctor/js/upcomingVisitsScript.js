/**
 * Tutaj nie ruszamy
 */
document.addEventListener('DOMContentLoaded', function () {
    main();
});

/**
 * Główna funkcja, tutaj dodajemy skrypty które mają się wywołać po załadowaniu strony
 */
function main() {
    renderCalendar();
}

function renderCalendar() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid'],
        defaultView: 'timeGridWeek',
        firstDay: 1,
        locale: 'pl',
        eventColor: '#03a9f4',
        events: [
            { // this object will be "parsed" into an Event Object
                title: 'Test Visit', // a property!
                start: '2020-01-17T12:00:00', // a property!
                end: '2020-01-17T14:00:00' // a property! ** see important note below about 'end' **
            }
        ],
        timeFormat: 'H(:mm)',
        displayEventTime: true,
        allDayEvents: false

    });

    calendar.render();
}

function addEventsToCalendar() {
    // Get data from API
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            // for each appointment make an Event object and add it to calendar
           
        }

    });

    xhr.addEventListener("error", function () {
        alert("Niestety nie udało się nawiązać połączenia");
    });

    xhr.open("GET", "http://" + window.location.host + "/api/doctor/appointment", true);
    xhr.send();
}