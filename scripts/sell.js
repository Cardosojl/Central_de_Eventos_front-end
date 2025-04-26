window.addEventListener("load", loadElements);


async function loadElements() {
    const events = await getEventsDay();
    console.log(events);
    buildElements(events);
}

async function buildElements(data) {
    const mainContainer = document.getElementById("main_container");
    const eventContainer = createElements("div", {},);
    const tittle = createElements("h3", {}, "Meus eventos");
    const events = data;
    appendElements(mainContainer, [tittle, eventContainer]);

    events.forEach((event) => {
        const dateString = formatDate(event.date);
        const labelName = createElements("label", {}, `Nome: ${event.name}`);
        const labelDate = createElements("label", {}, `Data: ${dateString}`);
        const labelStatus = createElements("label", {}, `Status: ${event.status}`);
        const aEvents = createContainer("a", { class: "sell"}, [labelName, labelDate, labelStatus]);
        appendElements(eventContainer, [aEvents]);

        document.addEventListener("click", (e) => {
            if(e.target == aEvents || e.target.parentElement == aEvents) {
                e.preventDefault()
                eventContainer.replaceChildren();
                generateEventInformation(eventContainer, event)
            }
        });
    });
}

function generateEventInformation(container, event) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const dateString = formatDate(event.date);
    const inputId = createElements("input", { type: "hidden", id: "hidden", value: `${ event.id }` })
    const labelName = createElements("label", {}, `Nome: ${ event.name }`);
    const labelDate = createElements("label", {}, `Data: ${ dateString }`);
    const labelType = createElements("label", {}, `Tipo: ${ event.eventType.type }`);
    const labelStatus = createElements("label", {}, `Status: ${ event.status }`);
    const labelDescription = createElements("label", {}, `Descrição: ${ event.description }`);    
    const buttonReturn = createElements("button", { "data-action": "return" }, "Voltar");
    const buttonParticipate = createElements("button", { "data-action": "participate" }, "Participar");
    const buttonCancel = createElements("button", { class: "button_red", "data-action": "cancel" }, "Cancelar");
    const divEvent = createElements("div", { id: "sell" },);
    console.log(event.merchants);

    if(event.merchants[0]?.id == userStorage.id) {
        const divButtons = createContainer("div", { id: "my_event_buttons" }, [buttonCancel, buttonReturn]);
        appendElements(divEvent, [inputId, labelName, labelDate, labelType, labelStatus, labelDescription, divButtons]);
    } else {
        if(event.merchants.length <=5) {
            const divButtons = createContainer("div", { id: "my_event_buttons" }, [buttonParticipate, buttonReturn]);
            appendElements(divEvent, [inputId, labelName, labelDate, labelType, labelStatus, labelDescription, divButtons]);
        } else {
            appendElements(divEvent, [inputId, labelName, labelDate, labelType, labelStatus, labelDescription]);
        }
    }
    
    appendElements(container, divEvent);
    document.addEventListener("click", handleToParticipate);
}

async function handleToParticipate(e) {
    const action = e.target.dataset.action;
    const eventId = document.getElementById("hidden").value;
    const divButtons = document.getElementById("my_event_buttons");

    if (!action) return;

    switch (action) {
        case "return":
            location.reload();
            break;
        case "participate":
            const pCancelMessage = createElements("p", { class: "sell_participate_message" }, "Tem certeza que deseja participar deste evento?");
            const buttonConfirm = createElements("button", { "data-action": "confirm", "data-event-id": eventId }, "Confirmar");
            const buttonStop = createElements("button", { class: "button_red", "data-action": "stop" }, "Voltar");
            divButtons.replaceChildren(pCancelMessage, buttonConfirm, buttonStop);
            break;
        case "stop":
            const buttonReturn = createElements("button", { "data-action": "return" }, "Voltar");
            const buttonCancel = createElements("button", { class: "button_red", "data-action": "cancel", "data-event-id": eventId }, "Cancelar");
            divButtons.replaceChildren(buttonCancel, buttonReturn);
            break;
        case "cancel":
            const pMessage = createElements("p", { class: "sell_cancel_message" }, "Tem certeza que deseja cancelar a participação?");
            const buttonConfirmCancel = createElements("button", { class: "button_red", "data-action": "confirm_cancel", "data-event-id": eventId }, "Cancelar");
            const buttonStop2 = createElements("button", { class: "button_red", "data-action": "stop" }, "Voltar");
            divButtons.replaceChildren(pMessage, buttonConfirmCancel, buttonStop2);
            break;

        case "confirm_cancel":
            await cancelEvent(eventId);
            break;
        case "confirm":
            await toParticipate(eventId);
            break;
    }
}

function formatDate(date) {
    const dateArray = date.split("T");
    const dateString = dateArray[0].split("-").reverse().join("/");
    const timeString = dateArray[1].split(":").slice(0,2).join(":");
    return `${dateString} - ${timeString}h`;
}

async function getEventsDay() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const data = await getRequest(`http://localhost:8080/api/event/V1/byCurrentDate?status=APPROVED`, userStorage);
    return data;
}

async function toParticipate(eventId) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const payload = { id: userStorage.id };
    const response = await putRequest(`http://localhost:8080/api/event/V1/addMerchant/${eventId}`, userStorage, payload);
    if(response.ok) {
        location.reload();
    }
}

async function cancelEvent(eventId) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const payload = { id: userStorage.id };
    const response = await putRequest(`http://localhost:8080/api/event/V1/removeMerchant/${eventId}`, userStorage, payload);
    if(response.ok) {
        location.reload();
    }   
}

document.addEventListener("click", (e) => {
    const button = document.getElementById("schedule_event_button");
    if(e.target == button) {
        e.preventDefault();
        sendEvent();
    }
});