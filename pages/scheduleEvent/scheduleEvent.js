window.addEventListener("load", loadElements);


async function loadElements() {
    const eventTypes = await getEventsTypes();
    const eventDays = await getEventsDay();
    buildElements(eventTypes, eventDays);
}

async function buildElements(eventTypes, eventDays) {
    const eventTypeSelectIndex =  eventTypes.map(x => x.id);
    const eventTypeSelectNames = eventTypes.map(y => y.type);
    const mainContainer = document.getElementById("main_container");
    const tittle = createElements("h3", {}, "Agendar eventos");
    const labelName = createElements("label", {}, "Nome do evento:");
    const inputName = createElements("input", { type: "text", name: "name" });
    const labelEventType = createElements("label", {}, "Tipo de evento:");
    const selectEventTyoe = createSelect(eventTypeSelectIndex,eventTypeSelectNames,"1", "eventType", "eventType");
    const labelMonth = createElements("label", {}, "Mês:");
    const selectMonth = createElements("select", { id: "month_select", name: "month" });
    const labelDay = createElements("label", {}, "Dia:");
    const selectDay = createElements("select", { id: "day_select", name: "day" });
    const labelDash = createElements("label", {}, "-");
    const labelTwoDots = createElements("label", { style: "margin-left: -10px;"}, ":")
    const labelTime = createElements("label", {}, "Hora:");
    const selectHour = createSelect(range(8,20), range(8,20), 8, "hour", "hour");
    const selectMinutes = createSelect(["00", "30"], ["00", "30"], "00", "minutes", "minutes");
    const labelDescription = createElements("label", {}, "Descrição:");
    const textDescription = createElements("textarea", { name: "description" });
    const labelRequest = createElements("label", {}, "Solicitação:");
    const textRequest = createElements("textarea", { name: "eventRequest" });
    const divName = createContainer("div", {}, [labelName, inputName]);
    const divEventType = createContainer("div", {}, [labelEventType, selectEventTyoe]);
    const divDate = createContainer("div", {}, [labelMonth, selectMonth, labelDay, selectDay, labelDash, labelTime, selectHour, labelTwoDots, selectMinutes]);
    const divDescription = createContainer("div", { id: "schedule_event_text" }, [labelDescription, textDescription]);
    const divRequest = createContainer("div", { id: "schedule_event_text" }, [labelRequest, textRequest]);
    const button = createElements("button", {id: "schedule_event_button"}, "Enviar");
    const divButton = createContainer("div", { id: "schedule_event_button_div" }, [button]);
    const formContainer = createContainer("form", { id: "container" }, [divName, divEventType, divDate, divDescription, divRequest, divButton]);
    appendElements(mainContainer, [tittle, formContainer]);
    getCalendar(selectMonth, selectDay, eventDays);
}

function getInitialWeekDay() {
    const today = new Date();
    const weekday = today.getDay();
    const mondayDays = 7 - weekday + 1;
    const start = new Date(today);
    start.setDate(today.getDate() + mondayDays);
    return start;
  }

  function getMonths(nextWeekInitial) {
    const selectMonth = document.getElementById("month_select");
    const initialMonth = nextWeekInitial.getMonth();
    const months = getMonthsList();

    selectMonth.innerHTML = "";
    for (let m = initialMonth; m < 12; m++) {
      const option = createElements("option", { value: m }, months[m]);
      appendElements(selectMonth, [option]);
    }
  }

  function getDays(diaSelect, month, year, nextWeekInitial, events) {
    diaSelect.innerHTML = "";
    const lastDay = new Date(year, month + 1, 0).getDate();
    let addDays = 0;
  
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(year, month, d);
  
      if (date >= nextWeekInitial) {
        const formatedDate = formatDataISO(date); 
  
        if (!events.has(formatedDate)) {
          const option = createElements("option", { value: d }, d);
          diaSelect.appendChild(option);
          addDays++;
        }
      }
    }
  
    if (addDays === 0) {
      const option = createElements("option", { disabled: true }, "Sem dias disponíveis");
      diaSelect.appendChild(option);
    }
  }
  
  function formatDataISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getCalendar(selectMonth, selectDay, events) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextWeekInitial = getInitialWeekDay();

    getMonths(nextWeekInitial);

    const initialMonth = nextWeekInitial.getMonth();
    selectMonth.value = initialMonth;
    getDays(selectDay, initialMonth, currentYear, nextWeekInitial, events);

    selectMonth.addEventListener("change", () => {
      const mesSelecionado = parseInt(selectMonth.value);
      getDays(selectDay, mesSelecionado, currentYear, nextWeekInitial, events);
    });
  }

  function getMonthsList() {
    return [
      "Janeiro", "Fevereiro", "Março", "Abril",
      "Maio", "Junho", "Julho", "Agosto",
      "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  }
    

function formatDate() {
    const year = new Date().getFullYear()
    let month = parseInt(document.getElementsByName("month")[0].value) + 1;
    let day = document.getElementsByName("day")[0].value;
    let hour = document.getElementsByName("hour")[0].value;
    const minutes = document.getElementsByName("minutes")[0].value;
    console.log(month)

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    hour = hour < 10 ? `0${hour}` : hour;

    return `${year}-${month}-${day}T${hour}:${minutes}:00`;
}


async function getEventsDay() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const data = await getRequest(`http://localhost:8080/api/event/V1/byCurrentDate`, userStorage);
    let dates = [];
    data.forEach(x => dates.push(x.date));
    const scheduledDates = new Set(
        dates.map(d => d.split("T")[0])
      );
    return scheduledDates;
}

async function getEventsTypes() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const data = await getRequest(`http://localhost:8080/api/event_type/V1?limit=100`, userStorage);
    return data;
}

async function sendEvent() {
    const userStorage = JSON.parse(localStorage.getItem("userData"));
    const eventName = document.getElementsByName("name");
    const eventDate = formatDate();
    const eventType = document.getElementsByName("eventType");
    const eventDescription = document.getElementsByName("description");
    const eventRequest = document.getElementsByName("eventRequest");
    const payload = {
        name: eventName[0].value,
        eventRequest: eventRequest[0].value,
        description: eventDescription[0].value,
        organizer: userStorage.id,
        eventType: eventType[0].value,
        date: eventDate
    }
    const response = await postRequest("http://localhost:8080/api/event/V1", userStorage, payload);
    if(response.ok) {
        window.location.href = "../../pages/myEvents/myEvents.html";
    }
}

document.addEventListener("click", (e) => {
    const button = document.getElementById("schedule_event_button");
    if(e.target == button) {
        e.preventDefault();
        sendEvent();
    }
})