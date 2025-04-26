window.addEventListener("load", loadElements);

async function loadElements() {
    const eventsContainer = document.getElementById("events-container");
    const loadingElement = document.getElementById("loading");
    
    try {
        const upcomingEvents = await getUpcomingEvents();
        
        if (loadingElement) {
            loadingElement.remove();
        }
        
        buildEventElements(eventsContainer, upcomingEvents);
        
        setupModal();
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        if (loadingElement) {
            loadingElement.textContent = "Erro ao carregar eventos. Por favor, tente novamente mais tarde.";
        }
    }
}

async function getUpcomingEvents() {
    const response = await getRequestPublic("http://localhost:8080/public/api/event/V1?status=APPROVED");
    return response;
}

function buildEventElements(container, events) {
    events.forEach(event => {
        const dateString = formatDate(event.date);
        
        const eventCard = createElements("div", { class: "event-card", "data-event-id": event.id });
        
        const eventInfo = createElements("div", { class: "event-info" });
        const title = createElements("h2", {}, event.name);
        const date = createElements("p", { class: "event-date" }, `Data: ${dateString}`);
        
        appendElements(eventInfo, [title, date]);
        
        const detailsButton = createElements("button", { class: "event-action" }, "Ver Detalhes");
        
        appendElements(eventCard, [eventInfo, detailsButton]);
        appendElements(container, eventCard);
        
        eventCard.addEventListener("click", () => showEventDetails(event));
    });
}

function showEventDetails(event) {
    const modal = document.getElementById("event-details-modal");
    const content = document.getElementById("event-details-content");
    
    content.innerHTML = "";
    
    const dateString = formatDate(event.date);
    
    const title = createElements("h2", {}, event.name);
    
    const dateRow = createElements("div", { class: "event-detail-row" });
    const dateLabel = createElements("span", { class: "event-detail-label" }, "Data: ");
    const dateValue = createElements("span", {}, dateString);
    appendElements(dateRow, [dateLabel, dateValue]);
    
    const typeRow = createElements("div", { class: "event-detail-row" });
    const typeLabel = createElements("span", { class: "event-detail-label" }, "Tipo: ");
    const typeValue = createElements("span", {}, event.eventType.type);
    appendElements(typeRow, [typeLabel, typeValue]);
    
    const statusRow = createElements("div", { class: "event-detail-row" });
    const statusLabel = createElements("span", { class: "event-detail-label" }, "Status: ");
    const statusValue = createElements("span", {}, event.status);
    appendElements(statusRow, [statusLabel, statusValue]);

    
    const descriptionTitle = createElements("h3", {}, "Descrição");
    const description = createElements("div", { class: "event-description" }, event.description);
    
    appendElements(content, [title, dateRow, typeRow, descriptionTitle, description]);
    
    modal.style.display = "block";
}

function setupModal() {
    const modal = document.getElementById("event-details-modal");
    const closeButton = document.querySelector(".close-button");
    
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function formatDate(date) {
    const dateArray = date.split("T");
    const dateString = dateArray[0].split("-").reverse().join("/");
    const timeString = dateArray[1].split(":").slice(0,2).join(":");
    return `${dateString} - ${timeString}h`;
}
