let webParent,sectionLines;
//left nav mapping ===========================================================================================
let mappedH,mappedS,mappedL,headScale,bodyScale;
//parallax background images =================================================================================
const para1 = document.querySelector(".parallax_1");
const para2 = document.querySelector(".parallax_2");
const para3 = document.querySelector(".parallax_3");
const para4 = document.querySelector(".parallax_4");
const para5 = document.querySelector(".parallax_5");
const text = document.querySelector(".text_wraper");
//right body nav =============================================================================================
const rightNav = document.querySelector(".right_nav");
const options = document.querySelectorAll(".options");
//search wraper
const searchButt = document.querySelector(".search_butt");
const searchinput = document.querySelector(".search_input");
//ouside left nav
const leftNav = document.querySelector(".outside_left_nav");
const topNav = document.querySelector(".outside_top_nav");


function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}
function constrain (n, low, high) {
  return Math.max(Math.min(n, high), low);
};
function mapping (target,x1,x2,y1,y2,withinBounds){
  let newVal = ((target-x1)/(x2-x1))*(y2-y1)+y1;
  if(!withinBounds){
    return newVal
  }
  if (y1 < y2) {
    return constrain(newVal, y1, y2);
  } else {
    return constrain(newVal, y2, y1);
  }
}


function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min;
  return r;
}



//------------------------------------------------------------------------------------------------------------
function handleScrolling () {
  webParent = document.querySelector(".web_parent");
  let Scrollbar = window.Scrollbar;
  let opt = {
    damping: 0.09,
    renderByPixels: false
  };

  class EdgeEasingPlugin extends Scrollbar.ScrollbarPlugin {
    static pluginName = "edgeEasing";
    _remainMomentum = {
      x: 0,
      y: 0
    };
    transformDelta(delta) {
      const { limit, offset } = this.scrollbar;
      const x = this._remainMomentum.x + delta.x;
      const y = this._remainMomentum.y + delta.y;
      // clamps momentum within [-offset, limit - offset]
      this.scrollbar.setMomentum(
        Math.max(-offset.x, Math.min(x, limit.x - offset.x)),
        Math.max(-offset.y, Math.min(y, limit.y - offset.y))
      );
      return { x: 0, y: 0 };
    }
    onRender(remainMomentum) {
      Object.assign(this._remainMomentum, remainMomentum);
    }
  }
  Scrollbar.use(EdgeEasingPlugin);
  const scrollMethods = Scrollbar.init(webParent,opt);

  //scroll event funcrtions ================================================================================
  sectionLines = document.querySelector(".section_lines");
  const headLine = sectionLines.querySelector(".head_line");
  const bodyLine = sectionLines.querySelector(".body_line");
  const root = document.documentElement;

  scrollMethods.addListener((info)=>{
    let offset = info.offset.y;
    leftNavMapping(offset,root);

    teggleScrollText(offset);

    leftNavUpdate(offset)
  });
};
//------------------------------------------------------------------------------------------------------------
searchButt.addEventListener("click",()=>{
  optionsToggle(searchButt,'active');
  optionsToggle(searchinput,'active');
})



function leftNavUpdate(x) {
  if(x > window.innerHeight-100){
    leftNav.classList.add("down");
    topNav.classList.add("down");
  }else{
    leftNav.classList.remove("down");
    topNav.classList.remove("down");
  };
};

function optionsToggle (element,className) {
  element.classList.toggle(className);
};

function teggleScrollText(x) {
  let scroll = document.querySelector(".scroll_text");
  if(x>40){
    scroll.classList.add("down");
  }else{
    scroll.classList.remove("down");
  };
};

window.onload = () =>{
  handleScrolling();
  const scrollContent = document.querySelector(".scroll-content");
  requestAnimationFrame(animate)
  function animate() {
    let topOffset = scrollContent.getBoundingClientRect().top
    //animation that run only on the head
    if(-(topOffset) < window.innerHeight +50){
      parallaxAnimation(-(topOffset))
      canvasAnimation ()
    }
    //animation that run only on the body
    if(-(topOffset) > window.innerHeight + 50){
      rightNav.style.transform = `translateY(${-(topOffset)-window.innerHeight - 50}px)`;
    }else{
      rightNav.style.transform = `translateY(0px)`;
    };
    requestAnimationFrame(animate);
  };
};



options.forEach(x=>x.addEventListener("click",()=>{
  options.forEach(y=>{
    y.classList.remove("active");
  })
  x.classList.add("active");
  // console.log(x.classList[1])
  // if(x.classList[1] === "edit"){
  //   moviesList.classList.add("edit_mode")
  // }else{
  //   moviesList.classList.remove("edit_mode")
  // }
}))



const ele = document.querySelectorAll(".ele");
ele.forEach(x=>{x.addEventListener("click",(e)=>{
  // }else{
  //   x.classList.add("toggled")
  // }
  // if(e.target == x.querySelector(".close_wraper")){
  //   x.classList.remove("toggled")
  // }
  if(e.target == x.querySelector(".bookmark_wraper")){
    x.parentElement.classList.toggle("fav");
  }else{
    x.parentElement.classList.toggle("toggled")
  }
})})




function parallaxAnimation(x) {
  text.style.transform = "translateY(" + x / 8.5 + "%)";
  para1.style.transform = "translateY(" + x / 5.5 + "%)";
  para2.style.transform = "translateY(" + x / 7 + "%)";
  para3.style.transform = "translateY(" + x / 9 + "%)";
  para4.style.transform = "translateY(" + x / 12 + "%)";
  para5.style.transform = "translateY(" + x / 17 + "%)";
}


function leftNavMapping(x,ele){
  mappedH = Math.floor(mapping(x,0,window.innerHeight,305,338,true));
  mappedS = Math.floor(mapping(x,0,window.innerHeight,72,100,true));
  mappedL = Math.floor(mapping(x,0,window.innerHeight,9,45,true));
  headScale = Math.floor(mapping(x,0,window.innerHeight+200 ,100,40,true));
  bodyScale = Math.floor(mapping(x,0,window.innerHeight+200 ,40,100,true));

  ele.style.setProperty("--line-color",`hsl(${mappedH}, ${mappedS}%, ${mappedL}%)`)
  ele.style.setProperty("--head-scale",`scaleX(${headScale}%)`)
  ele.style.setProperty("--body-scale",`scaleX(${bodyScale}%)`)
}



//canvas animation ====================================================================================
const canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth*1.1;
canvas.height = window.innerHeight/2.8;

if(window.innerWidth < 600){
  canvas.height = window.innerHeight/3.5;
}


let particle;
let array = []
let time = 0;
let numParticels;


class Particles {
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.tube = {
      r:this.x+randomNumber(40,100),
      l:this.x-randomNumber(40,100)
    }
    this.speed = -this.r/14;
    this.bounce = randomNumber(-this.speed,this.speed);
  }
  update(){
    this.y = this.y + this.speed;
    if(this.y+this.r/2 < 0){
      this.y = canvas.height+this.r/2
    }
    if(this.x+this.r/2>this.tube.r){
      this.bounce = -0.2
    }else if(this.x-this.r/2<this.tube.l){
      this.bounce = 0.2
    }
    this.x = this.x + this.bounce;
    this.alpha = mapping(this.y,canvas.height,0-this.r/2,1,0.2);
  }
  paint(){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,207,70,${this.alpha})`;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}
windowResize();
function windowResize(){
  window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth + 90
    redraw()
  });
  redraw();
}
function redraw() {
  array = [];
  numParticels = Math.floor(window.innerWidth / 10)
  for(let i = 0;i < numParticels;i++){
    if(canvas.width <= 900){
      particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(1,3));
    array.push(particle)
    }else{
      particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(1,3.5));
    array.push(particle)
    }
  }
}

function canvasAnimation () {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i = 0;i < numParticels;i++){
    array[i].update();
    array[i].paint();
  }
}