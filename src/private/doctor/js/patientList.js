let loadedPages = 0;
//potrzebuje api/patient/list czy cos
// Narazie nie robimy paginacji [JJ]
const getData = () => {
    fetch(`${chooseProtocol()}${window.location.host}/api/doctor/appointment?${loadedPages ? `page=${loadedPages}` : ''}`)
        .then(resp => resp.json())
        .then(data => {
            const tableBody = document.getElementById('patient-list-table')

            //TODO: usunac testowe dane
            data = [...testData]
            data.length = Math.floor(Math.random() * data.length);
            //do testow

            data.forEach(patient => {
                row = document.createElement("tr");
                row.setAttribute('id', `${patient.contact}-${loadedPages}`);

                row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.surname}</td>
                <td>${patient.contact}</td>
            `;
                //tu dodajemy wiersz z pacjentem
                tableBody.appendChild(row);
            })
        });
    loadedPages++;

}

const init = () => {
    document
        .getElementById('load-more')
        .addEventListener('click', getData);

    getData();
}
init();

const testData = [{
    "name": "Cal",
    "surname": "Tingey",
    "contact": "ctingey0@vimeo.com"
}, {
    "name": "Vivianna",
    "surname": "O'Connor",
    "contact": "voconnor1@intel.com"
}, {
    "name": "Sharron",
    "surname": "Drysdell",
    "contact": "sdrysdell2@ezinearticles.com"
}, {
    "name": "Christin",
    "surname": "Pilipets",
    "contact": "cpilipets3@twitter.com"
}, {
    "name": "Sydelle",
    "surname": "Thunders",
    "contact": "sthunders4@mit.edu"
}, {
    "name": "Abeu",
    "surname": "Vasser",
    "contact": "avasser5@sun.com"
}, {
    "name": "Michele",
    "surname": "Gabbat",
    "contact": "mgabbat6@nbcnews.com"
}, {
    "name": "Reagan",
    "surname": "Shankland",
    "contact": "rshankland7@census.gov"
}, {
    "name": "Victoria",
    "surname": "Windibank",
    "contact": "vwindibank8@sakura.ne.jp"
}, {
    "name": "Salmon",
    "surname": "Glasbey",
    "contact": "sglasbey9@woothemes.com"
}, {
    "name": "Denny",
    "surname": "Dulieu",
    "contact": "ddulieua@toplist.cz"
}, {
    "name": "Fleurette",
    "surname": "Moquin",
    "contact": "fmoquinb@topsy.com"
}, {
    "name": "Claus",
    "surname": "Mansion",
    "contact": "cmansionc@freewebs.com"
}, {
    "name": "Murial",
    "surname": "Fritchly",
    "contact": "mfritchlyd@simplemachines.org"
}, {
    "name": "Melisse",
    "surname": "Ambrodi",
    "contact": "mambrodie@plala.or.jp"
}, {
    "name": "Jan",
    "surname": "Hassen",
    "contact": "jhassenf@posterous.com"
}, {
    "name": "Natalina",
    "surname": "Peplay",
    "contact": "npeplayg@springer.com"
}, {
    "name": "Penelope",
    "surname": "Brugger",
    "contact": "pbruggerh@omniture.com"
}, {
    "name": "Denna",
    "surname": "Llewellen",
    "contact": "dllewelleni@delicious.com"
}, {
    "name": "Sabra",
    "surname": "Bauduin",
    "contact": "sbauduinj@liveinternet.ru"
}, {
    "name": "Winnah",
    "surname": "Garoghan",
    "contact": "wgaroghank@friendfeed.com"
}, {
    "name": "Dominga",
    "surname": "Handke",
    "contact": "dhandkel@ustream.tv"
}, {
    "name": "Loleta",
    "surname": "Daughtery",
    "contact": "ldaughterym@nba.com"
}, {
    "name": "Giorgi",
    "surname": "D'Agostino",
    "contact": "gdagostinon@ted.com"
}, {
    "name": "Dorothy",
    "surname": "Impy",
    "contact": "dimpyo@hubpages.com"
}, {
    "name": "Anastasia",
    "surname": "Pardew",
    "contact": "apardewp@lulu.com"
}, {
    "name": "Wenda",
    "surname": "Pirot",
    "contact": "wpirotq@arstechnica.com"
}, {
    "name": "Rurik",
    "surname": "Sheehy",
    "contact": "rsheehyr@usgs.gov"
}, {
    "name": "Huntlee",
    "surname": "Ducker",
    "contact": "hduckers@examiner.com"
}, {
    "name": "Maddie",
    "surname": "Di Meo",
    "contact": "mdimeot@narod.ru"
}]

function chooseProtocol() {
    return window.location.host.includes("localhost") ? "http://" : "https://"
}