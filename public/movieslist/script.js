let web_parent = document.querySelector(".web_parent")
let images = document.querySelector(".images");
let trees1 = document.querySelector(".parallax_1")
let trees2 = document.querySelector(".parallax_2");
let trees3 = document.querySelector(".parallax_3");
let trees4 = document.querySelector(".parallax_4");
let trees5 = document.querySelector(".parallax_5");
let mockupContainer = document.querySelector(".mockup_container");
let headerContainer = document.querySelector(".header_container");

let rightLine = document.querySelector(".right_line");







const options = document.querySelectorAll("#options");
options.forEach(x=>x.addEventListener("click",()=>{
  options.forEach(y=>{
    y.classList.remove("toggled");
  })
  x.classList.add("toggled");
}))




const scrolltxt = document.querySelector("#scroll");
const section = document.querySelector("#section");
const sectionBody = document.querySelector("#section_body");



const navBar = document.querySelector(".nav_bar_wraper");
const verLinks = document.querySelector(".vertical_links");

// const title = document.querySelector(".title");


let scrollContent;
let scrolling = 0;

let Scrollbar = window.Scrollbar;
let opt = {
  damping: 0.095,
}
const scrollmethods = Scrollbar.init(web_parent,opt);
scrollmethods.addListener((status)=>{


  if(status.offset.y > 20){
    scrolltxt.classList.add("down");
  }else{
    scrolltxt.classList.remove("down");
  }
  if(status.offset.y > window.innerHeight/1.1){
    navBar.classList.add("down");
    verLinks.classList.add("down");
  }else{
    navBar.classList.remove("down");
    verLinks.classList.remove("down");
  }
  if(status.offset.y > window.innerHeight/ 1.5){
    section.classList.add("down");
    sectionBody.classList.add("down");
  }else{
    section.classList.remove("down");
    sectionBody.classList.remove("down");
    // title.classList.remove("down");
  }

  // let st = status.offset.y;
  // if(st > scrolling){
  //   console.log("scrolling down");
  //   // topNav.style.opacity = '0.1';
  //   for(let i =0;i<numParticels;i++){
  //     particle.speed = particle.speed + 100;
  //   }
  // }else if(st < scrolling){
  //   console.log("scrolling up");
  //   // topNav.style.opacity = '1';
  // }
  // scrolling = st <= 0 ? 0 : st;//scrolling = if st is smaller or equal than 0 is 0 otherwise it is = to st
})
// console.log({Scrollbar});
// console.log(scrollmethods.offset.y);







let rightNav = document.querySelector(".right_nav");
// let images = document.querySelector(".images");


// let topNav = document.querySelector(".top_nav");
  scrollContent = document.querySelector(".scroll-content");
  requestAnimationFrame(scroll);
  function scroll(){
    let x = -(scrollContent.getBoundingClientRect().top);
  //x is the amount of px the window has moved verticly
  //the translateY
  if(x < window.innerHeight +30){
    trees1.style.transform = "translateY(" + x / 5.5 + "%)";//mountain
    trees2.style.transform = "translateY(" + x / 7 + "%)";//darker mountains
    trees3.style.transform = "translateY(" + x / 9 + "%)";//first trees      //the final one
    trees4.style.transform = "translateY(" + x / 12 + "%)";
    trees5.style.transform = "translateY(" + x / 17 + "%)";
    mockupContainer.style.transform = "translateY(" + x / 10 + "%)";
    headerContainer.style.transform = "translateY(" + x / 10 + "%)";
  }
  // if(x > window.innerHeight/1.5){
  //   topNav.style.opacity = 1;
  // }else{
  //   topNav.style.opacity = 0;
  // }
  if(x>window.innerHeight + 30){
    //for the body top_nav
    // console.log("hi")
    rightNav.style.transform = `translateY(${x-window.innerHeight - 30}px)`;
    // canvas.style.transform = `translateY(${x-window.innerHeight + 30}px)`;
    // topNav.style.transform = `translateY(${x-window.innerHeight -30}px)`;
    //scrolling handler ==============================================================================
    //let st = x;
    // if(st > scrolling){
      // console.log("scrolling down");
      // topNav.style.opacity = '0.1';
    // }else if(st < scrolling){
      // console.log("scrolling up");
      // topNav.style.opacity = '1';
    // }
    //scrolling = st <= 0 ? 0 : st;//scrolling = if st is smaller or equal than 0 is 0 otherwise it is = to st
    // pop.style.top = 40 + body.scrollTop+"px";
  }else{
    rightNav.style.transform = `translateY(0px)`;
  }
  requestAnimationFrame(scroll);
}






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

// let search_icon = document.querySelector(".search_icon");
// let search = document.querySelector(".search");
// search_icon.addEventListener("click",()=>{
//   let bool = false
//   for(let i = 0; i < search.classList.length;i++){
//     if(search.classList[i]=="open"){
//       bool = true
//     }
//   }
//   if(bool == false){
//     search.classList.add("open");
//   }else{
//     search.classList.remove("open");
//   }
// })


let searchButt = document.querySelector(".search_butt");
let searchInput = document.querySelector(".search_input");
searchButt.addEventListener("click",()=>{
  searchButt.classList.toggle("focus");
  searchInput.classList.toggle("searching");
});



// let state = true;

// sliderEle.addEventListener("click",()=>{
//   if(state == true){
//     sliderEle.classList.add("focus");
//   }else{
//     sliderEle.classList.remove("focus");
//   }
//   state = true;
//   console.log("added");
// })

const ele = document.querySelectorAll(".ele");
ele.forEach(x=>{x.addEventListener("click",()=>{
  x.classList.toggle("toggled")
})})

































const canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight/2.8;
if(window.innerWidth < 600){
  canvas.height = window.innerHeight/3.5;
}


let particle;
let array = []
let time = 0;
let numParticels = Math.floor(window.innerWidth / 8);

class Particles {
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.tube = {
      r:this.x+randomNumber(40,100),
      l:this.x-randomNumber(40,100)
    }
    this.speed = -(this.r+2)/6;
    this.bounce = randomNumber(this.r/2,-this.r/2);
  }
  update(){
    this.y = this.y + this.speed;
    if(this.y+this.r/2 < 0){
      this.y = canvas.height+this.r/2
    }
    if(this.x+this.r/2>this.tube.r){
      this.bounce = -1
    }else if(this.x-this.r/2<this.tube.l){
      this.bounce = 1
    }
    this.x = this.x + this.bounce;
    this.alpha = maping(this.y,canvas.height,0-this.r/2,1,0);
  }
  paint(){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,207,70,${this.alpha})`;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}


for(let i = 0;i < numParticels;i++){
  particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(1,4));
  array.push(particle)
}
setInterval(()=>{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i = 0;i < numParticels;i++){
    array[i].update();
    array[i].paint();
  }
}, 60)


window.addEventListener('resize',()=>{
  time = 2;
  canvas.width = window.innerWidth;
  if(window.innerWidth < 600){
    canvas.height = window.innerHeight/3.5;
  }else{
    canvas.height = window.innerHeight/2.8;
  }
  numParticels = Math.floor(canvas.width / 8);
  let interval = setInterval(()=>{
    time = time - 1;
    if(time <= 0){
      array = [];
      for(let i =0;i<numParticels;i++){
        particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(1,4));
        array.push(particle);
      }
      clearInterval(interval);
    }
    
    
  },300)
});
function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min;
  return r;
}
function maping(init, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  let value = (init - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}
