window.addEventListener("load", leftbar);

function leftbar() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const leftbar = document.getElementById("leftbar");
    const aMyEventsO = createElements("a", { href: "../../pages/myEvents/myEvents.html" }, "Meus Eventos");
    const aMyEventsM = createElements("a", { href: "../../pages/myParticipations/myParticipations.html" }, "Meus Eventos");
    const aAppointments = createElements("a", { href: "../../pages/scheduleEvent/scheduleEvent.html" }, "Agendar Evento");
    const aSell = createElements("a", { href: "../../pages/sell/sell.html" }, "Participar de Evento");
    const aEditUser = createElements("a", { href: "../../pages/user/user.html" }, "Editar Conta");
    const aExit = createElements("a", { id: "exit" }, "Sair");

    if(userStorage.role == "ORGANIZER") appendElements(leftbar, [aMyEventsO, aAppointments, aEditUser, aExit]);
    if(userStorage.role == "MERCHANT") appendElements(leftbar, [aMyEventsM, aSell, aEditUser, aExit]);
    if(userStorage.role == "ADMIN") appendElements(leftbar, [aMyEventsO, aMyEventsM, aAppointments, aSell, aEditUser, aExit]);
}

document.addEventListener("click", (e) => {
    if(e.target == document.getElementById("exit")) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../../index.html";
    }
});