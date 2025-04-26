window.addEventListener("load", loadElements);

function loadElements() {
    const navbar = document.getElementById("navbar");
    const stored = localStorage.getItem("userData");
    const userLocal =  stored != "undefined" ? JSON.parse(stored) : null;
    const username = userLocal?.username || null;
    const role = userLocal?.role || null;
    
    const logo = createElements("img", { src: "../../public/logo.png" });
    const aHome = createElements("a", { href: "../../index.html"}, "Home");
    const aEventos = createElements("a", { href: "../../pages/events/events.html"}, "Eventos");
    const aSobre = createElements("a", { href: "../../pages/about/about.html" }, "Sobre");
    
    let aLogin;
    
    if (username) {
        if (role === "MERCHANT") {
            aLogin = createElements("a", { href: "../../pages/myParticipations/myParticipations.html" }, username);
        } else {
            aLogin = createElements("a", { href: "../../pages/myEvents/myEvents.html" }, username);
        }
    } else {
        aLogin = createElements("a", { href: "../../pages/login/login.html" }, "Login");
    }
    
    const div1 = createContainer("div", {}, [aHome, aEventos, aSobre]);
    const div2 = createContainer("div", {}, [aLogin]);

    appendElements(navbar, [logo, div1, div2]);
}
