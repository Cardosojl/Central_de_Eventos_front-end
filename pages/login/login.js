window.addEventListener("load", loadElements);

function loadElements() {
    if (localStorage.getItem("userData")) {
        window.location.href = "../../index.html";
    }
    const form = document.getElementById("login_form");
    const labelEmail = createElements("label", {}, "E-mail:");
    const inputEmail = createElements("input", { name: "email", type: "text" });
    const labelPassoword = createElements("label", {}, "Senha:");
    const inputPassword = createElements("input", { name: "password", type: "password" });
    const button = createElements("button", { id: "button" }, "Enviar");
    const divEmail = createContainer("div", {}, [labelEmail, inputEmail]);
    const divPassword = createContainer("div", {}, [labelPassoword, inputPassword]);
    const divButton = createContainer("div", { id: "login_button" }, [button]);

    appendElements(form, [divEmail,divPassword, divButton]);
}

document.addEventListener("click", login);

async function login(e) {
    const button = document.getElementById("button");
    if (e.target == button) {
        e.preventDefault();
        const email = document.getElementsByName("email");
        const password = document.getElementsByName("password");
        const payload = { email: email[0].value, password: password[0].value };
        await loginRequest("http://localhost:8080/auth/signin", payload);
    }    
}