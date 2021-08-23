//ouside left nav
const leftNav = document.querySelector(".outside_left_nav");
const topNav = document.querySelector(".outside_top_nav");
//search wraper
const searchButt = document.querySelector(".search_butt");
const searchinput = document.querySelector(".search_input");
const search = document.querySelector(".search");
// web parent
let webParent;
const root = document.documentElement;
let topOffset;
//mapping left nav lines
let mappedH,mappedS,mappedL,scale;
//parallax images 
const para1 = document.querySelector(".parallax_1");
const para2 = document.querySelector(".parallax_2");
const para3 = document.querySelector(".parallax_3");
const para4 = document.querySelector(".parallax_4");
const para5 = document.querySelector(".parallax_5");
const text = document.querySelector(".text_wraper");

//movies list =========================================================================
const movieList = document.querySelector(".movie_list");
//right body nav =============================================================================================
const rightNav = document.querySelector(".right_nav");
const sendTop = document.querySelector(".send_top");
const options = document.querySelectorAll(".options");
//lerp ball ========================================================
const Ball = document.querySelector(".lerp_ball");
let ball = new mouseFollowCircle();



function lerp (start, end, amt){
  return (1-amt)*start+amt*end;
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
let scrollMethods;
function scrollIntoView(){
  scrollMethods.scrollIntoView(document.querySelector('.body'), {
    offsetLeft: 0,
    offsetTop: 0,
    alignToTop: true,
    onlyScrollIfNeeded: false
  });
}
function handleScrolling () {
  webParent = document.querySelector(".web_parent");
  let Scrollbar = window.Scrollbar;
  let opt = {
    damping: 0.085,
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
  scrollMethods = Scrollbar.init(webParent,opt);

  sendTop.addEventListener("click",()=>{
    scrollIntoView();
  })
};












searchButt.addEventListener("click",()=>{
  optionsToggle(searchButt,'active');
  optionsToggle(searchinput,'active');
  optionsToggle(search,'active');
});
function optionsToggle (element,className) {
  element.classList.toggle(className);
};



function leftNavUpdate(x) {
  if(x > window.innerHeight-50){
    leftNav.classList.add("down");
    topNav.classList.add("down");
  }else{
    leftNav.classList.remove("down");
    topNav.classList.remove("down");
  };
};

function toggleScrollText(x) {
  let scroll = document.querySelector(".scroll_text");
  if(x>40){
    scroll.classList.add("down");
  }else{
    scroll.classList.remove("down");
  };
};

function parallaxAnimation(x) {
  text.style.cssText = "transform:translateY(" + x / 8.5 + "%);";
  para1.style.cssText = "transform:translateY(" + x / 5.5 + "%);";
  para2.style.cssText = "transform:translateY(" + x / 7 + "%);";
  para3.style.cssText = "transform:translateY(" + x / 9 + "%);";
  para4.style.cssText = "transform:translateY(" + x / 12 + "%);";
  para5.style.cssText = "transform:translateY(" + x / 17 + "%);";
}
function leftNavMapping(x,ele){
  mappedL = Math.floor(mapping(x,0,window.innerHeight,9,45,true));
  scale = Math.floor(mapping(x,0,window.innerHeight + 80 ,60,0,true));

  ele.style.setProperty("--line-color",`hsl(338, 100%, ${mappedL}%)`)
  ele.style.setProperty("--head-scale",`scaleX(calc(40% + ${scale}%))`);
  ele.style.setProperty("--body-scale",`scaleX(calc(100% - ${scale}%))`);
}


















options.forEach(x=>x.addEventListener("click",()=>{
  options.forEach(y=>{
    y.classList.remove("active");
  })
  x.classList.add("active");
  if(x.dataset.mode === "home"){
    if(movieList.dataset.mode === "home"){
      movieList.classList.remove("edit_mode");
      return;
    }
    movieList.dataset.mode = "home";
    displayAll();
  }
  if(x.dataset.mode === "bookmark"){
    let list = bookmarkFilter();
    movieListUpdate()
    .then(()=>{
      for(let i = 0;i<list.length;i++){
        list[i].eleWraper.style.display = "none";
      }
    })
    movieList.dataset.mode = "bookmark";
  }
  if(x.dataset.mode === "edit"){
    movieList.classList.add("edit_mode");
  }else{
    movieList.classList.remove("edit_mode");
  }
}));





















let mx = 0;
let my = 0;
let target = document.querySelector("html");
document.onmousemove = function (e) {
  mx = e.pageX;
  my = e.pageY;
  target = e.target;
};
function mouseFollowCircle (){
  this.x = 0;
  this.y = 0;
  this.size = 0;
  this.hover = false;
  this.color;

  this.checkHover = function () {
    this.hover = false;
    if (target.dataset.type === "object") {
      this.hover = true;
    }
    this.color = target.dataset.color;
  };
  this.update = function () {
    this.mx = mx;
    this.my = my;
    this.x = lerp(this.x, this.mx, 0.26);
    this.y = lerp(this.y, this.my, 0.26);
    if (this.hover) {
      this.size = lerp(this.size, 1, 0.2);
    } else if(this.size > 0.01){
      this.size = lerp(this.size, 0, 0.3);
    }
  };
  this.move = function (ele,x) {
    ele.style.background = this.color;
    ele.style.transform = `translate(${this.x - ele.clientWidth / 2}px,${
      this.y - ele.clientHeight / 2 + x
    }px) scale(${this.size})`;
  };
};
function ballFunctions(x) {
  ball.checkHover();
  ball.update();
  ball.move(Ball,-x);
}







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
    this.bouncSpeed=this.r/2;
    this.tube = {
      r:this.x+randomNumber(40,100),
      l:this.x-randomNumber(40,100)
    }
    this.speed = -this.r/15;
    this.bounce = randomNumber(-this.speed,this.speed);
  }
  update(){
    this.y = this.y + this.speed;
    if(this.y+this.bouncSpeed < 0){
      this.y = canvas.height+this.bouncSpeed
    }
    if(this.x+this.bouncSpeed>this.tube.r){
      this.bounce = -0.2
    }else if(this.x-this.bouncSpeed<this.tube.l){
      this.bounce = 0.2
    }
    this.x = this.x + this.bounce;
    this.alpha = mapping(this.y,canvas.height,0-this.bouncSpeed,1,0.3);
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
    redraw();
  });
  redraw();
}
function redraw() {
  array = [];
  numParticels = Math.floor(window.innerWidth / 15)
  for(let i = 0;i < numParticels;i++){
    if(canvas.width <= 900){
      particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(1,3));
      array.push(particle)
    }else{
      particle = new Particles(randomNumber(0,canvas.width),randomNumber(0,canvas.height),randomNumber(2,4));
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




//== backend elements and requests =======================================================================
//== backend elements and requests =======================================================================
//== backend elements and requests =======================================================================
//== backend elements and requests =======================================================================
//== backend elements and requests =======================================================================
function getFetch (path) {
  return new Promise((res,rej)=>{
    fetch(path)
    .then(response=>response.json())
    .then((data)=>{res(data)})
  })
}
function postFetch (path,body) {
  let options = {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    redirect: 'follow',
    body:JSON.stringify(body)
  };
  return new Promise((res,rej)=>{
    fetch(path,options)
    .then(response=>response.json())
    .then((data)=>{res(data)})
  });
};

function prepMovies(array){
  for(let i = 0; i < array.length; i++){
    let movie = {
      name:array[i].name,
      link:array[i].link,
      img:array[i].img,
      genre:array[i].genre,
      rating:array[i].rating,
      type:array[i].type,
      time:array[i].time,
      bookmark:array[i].bookmark
    };
    movieObject.push(new Film(movie));
  };
};


function namesTransitionDelay(){
  let names = document.querySelectorAll(".name");
  names.forEach(x=>{
    for(let i = 0; i< x.children.length; i++){
      x.children[i].style.transitionDelay = `${i*0.045}s`
    }
  })
};















function bookmarkFilter(){
  let bookmarks = movieObject.filter((film)=>{
    return film.bookmark === false
  })
  return bookmarks
}
function displayAll(){
  movieListUpdate()
  .then(()=>{
    for(let i = 0;i<movieObject.length;i++){
      movieObject[i].eleWraper.style.display = "flex"
    }
  })
}


let movieWraper = document.querySelector(".movie_wraper");
let USER;
let movieObject = [];

//get request for the movies when the web loads pushes all the movies in the 2 arrays moviObject and bookmarkObject
getFetch("/eleinfo")
.then((data)=>{USER = data;})
.then(()=>{
  prepMovies(USER);
  console.log(movieObject);
  for(let i = movieObject.length-1;i >= 0; i--){
    movieObject[i].mapName();
    movieObject[i].buildMovie();
    movieObject[i].display();
    movieObject[i].addeventlistener();
  }
  namesTransitionDelay();

  searchObj.searchLister();
})
.catch((err)=>{
  if(err){
    console.log("NO USER FOUND WITH THAT COOKIE!!!",err);
  }else{
    console.log("SOMETHING HAPPEND WITH THE QUERY OF D.B.!!!");
  };
});



class Film {
  constructor(data){
    this.link = data.link;
    this.img = data.img;
    this.rating = data.rating;
    this.name = data.name;
    this.genre = data.genre;
    this.bookmark = data.bookmark;
    this.type = data.type;
    this.time = data.time;

    this.Name = [];
    this.eleWraper;
  }
  mapName(){
    this.Name = [];
    for(let i = 0;i < this.name.length; i++){
      let span;
      if(this.name[i] !== " "){
        span = `<span>${this.name[i]}</span>`;
        this.Name.push(span);
      }else{
        span = `<span class='space'>${this.name[i+1]}</span>`;
        this.Name.push(span);
        i++;
      }
    }
  }
  buildMovie(){
    this.eleWraper = document.createElement("div");
    this.eleWraper.classList.add("ele_wraper");
    this.eleWraper.classList.add("flex_middle");
    this.eleWraper.innerHTML = 
    `
            <div class="edit_wraper flex_middle">
              <svg class="svg-icon" width="40" height="14" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7ZM24.5 7C24.5 9.48528 22.4853 11.5 20 11.5C17.5147 11.5 15.5 9.48528 15.5 7C15.5 4.51472 17.5147 2.5 20 2.5C22.4853 2.5 24.5 4.51472 24.5 7ZM37.5 7C37.5 9.48528 35.4853 11.5 33 11.5C30.5147 11.5 28.5 9.48528 28.5 7C28.5 4.51472 30.5147 2.5 33 2.5C35.4853 2.5 37.5 4.51472 37.5 7Z"/>
              </svg>                             
            </div>
            <div class="ele">
              <div class="info_wraper">
                <div class="section play flex_middle"></div>
                <div class="section info flex_middle"></div>
                <div class="section genre flex_middle">
                  <p>Drama, miniseires</p>
                </div>
              </div>
            </div>
            <div class="image_wraper flex_middle">
              <img src="https://i.pinimg.com/originals/5a/d3/f1/5ad3f1a8c6a04f5eda5d5f2fa1331626.jpg">
              <div class="bookmark_wraper flex_middle" data-bookmark="${this.bookmark}">
                <svg class="svg-icon" width="23" height="42" viewBox="0 0 23 42" fill="none">
                  <path d="M1.5 39.5V1H21.5V39.5L11.5 29.5L1.5 39.5Z" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="name_parent">
              <p class="name">
                <span>q</span>
                <span>u</span>
                <span>e</span>
                <span>e</span>
                <span>n</span>
                <span>'</span>
                <span>s</span>
                <span class="space">g</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>i</span>
                <span>t</span>
              </p>
            </div>
    `
    // this.eleWraper.innerHTML = 
    // `
    //   <div class="edit_wraper flex_middle">
    //     <svg class="svg-icon" viewBox="0 0 20 20">
    //       <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
    //     </svg>
    //   </div>
    //   <div class="ele">
    //     <div class="image_wraper flex_middle">
    //       <div class="image_parent flex_middle">
    //         <img src="${this.img}">
    //       </div>
    //       <div class="bookmark_wraper flex_middle" data-bookmark="${this.bookmark}">
    //         <svg class="svg-icon" viewBox="0 0 20 20">
    //           <path d="M14.467,1.771H5.533c-0.258,0-0.47,0.211-0.47,0.47v15.516c0,0.414,0.504,0.634,0.802,
    //           0.331L10,13.955l4.136,4.133c0.241,0.241,0.802,0.169,0.802-0.331V2.241C14.938,1.982,14.726,
    //           1.771,14.467,1.771 M13.997,16.621l-3.665-3.662c-0.186-0.186-0.479-0.186-0.664,0l-3.666,
    //           3.662V2.711h7.994V16.621z"/>
    //         </svg>
    //       </div>
    //     </div>
    //     <div class="info_parent flex_middle">
    //       <div class="section rating flex_middle">
    //         <p>Rating:<span>${this.rating}</span></p>
    //       </div>
    //       <div class="section genre flex_middle">
    //         <div class="top_line"></div>
    //         <div class="bottom_line"></div>
    //         <p>Genre:<span>${this.genre}</span></p>
    //       </div>
    //       <div class="section play flex_middle">
    //         <a href="${this.link}" target="_blank" class="play_butt flex_middle" data-type="object" data-color="rgba(209, 68, 134, 0.2)">
    //           <p>WATCH</p>
    //           <svg width="31" class="svg-icon" height="33" viewBox="0 0 31 33" xmlns="http://www.w3.org/2000/svg" fill="none">
    //             <path d="M29.335 17.376L3.23225 31.7455C2.56579 32.1124 1.75 31.6303 1.75 30.8695L1.75 2.13049C1.75 1.36972 2.56579 0.887574 3.23225 1.25446L29.335 15.624C30.0254 16.004 30.0254 16.996 29.335 17.376Z" stroke-width="4"/>
    //           </svg>   
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    //   <div class="name_parent flex_middle">
    //     <p class="name" data-name="${this.name}">
    //       ${this.Name.join(" ")}
    //     </p>
    //   </div>
    // `
  }
  display(){
    movieWraper.appendChild(this.eleWraper);
  }
  updateMovie(){
    this.eleWraper.innerHTML = 
    `
      <div class="edit_wraper flex_middle">
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
        </svg>
      </div>
      <div class="ele">
        <div class="image_wraper flex_middle">
          <div class="image_parent flex_middle">
            <img src="${this.img}">
          </div>
          <div class="bookmark_wraper flex_middle" data-bookmark="${this.bookmark}">
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path d="M14.467,1.771H5.533c-0.258,0-0.47,0.211-0.47,0.47v15.516c0,0.414,0.504,0.634,0.802,
              0.331L10,13.955l4.136,4.133c0.241,0.241,0.802,0.169,0.802-0.331V2.241C14.938,1.982,14.726,
              1.771,14.467,1.771 M13.997,16.621l-3.665-3.662c-0.186-0.186-0.479-0.186-0.664,0l-3.666,
              3.662V2.711h7.994V16.621z"/>
            </svg>
          </div>
        </div>
        <div class="info_parent flex_middle">
          <div class="section rating flex_middle">
          <p>Rating:<span>${this.rating}</span></p>
          </div>
          <div class="section genre flex_middle">
            <div class="top_line"></div>
            <div class="bottom_line"></div>
            <p>Genre:<span>${this.genre}</span></p>
          </div>
          <div class="section play flex_middle">
            <a href="${this.link}" target="_blank" class="play_butt flex_middle" data-type="object" data-color="rgba(209, 68, 134, 0.2)">
              <p>WATCH</p>
              <svg width="31" class="svg-icon" height="33" viewBox="0 0 31 33" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M29.335 17.376L3.23225 31.7455C2.56579 32.1124 1.75 31.6303 1.75 30.8695L1.75 2.13049C1.75 1.36972 2.56579 0.887574 3.23225 1.25446L29.335 15.624C30.0254 16.004 30.0254 16.996 29.335 17.376Z" stroke-width="4"/>
              </svg>   
            </a>
          </div>
        </div>
      </div>
      <div class="name_parent flex_middle">
        <p class="name" data-name="${this.name}">
          ${this.Name.join(" ")}
        </p>
      </div>
    `
  }
  addeventlistener(){
    this.eleWraper.addEventListener("click",(e)=>{
      if(e.target == this.eleWraper.querySelector(".play_butt")){
        return;
      }
      if(e.target == this.eleWraper.querySelector(".edit_wraper")){
        let data = {
          name:this.name,
          link:this.link,
          img:this.img,
          genre:this.genre,
          rating:this.rating,
          type:this.type,
          time:this.time
        }
        form.edit(data,this);
        return;
      }


      if(e.target.dataset.bookmark === "false"){
        let body = {
          name:this.name,
          bookmark:true
        }
        postFetch("mockFavEdit",body)
        .then(permition=>{
          if(permition){
            e.target.dataset.bookmark = "true";
            this.bookmark = true;
            this.eleWraper.classList.add("fav");
          }else{
            console.log("something went wrong trying to edit favorites");
          }
        })
        .catch(reason=>{
          console.log(`favorite rejected because ${reason}`);
        })
      }else if (e.target.dataset.bookmark === "true"){
        let body = {
          name:this.name,
          bookmark:false
        }
        postFetch("mockFavEdit",body)
        .then(permition=>{
          if(permition){
            e.target.dataset.bookmark = "false";
            this.bookmark = false;
            this.eleWraper.classList.remove("fav");
          }else{
            console.log("something went wrong trying to edit favorites");
          }
        })
        .catch(reason=>{
          console.log(`favorite rejected because ${reason}`);
        })
      }else{
        this.eleWraper.classList.toggle("toggled");
      }
    })
  }
  hidden(){
    let top = this.eleWraper.getBoundingClientRect();
    this.ele = this.eleWraper.querySelector(".ele");
    this.nameParent = this.eleWraper.querySelector(".name_parent");
    this.imageParent = this.eleWraper.querySelector("img");


    if(top.top < window.innerHeight + 100){
      this.ele.classList.remove("hidden");
    }else{
      this.ele.classList.add("hidden");
    }
  }
}





















class Form {
  constructor(){
    this.formOverlay = document.querySelector(".form_overlay");
    this.form = document.querySelector(".form");
    this.time = document.querySelector(".time");
    this.timeAdded = document.querySelector(".time_added");

    this.name = this.form.querySelector("#name");
    this.link = this.form.querySelector("#link");
    this.img = this.form.querySelector("#image");
    this.genre = this.form.querySelector("#genre");
    this.rating = this.form.querySelector("#rating");
    this.type = this.form.querySelector("#types");
    this.nameValue = document.querySelector(".name_value");
    this.imgValue = document.querySelector(".img_value");

    this.openButt = document.querySelector(".add_butt");
    this.closeButt = document.querySelector(".remove_butt");

    this.buttons = this.form.querySelector(".button_holder");
    this.loader = document.querySelector(".loader");
    this.submitButt = this.form.querySelector(".submit_butt");
    this.editButt = this.form.querySelector(".edit_butt");
    this.deleteButt = this.form.querySelector(".delete_butt");
  }

  handleTime(){
    let months = ["JAN","FEB","MAR","APR","MAY","JUNE","JULY","AUG","SEP","OCT","NOV","DEC"]
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();

    this.time.innerHTML=`${months[month]}. ${day} ${year}`;
    return this.time.innerHTML;
  }


  eventListener(){
    this.closeButt.addEventListener("click",()=>{
      this.formOverlay.classList.remove("open");
      this.formOverlay.classList.remove("edit");
      this.timeAdded.innerHTML = "";
      form.clear();

      this.buttons.classList.remove("loading");
      this.loader.classList.remove("loading");
    })
    this.openButt.addEventListener("click",()=>{
      this.formOverlay.classList.add("open");
      form.handleTime();
    })

    this.editButt.addEventListener("click",()=>{

      this.buttons.classList.add("loading");
      this.loader.classList.add("loading");

      let data = {
        data:{
          name:this.element.name,
          link:this.element.link,
          img:this.element.img,
          genre:this.element.genre,
          rating:this.element.rating,
          time:this.element.time,
          bookmark:this.element.bookmark
        },
        updatedData:{
          name:this.name.value,
          link:this.link.value,
          img:this.img.value,
          genre:this.genre.value,
          rating:this.rating.value,
          time:this.time.innerHTML,
          bookmark:this.element.bookmark
        }
      }
      postFetch("/mockUserEdit",data)
      .then((permition)=>{
        if(permition){
          this.element.name = data.updatedData.name,
          this.element.link = data.updatedData.link,
          this.element.img = data.updatedData.img,
          this.element.genre = data.updatedData.genre,
          this.element.rating = data.updatedData.rating,
          this.element.time = data.updatedData.time,
          this.element.bookmark = data.updatedData.bookmark
        }
        this.element.mapName();
        this.element.updateMovie();
        namesTransitionDelay();
      })
      .then(()=>{
        setTimeout(() => {
          this.formOverlay.classList.remove("open");
          this.formOverlay.classList.remove("edit");
  
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
          form.clear();
        }, 500);
      })
    })

    this.deleteButt.addEventListener("click",()=>{
      this.buttons.classList.add("loading");
      this.loader.classList.add("loading");

      let data = {
        name:this.element.name,
        link:this.element.link,
        img:this.element.img,
        genre:this.element.genre,
        rating:this.element.rating,
        time:this.element.time,
        bookmark:this.element.bookmark,
      }
      postFetch("/mockUserDelete",data)
      .then((permition)=>{
        if(permition){
          movieWraper.removeChild(this.element.eleWraper);
          let eleIndex = movieObject.findIndex(({name})=>{
            return name === data.name; 
          })
          movieObject.splice(eleIndex,1);
        }else{
          console.log("MOVIE HAS NOT BEEN DELETED!!!");
        }
      })
      .then(()=>{
        setTimeout(() => {
          this.formOverlay.classList.remove("open");
          this.formOverlay.classList.remove("edit");
  
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
          form.clear();
        }, 500);
      })
    })

    this.form.addEventListener("submit",(e)=>{
      this.buttons.classList.add("loading");
      this.loader.classList.add("loading");

      e.preventDefault();
      let data = {
        name:this.name.value,
        link:this.link.value,
        img:this.img.value,
        genre:this.genre.value,
        rating:this.rating.value,
        type:this.type.value,
        time:this.time.innerHTML,
        bookmark:false
      };
      this.submit(data);
    })

    this.name.addEventListener("input",()=>{
      this.nameValue.innerHTML = this.name.value;
    })

    this.img.addEventListener("change",()=>{
      if(this.img.value.length == 0){
        this.imgValue.style.opacity = `0`;
      }else{
        let url = this.img.value
        function checkimg(url) {
          form.imgValue.src = url;
        }
        checkimg(url);
        this.imgValue.style.opacity = `1`;
      }
    })

  }

  submit(body){
    postFetch("/mockUserAdd",body)
    .then((data)=>{
      if(data){
        movieObject.push(new Film(body));
        movieWraper.innerHTML = "";
        movieObject[movieObject.length-1].mapName();
        movieObject[movieObject.length-1].buildMovie();
      }
    })
    .then(()=>{
      for(let i = movieObject.length-1;i >= 0; i--){
        movieObject[i].display();
      }
      movieObject[movieObject.length-1].addeventlistener();
      namesTransitionDelay();

      setTimeout(() => {
        this.formOverlay.classList.remove("open");
        this.formOverlay.classList.remove("edit");

        this.buttons.classList.remove("loading");
        this.loader.classList.remove("loading");
        form.clear();
      }, 500);
    })
  }
  edit(object,film){
    this.name.value = object.name;
    this.link.value = object.link;
    this.img.value = object.img;
    this.genre.value = object.genre;
    this.rating.value = object.rating;
    this.type.value = object.type;
    this.timeAdded.innerHTML = `Last Update: `+ object.time;
    this.nameValue.innerHTML = object.name;
    this.imgValue.src = object.img;
    this.imgValue.style.opacity = `1`;

    this.element = film;
    this.formOverlay.classList.add("edit");
    form.handleTime();
  }
  clear(){
    setTimeout(() => {
      this.name.value = "";
      this.link.value = "";
      this.img.value = "";
      this.genre.value = "";
      this.rating.value = "";
      this.type.value = "";
      this.imgValue.src = " ";
      this.nameValue.innerHTML = "";
      this.imgValue.style.opacity = `0`;
    }, 250);
  }
}
let form = new Form();
form.eventListener();
form.handleTime();






function movieListUpdate() {
  movieList.classList.add("updating");
  return new Promise ((res,rej)=>{
    scrollIntoView()
    setTimeout(() => {
      movieList.classList.remove("updating");
      res(true)
    }, 600);
  })
}






class searchBar {
  constructor(){
    this.input = document.querySelector("#search");
    this.inputResult = document.querySelector(".input_result")
    this.resultWraper = document.querySelector(".result_wraper");
  }

  find(nameValue,array){
    return array.filter((obj) => {
      const regex = new RegExp(nameValue, "gi");
      return obj.name.match(regex);
    });
  }

  searchLister(){
    this.input.addEventListener("focus",()=>{
      this.inputResult.classList.add("focus");
    })
    this.input.addEventListener("blur",()=>{
      this.inputResult.classList.remove("focus");
    })
    this.input.addEventListener("keypress",(e)=>{
      if(e.key === "Enter"){
        movieListUpdate()
        .then(()=>{
          let elt = searchObj.find(this.input.value,movieObject);
          for(let i = 0;i<movieObject.length;i++){
            movieObject[i].eleWraper.style.display = "none"
          }
          for(let i = 0;i<elt.length;i++){
            elt[i].eleWraper.style.display = "flex"
          }
          this.inputResult.classList.remove("focus");
          this.input.blur();
          this.input.value = "";
        })
      }
    })
    this.input.addEventListener("input",()=>{
      console.log(this.input.value);
      if (this.input.value !== "") {
        let citiesArr = searchObj.find(this.input.value,movieObject);
        let html = citiesArr
          .map((x) => {
            return `
            <div class="ele_search">
              <p>${x.name}</p>
            </div>`;
          })
          .join(" ");
          document.querySelector(".result_wraper").innerHTML = html;
      } else {
        document.querySelector(".result_wraper").innerHTML = "";
      }
      searchObj.eleListeners();
    });
  }

  eleListeners(){
    let eleSearch = document.querySelectorAll(".ele_search");
    eleSearch.forEach((x)=>{
      x.addEventListener("mousedown",()=>{
        this.input.value = x.children[0].innerText;
        this.inputResult.classList.remove("focus");
        let elt = searchObj.find(this.input.value,movieObject);
        movieListUpdate()
        .then(()=>{
          for(let i = 0;i<movieObject.length;i++){
            movieObject[i].eleWraper.style.display = "none"
          }
          console.log(elt);
          elt[0].eleWraper.style.display = "flex";
        })
      })
    })
  }
}
let searchObj = new searchBar()











const debug = document.querySelector(".debug");
debug.addEventListener("click",()=>{
  let USER = {
    username:"devil",
    email:"devil@cry.com",
    password:"devilmaycry"
  }
  let options = {
    method:"POST",
    headers:{
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body:JSON.stringify(USER)
  };
  fetch("/mockUserInsert",options).then((res)=>{
    return res.json();
  }).then((info)=>{
    if(info){
      console.log("User Added!!!");
    }else{
      console.log("User Already Exist!!!");
    }
  })
})















window.onload = () =>{
  handleScrolling();
  const scrollContent = document.querySelector(".scroll-content");



  requestAnimationFrame(animate);
  function animate () {
    topOffset = scrollContent.getBoundingClientRect().top;
    //animation that run only on the head
    if(-(topOffset) < window.innerHeight){
      parallaxAnimation(-topOffset);
      canvasAnimation();

      leftNavMapping(-topOffset,root);
      toggleScrollText(-topOffset);
      leftNavUpdate(-topOffset);
    }
    //animation that run only on the body
    if(-(topOffset) > window.innerHeight + 40){
      // for(let i = movieObject.length-1;i >= 0; i--){
      //   movieObject[i].hidden();
      // }

      rightNav.style.cssText = `transform:translateY(${-(topOffset)-window.innerHeight - 50}px);`;
    }else{
      rightNav.style.cssText = `transform:translateY(0px);`;
    };
    ballFunctions(topOffset);
    requestAnimationFrame(animate);
  }
};

