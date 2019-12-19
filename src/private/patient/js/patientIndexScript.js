/**
 * Tutaj nie ruszamy
 */
document.addEventListener('DOMContentLoaded', function () {
    main();
})

/**
 * Główna funkcja, tutaj dodajemy skrypty które mają się wywołać po załadowaniu strony
 */
function main() {
    sidenavInit();
    M.AutoInit();
    let tabs = document.querySelectorAll('.tabs')
    for (let i = 0; i < tabs.length; i++) {
        M.Tabs.init(tabs[i], { swipeable: true, responsiveThreshold: 800 });
    }
}

function sidenavInit() {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems);
}

/**
 * {HANDLER}
 * Zmienia poświetlenie konkretnego przycisku w menu po prawej stronie
 * @param {*} str 
 */
function changeActiveMenuItem(str) {
    const allLi = document.getElementsByTagName("li");
    for (let t of allLi) {
        t.classList.remove("active");
    }
    document.getElementById(str).classList.add("active");
}