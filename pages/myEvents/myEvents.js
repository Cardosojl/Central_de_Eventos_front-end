/*window.addEventListener("load", loadElements);


async function loadElements() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const data = await getRequest(`http://localhost:8080/api/event/V1/byOrganizer/${userStorage.id}`, userStorage);
    buildElements(data);
}

function buildElements(data) {
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
        const aEvents = createContainer("a", { class: "my_events"}, [labelName, labelDate, labelStatus]);
        appendElements(eventContainer, [aEvents]);

        document.addEventListener("click", (e) => {
            if(e.target == aEvents || e.target.parentElement == aEvents) {
                e.preventDefault();
                eventContainer.replaceChildren();
                generateEventInformation(eventContainer, event);
            }
        });
    });
}

function formatDate(date) {
    const dateArray = date.split("T");
    const dateString = dateArray[0].split("-").reverse().join("/");
    const timeString = dateArray[1].split(":").slice(0,2).join(":");
    return `${dateString} - ${timeString}h`;
}

function generateEventInformation(container, event) {
    const dateString = formatDate(event.date);
    const inputId = createElements("input", { type: "hidden", id: "hidden", value: `${ event.id }` })
    const labelName = createElements("label", {}, `Nome: ${ event.name }`);
    const labelDate = createElements("label", {}, `Data: ${ dateString }`);
    const labelType = createElements("label", {}, `Tipo: ${ event.eventType.type }`);
    const labelStatus = createElements("label", {}, `Status: ${ event.status }`);
    const labelDescription = createElements("label", {}, `Descrição: ${ event.description }`);
    const labelMerchants = createElements("label", {}, `Comerciantes: ${ event.merchants.length > 0 ? "Sim" : "Não" }`);    
    const buttonReturn = createElements("button", { "data-action": "return" }, "Voltar");
    const buttonCancel = createElements("button", { class: "button_red", "data-action": "cancel" }, "Cancelar");
   
    const divButtons = createContainer("div", { id: "my_event_buttons" }, [buttonReturn, buttonCancel]);
    const divEvent = createContainer("div", { id: "my_event" }, [inputId, labelName, labelDate, labelType, labelStatus, labelDescription, labelMerchants, divButtons]);
    
    appendElements(container, divEvent);
    document.addEventListener("click", handleCancel);
}

async function handleCancel(e) {
    const action = e.target.dataset.action;
    const eventId = document.getElementById("hidden").value;
    const divButtons = document.getElementById("my_event_buttons");

    if (!action) return;

    switch (action) {
        case "return":
            location.reload();
            break;
        case "cancel":
            const pCancelMessage = createElements("p", { class: "my_events_delete_message" }, "Tem certeza que deseja cancelar esse evento?");
            const buttonConfirm = createElements("button", { "data-action": "confirm", "data-event-id": eventId }, "Confirmar");
            const buttonStop = createElements("button", { class: "button_red", "data-action": "stop" }, "Voltar");
            divButtons.replaceChildren(pCancelMessage, buttonConfirm, buttonStop);
            break;
        case "stop":
            const buttonReturn = createElements("button", { "data-action": "return" }, "Voltar");
            const buttonCancel = createElements("button", { class: "button_red", "data-action": "cancel", "data-event-id": eventId }, "Cancelar");
            divButtons.replaceChildren(buttonReturn, buttonCancel);
            break;
        case "confirm":
            await cancelEvent(eventId);
            break;
    }
}

async function cancelEvent(eventId) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    await deleteRequest(`http://localhost:8080/api/event/V1/${eventId}`, userStorage)
    location.reload();
}*/





window.addEventListener("load", loadElements);

async function loadElements() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    
    if (!userStorage || userStorage.role !== "ORGANIZER") {
        window.location.href = "../../pages/login/login.html";
        return;
    }
    
    const myEventsContainer = document.getElementById("main_container");
    const loadingElement = document.getElementById("loading");
    
    try {
        const participatingEvents = await getParticipatingEvents(userStorage);
        
        if (loadingElement) {
            loadingElement.remove();
        }
        
        if (participatingEvents.length === 0) {
            const noEventsMessage = createElements("div", { class: "no-events-message" }, 
                "Você ainda não está participando de nenhum evento. Acesse a seção 'Participar de Eventos' para encontrar eventos disponíveis.");
            appendElements(myEventsContainer, noEventsMessage);
            return;
        }
        
        buildmyEventElements(myEventsContainer, participatingEvents);
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        if (loadingElement) {
            loadingElement.textContent = "Erro ao carregar eventos. Por favor, tente novamente mais tarde.";
        }
    }
}

async function getParticipatingEvents(userStorage) {
    const data = await getRequest(`http://localhost:8080/api/event/V1/byOrganizer/${userStorage.id}`, userStorage);
    return data;
}

function buildmyEventElements(container, events) {
    events.forEach(event => {
        const dateString = formatDate(event.date);
        
        const myEventCard = createElements("div", { class: "my-event-card", id: event.id });
        
        const title = createElements("h4", {}, event.name);
        
        const myEventInfo = createElements("div", { class: "my-event-info" });
        const date = createElements("div", { class: "my-event-date" }, `Data: ${dateString}`);
        const type = createElements("div", { class: "my-event-type" }, `Tipo: ${event.eventType.type}`);
        
        appendElements(myEventInfo, [date, type]);
        appendElements(myEventCard, [title, myEventInfo]);
        appendElements(container, myEventCard);
        
        myEventCard.addEventListener("click", () => showEventDetails(container, event, myEventCard));
    });
}


function showEventDetails(container, event, child) {
    const existingDetail = document.getElementById("event-detail");
    if (existingDetail) {
        existingDetail.remove();
    } else {
        const dateString = formatDate(event.date);
        
        const eventDetail = createElements("div", { id: "event-detail" });
        const title = createElements("h4", {}, event.name);
        
        const dateRow = createElements("div", { class: "detail-row" });
        const dateLabel = createElements("span", { class: "detail-label" }, "Data: ");
        const dateValue = createElements("span", {}, dateString);
        appendElements(dateRow, [dateLabel, dateValue]);
        
        const typeRow = createElements("div", { class: "detail-row" });
        const typeLabel = createElements("span", { class: "detail-label" }, "Tipo: ");
        const typeValue = createElements("span", {}, event.eventType.type);
        appendElements(typeRow, [typeLabel, typeValue]);
        
        const statusRow = createElements("div", { class: "detail-row" });
        const statusLabel = createElements("span", { class: "detail-label" }, "Status: ");
        const statusValue = createElements("span", {}, event.status);
        appendElements(statusRow, [statusLabel, statusValue]);
        
        const merchantsRow = createElements("div", { class: "detail-row" });
        const merchantsLabel = createElements("span", { class: "detail-label" }, "Total de comerciantes: ");
        const merchantsValue = createElements("span", {}, event.merchants.length);
        appendElements(merchantsRow, [merchantsLabel, merchantsValue]);
        
        const descriptionTitle = createElements("h4", {}, "Descrição");
        const description = createElements("div", { class: "event-description" }, event.description);
        
        const detailButtons = createElements("div", { id: "detail-buttons" });
        const backButton = createElements("button", { id: "back-button" }, "Voltar");
        const cancelButton = createElements("button", { id: "cancel-button", class: "button_red" }, "Cancelar Participação");
        
        appendElements(detailButtons, [backButton, cancelButton]);
        
        appendElements(eventDetail, [title, dateRow, typeRow, statusRow, merchantsRow, descriptionTitle, description, detailButtons]);
    
        container.insertBefore(eventDetail, child.nextSibling)
        
        backButton.addEventListener("click", () => {
            eventDetail.remove();
        });
        
        cancelButton.addEventListener("click", () => {
            confirmCancelmyEvent(container, event, eventDetail);
        
        });

    }
}

function confirmCancelmyEvent(container, event) {
    const detailButtons = document.getElementById("detail-buttons");
    detailButtons.innerHTML = "";
    
    const confirmMessage = createElements("p", { class: "confirmation-message" }, "Tem certeza que deseja cancelar sua participação neste evento?");
    const confirmButton = createElements("button", { class: "button_red" }, "Confirmar Cancelamento");
    const backButton = createElements("button", {}, "Voltar");
    
    appendElements(detailButtons, [confirmMessage, confirmButton, backButton]);
    
    confirmButton.addEventListener("click", async () => {
        await cancelmyEvent(event.id);
        location.reload();
    });
    
    backButton.addEventListener("click", () => {
        showEventDetails(container, event);
    });
}

async function cancelmyEvent(eventId) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    
    try {
        await deleteRequest(`http://localhost:8080/api/event/V1/${eventId}`, userStorage)
        console.log(`Participação cancelada no evento ${eventId}`);
        return true;
    } catch (error) {
        console.error("Erro ao cancelar participação:", error);
        return false;
    }
}

function formatDate(date) {
    const dateArray = date.split("T");
    const dateString = dateArray[0].split("-").reverse().join("/");
    const timeString = dateArray[1].split(":").slice(0,2).join(":");
    return `${dateString} - ${timeString}h`;
}