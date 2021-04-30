let web_parent = document.querySelector(".web_parent")
let images = document.querySelector(".images");
let cloud = document.querySelector(".parallax_0");
let trees1 = document.querySelector(".parallax_1")
let trees2 = document.querySelector(".parallax_2");
let trees3 = document.querySelector(".parallax_3");
let trees4 = document.querySelector(".parallax_4");
let trees5 = document.querySelector(".parallax_5");
let rightLine = document.querySelector(".right_line");
console.log(rightLine);

let scrollContent;

let Scrollbar = window.Scrollbar;
let options = {
  damping: 0.09,
  renderByPixels: false,
}
Scrollbar.init(web_parent,options);



let rightNav = document.querySelector(".right_nav");
let topNav = document.querySelector(".top_nav");

setTimeout(()=>{
  scrollContent = document.querySelector(".scroll-content");
  console.log("ready");
  requestAnimationFrame(scroll);
  function scroll(){
  //x is the amount of px the window has moved verticly
  let x = -(scrollContent.getBoundingClientRect().top);//the translateY
  if(x<window.innerHeight +30){
    cloud.style.transform = "translateY("+x/4+"%)";
    trees1.style.transform = "translateY(" + x / 6 + "%)";//mountain
    trees2.style.transform = "translateY(" + x / 8 + "%)";//darker mountains
    trees3.style.transform = "translateY(" + x / 10 + "%)";//first trees      //the final one
    trees4.style.transform = "translateY(" + x / 12 + "%)";
    trees5.style.transform = "translateY(" + x / 18 + "%)";
    // console.log("running")
  }
  if(x>window.innerHeight + 30){
    //for the body top_nav
    rightNav.style.transform = `translateY(${x-window.innerHeight - 30}px)`;
    topNav.style.transform = `translateY(${x-window.innerHeight -30}px)`;
  }
  // rightLine.style.transform = `translateY(${x}px)`;
  requestAnimationFrame(scroll);
}
},0)


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
  container.style.transform = `translate(${-(pos.x / 8)}%, ${pos.y / 6}%)`;
  image.style.transform = `translate(${-(pos.x / 13)}%, ${pos.y / 6}%)`;
}