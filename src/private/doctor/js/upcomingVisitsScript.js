document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid'],
        defaultView: 'timeGridWeek',
        firstDay: 1,
        locale: 'pl',
        eventColor: '#f39111',
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
});
