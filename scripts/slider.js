window.addEventListener("load", loadElements);

function loadElements() {
    const slider = document.getElementById("slider");
    const buttonLeft = createElements("input", { type: "button", onClick: "changeSlide(-1)" }, "");
    const buttonRight = createElements("input", { type: "button", onClick: "changeSlide(1)" }, "");    
    const slide0 = createElements("img", { src: "../../public/image0.png", class: "slide active" });
    const slide1 = createElements("img", { src: "../../public/image1.png", class: "slide" });
    const slide2 = createElements("img", { src: "../../public/image2.png", class: "slide" });
    const slide3 = createElements("img", { src: "../../public/image3.png", class: "slide" });
    const slide4 = createElements("img", { src: "../../public/image4.png", class: "slide" });
    const elements = [buttonLeft,slide0, slide1, slide2, slide3, slide4, buttonRight];

    appendElements(slider, elements);    
}

function changeSlide(direction) {
    const slides = [...document.getElementsByClassName("slide")];
    const active = "slide active"
    const index = slides.findIndex(x => x.className.trim() == active);
    slides[index].className = "slide";

    if(index + direction < slides.length && index + direction >= 0){
        slides[index+direction].className = active;

    } else if( index + direction > slides.length -1) {
        slides[0].className = active;
    } else if( index + direction < 0) {
        slides[slides.length -1].className = active;
    }
}

setInterval(() => {
    changeSlide(1);
}, 5000);

