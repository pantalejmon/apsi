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
    fetchEventsAndAddToCalendar();
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
            // { // this object will be "parsed" into an Event Object
            //     title: 'Test Visit', // a property!
            //     start: '2020-01-17T12:00:00', // a property!
            //     end: '2020-01-17T14:00:00' // a property! ** see important note below about 'end' **
            // }
        ],
        timeFormat: 'H(:mm)',
        displayEventTime: true,
        allDayEvents: false

    });

    calendar.render();
}

function fetchEventsAndAddToCalendar() {
    // Get data from API
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            // for each appointment make an Event object and add it to calendar
            const json = JSON.parse(xhr.response);
            // Check if json is not empty
            if (!isEmpty(json)) {
                // Process and add events to callendar
                addEventsToCallendar(json);
            }
        }

    });

    xhr.addEventListener("error", function () {
        alert("Niestety nie udało się nawiązać połączenia");
    });

    xhr.open("GET", chooseProtocol() + window.location.host + "/api/doctor/appointment", true);
    xhr.send();
}

/**
 * Function makes events objects compatible with calendar configuration from passed 
 * JSON server response and adds them to callendar instance.
 * Callendar event is in form:
 *  {
        title: 'Test Visit', // a property!
        start: '2020-01-17T12:00:00', // a property!
        end: '2020-01-17T14:00:00' // a property! ** see important note below about 'end' **
    }
 * @param eventsJson is server response containting appointments as array of events
 */
function addEventsToCallendar(eventsJson) {
    // Iterate through events, process and add to callendar
    for (let i = 0; i < eventsJson.length; i++) {
        let jsonEvent = eventsJson[i];
        let callendarEvent = {};
        // Construct event
        callendarEvent.title = jsonEvent.patient;
        callendarEvent.start = convertTimestampToCalendarDate(jsonEvent.startDate);
        callendarEvent.end = convertTimestampToCalendarDate(jsonEvent.startDate + jsonEvent.duration);
        // Add current event to callendar
        calendar.addEvent(callendarEvent);
    }
}

/**
 * Function converts date in Unix Timestamp format to date accepted
 * by fullcallendar configuration, pattern: yyyy-mm-ddT12:00:00
 * @param {*} timestamp as Unix Timestamp format in seconds
 */
function convertTimestampToCalendarDate(timestamp) {
    let date = new Date(timestamp * 1000).toISOString();
    return date;
}

/**
 * Check if JSON object is empty
 * @param obj is JSON object on which we perform check
 */
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}

/*
const testJson = [
    {
        id: 1,
        startDate: 1578823200,
        duration: 7200,
        patient: "Jan Kowalski",
        doctor: "Doktor Strange",
        status: "Pending"
    },
    {
        id: 2,
        startDate: 1582823200,
        duration: 7200,
        patient: "Maria Kowalska",
        doctor: "Doktor Strange",
        status: "Pending"
    }
];
*/
