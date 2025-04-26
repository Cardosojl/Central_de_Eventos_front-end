window.addEventListener("load", action);

async function action() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const data = await getRequest(`http://localhost:8080/api/user/V1/${userStorage.id}`, userStorage);
    if(userStorage.id != data.id || userStorage.email != data.email || userStorage.username != data.name || userStorage.role != data.role) {
        userStorage.id = data.id;
        userStorage.email = data.email;
        userStorage.username = data.name;
        userStorage.role = data.role;
        localStorage.setItem("userData", JSON.stringify(userStorage));
        location.reload();
    }    
    getItems(data);
}

function getItems(userData) {
    userForm(userData);
}

function userForm(userData) {
    const userFormDiv = document.getElementById("user_form");
    const tittle = createElements("h3", {}, "Editar Conta")
    const labelEmail = createElements("label", {}, "Email:");
    const inputEmail = createElements("input", { type: "text", name: "email", value: `${userData.email}` });
    const labelName = createElements("label", {}, "Nome:");
    const inputName = createElements("input", { type: "text", name: "name", value: `${userData.name}` });
    const labelPassword = createElements("label", {}, "Senha:");
    const inputPassword = createElements("input", { type: "password", name: "password" });
    const button = createElements("button", { id: "button" }, "Enviar");
    const divEmail = createContainer("div", {}, [labelEmail, inputEmail]);
    const divName = createContainer("div", {}, [labelName, inputName]);
    const divPassword = createContainer("div", {}, [labelPassword, inputPassword]);
    const divButton = createContainer("div", {id: "user_button"}, [button]);
    
    appendElements(userFormDiv, [ tittle, divEmail, divName, divPassword, divButton]);
    button.addEventListener("click", (e) => editUser(e));
}

async function editUser(e) {
    e.preventDefault();
    document.getElementById("alert_message") ? document.getElementById("alert_message").remove() : null;
    const email = document.getElementsByName("email");
    const name = document.getElementsByName("name");
    const password = document.getElementsByName("password");
    console.log(password[0].value.length);
    if(password[0].value && password[0].value.length > 5) {
        const userStorage = JSON.parse(localStorage.getItem("userData"));
        const payload = { id: userStorage.id, email: email[0].value, name: name[0].value, password: password[0].value};
        await putRequest("http://localhost:8080/api/user/V1", userStorage, payload);
        location.reload();
    } else {
        const userFormDiv = document.getElementById("user_form");
        userFormDiv.prepend(createElements("label", { id: "alert_message" }, "Senha deve ter mais de 5 caracteres!"));
    }    
}