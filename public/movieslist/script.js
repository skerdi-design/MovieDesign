const movieCatalog = document .querySelector(".movie_catalog");
const head = document.querySelector(".head");


const photo = document.querySelector(".mockup");
const container = document.querySelector(".content");
const image = document.querySelector(".img_wraper");
document.onmousemove = mousepos;
function mousepos(e) {
  let pos = {
    x: (e.pageX - window.innerWidth / 2) / 30,
    y: -(e.pageY - window.innerHeight / 2) / 15
  };
  photo.style.transform = `rotatey(${pos.x / 4}deg) rotatex(${pos.y / 3}deg)`;
  container.style.transform = `translate(${-(pos.x / 6)}%, ${pos.y / 8}%)`;
  image.style.transform = `translate(${-(pos.x / 13)}%, ${pos.y / 17}%)`;
}

const scroll_down = document.querySelector(".scroll_butt");
const play = document.querySelector(".play");
scroll_down.addEventListener("click",()=>{
  movieCatalog.style.transform = `translateY(-${window.innerHeight}px)`;
  head.classList.add("unready");
  head.classList.remove("ready");
})
play.addEventListener("click",()=>{
  movieCatalog.style.transform = `translateY(-${window.innerHeight}px)`;
  head.classList.add("unready");
  head.classList.remove("ready");
})
const scroll_up = document.querySelector(".scroll_up");
scroll_up.addEventListener("click",()=>{
  movieCatalog.style.transform = `translateY(0px)`;
  head.classList.remove("unready");
  setTimeout(() => {
    head.classList.add("ready");
  }, 2500);
})


let cloud = document.querySelector(".parallax_0");
let trees1 = document.querySelector(".parallax_1")
let trees2 = document.querySelector(".parallax_2");
let trees3 = document.querySelector(".parallax_3");
let trees4 = document.querySelector(".parallax_4");
let trees5 = document.querySelector(".parallax_5");
let trees6 = document.querySelector(".parallax_6");
let svg_container = document.querySelector(".svg_container");

requestAnimationFrame(scroll);
function scroll(){
  //x is the amount of px the window has moved verticly
  let x = -(movieCatalog.getBoundingClientRect().top);//the translateY
  if(x<window.innerHeight){
    trees1.style.transform = "translateY(" + x / 6 + "%)";//mountain
    trees2.style.transform = "translateY(" + x / 8 + "%)";//darker mountains
    trees3.style.transform = "translateY(" + x / 9 + "%)";//first trees      //the final one
    trees4.style.transform = "translateY(" + x / 10 + "%)";
    trees5.style.transform = "translateY(" + x / 18 + "%)";
    trees6.style.transform = "translateY(" + x / 90 + "%)";
    svg_container.style.transform = "translateY("+ x / 3 +"%)";
    cloud.style.transform = "translateY("+x/4.8+"%)";
  }
  requestAnimationFrame(scroll);
}

function classReady(){
    setTimeout(() => {
      head.classList.add("ready");
    }, 2500);
  svg_container.classList.add("ready");
}
window.onload = ()=>{
  classReady();
}