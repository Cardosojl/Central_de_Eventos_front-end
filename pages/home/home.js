window.addEventListener("load", loadElements);

async function loadElements() {
    const newsContainer = document.getElementById("news-container");
    
    const pastEvents = await getPastEvents();
    
    buildNewsElements(newsContainer, pastEvents);
}

async function getPastEvents() {
    
    return [
        {
            id: 1,
            title: "Festival Gastronômico de Inverno foi um sucesso!",
            date: "2025-03-15T18:00:00",
            description: "O Festival Gastronômico de Inverno reuniu mais de 30 comerciantes e atraiu cerca de 5.000 visitantes durante o final de semana. Os pratos típicos de inverno foram o destaque do evento, com destaque para os fondues e sopas que conquistaram o público.",
            image: "../../public/inverno.png"
        },
        {
            id: 2,
            title: "Innovation Summit Barueri 2025 bateu recorde de público",
            date: "2025-02-20T10:00:00",
            description: "O Innovation Summit Barueri 2025 reuniu especialistas em tecnologia e inovação de todo o país. Com palestras e workshops sobre inteligência artificial, blockchain e sustentabilidade, o evento atraiu mais de 3.000 participantes e estabeleceu parcerias importantes para o desenvolvimento tecnológico da região.",
            image: "../../public/Summit Inovação Barueri 2024.png"
        },
        {
            id: 3,
            title: "Feira de Artesanato Local promoveu cultura e economia criativa",
            date: "2025-01-25T14:30:00",
            description: "A Feira de Artesanato Local reuniu mais de 50 artesãos da região, oferecendo produtos únicos e feitos à mão. O evento não apenas promoveu a cultura local, mas também impulsionou a economia criativa, gerando vendas significativas para os comerciantes participantes.",
            image: "../../public/artesanato.png"
        },
        {
            id: 3,
            title: "Barueri vibra com show de rock ao ar livre!",
            date: "2025-04-01T18:00:00",
            description: "Milhares de pessoas se reuniram em clima de celebração para curtir uma noite inesquecível de música e energia. O evento, que contou com banda ao vivo, luzes intensas e um público animado, mostrou a força da cena cultural local e o sucesso das iniciativas ao ar livre na cidade.",
            image: "../../public/show.png"
        }
    ];
}

function buildNewsElements(container, newsItems) {
    newsItems.forEach(news => {
        const dateObj = new Date(news.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} às ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        
        const newsItem = createElements("div", { class: "news-item" });
        const title = createElements("h2", {}, news.title);
        const date = createElements("p", { class: "news-date" }, `Realizado em: ${formattedDate}`);
        const image = createElements("img", { src: news.image, alt: news.title });
        const description = createElements("p", {}, news.description);
        
        appendElements(newsItem, [title, date, image, description]);
        appendElements(container, newsItem);
    });
}

function formatDate(date) {
    const dateArray = date.split("T");
    const dateString = dateArray[0].split("-").reverse().join("/");
    const timeString = dateArray[1].split(":").slice(0,2).join(":");
    return `${dateString} - ${timeString}h`;
}
