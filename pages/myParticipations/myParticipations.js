window.addEventListener("load", loadElements);

async function loadElements() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    
    if (!userStorage || userStorage.role !== "MERCHANT") {
        window.location.href = "../../pages/login/login.html";
        return;
    }
    
    const participationsContainer = document.getElementById("participations-container");
    const loadingElement = document.getElementById("loading");
    
    try {
        const participatingEvents = await getParticipatingEvents(userStorage);
        
        if (loadingElement) {
            loadingElement.remove();
        }
        
        if (participatingEvents.length === 0) {
            const noEventsMessage = createElements("div", { class: "no-events-message" }, 
                "Você ainda não está participando de nenhum evento. Acesse a seção 'Participar de Eventos' para encontrar eventos disponíveis.");
            appendElements(participationsContainer, noEventsMessage);
            return;
        }
        
        buildParticipationElements(participationsContainer, participatingEvents);
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        if (loadingElement) {
            loadingElement.textContent = "Erro ao carregar eventos. Por favor, tente novamente mais tarde.";
        }
    }
}

async function getParticipatingEvents(userStorage) {
    const data = await getRequest(`http://localhost:8080/api/event/V1/byMerchant/${userStorage.id}`, userStorage);
    return data;
}

function buildParticipationElements(container, events) {
    events.forEach(event => {
        const dateString = formatDate(event.date);
        
        const participationCard = createElements("div", { class: "participation-card", "data-event-id": event.id });
        
        const title = createElements("h4", {}, event.name);
        
        const participationInfo = createElements("div", { class: "participation-info" });
        const date = createElements("div", { class: "participation-date" }, `Data: ${dateString}`);
        const type = createElements("div", { class: "participation-type" }, `Tipo: ${event.eventType.type}`);
        
        appendElements(participationInfo, [date, type]);
        appendElements(participationCard, [title, participationInfo]);
        appendElements(container, participationCard);
        
        participationCard.addEventListener("click", () => showEventDetails(container, event));
    });
}

function showEventDetails(container, event) {
    const existingDetail = document.getElementById("event-detail");
    if (existingDetail) {
        existingDetail.remove();
    }
    
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
    
    appendElements(container, eventDetail);
    
    backButton.addEventListener("click", () => {
        eventDetail.remove();
    });
    
    cancelButton.addEventListener("click", () => {
        confirmCancelParticipation(container, event, eventDetail);
    });
}

function confirmCancelParticipation(container, event) {
    const detailButtons = document.getElementById("detail-buttons");
    detailButtons.innerHTML = "";
    
    const confirmMessage = createElements("p", { class: "confirmation-message" }, "Tem certeza que deseja cancelar sua participação neste evento?");
    const confirmButton = createElements("button", { class: "button_red" }, "Confirmar Cancelamento");
    const backButton = createElements("button", {}, "Voltar");
    
    appendElements(detailButtons, [confirmMessage, confirmButton, backButton]);
    
    confirmButton.addEventListener("click", async () => {
        await cancelParticipation(event.id);
        location.reload();
    });
    
    backButton.addEventListener("click", () => {
        showEventDetails(container, event);
    });
}

async function cancelParticipation(eventId) {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    
    try {
        const payload = { id: userStorage.id };
        await putRequest(`http://localhost:8080/api/event/V1/removeMerchant/${eventId}`, userStorage, payload);
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
