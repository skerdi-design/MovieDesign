//ouside left nav
const leftNav = document.querySelector(".outside_left_nav");
const topNav = document.querySelector(".outside_top_nav");
//search wraper
const searchButt = document.querySelector(".search_butt");
const searchinput = document.querySelector(".search_input");
const search = document.querySelector(".search");
// web parent
let webParent;
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
let counter = 20;
function parallaxAnimation(x) {
  if(counter > 0.001){
    x = x - counter;
    counter = lerp(counter,0,0.1)
  }
  text.style.cssText = "transform:translateY(" + x / 8.5 + "%);";
  para1.style.cssText = "transform:translateY(" + x / 5.5 + "%);";
  para2.style.cssText = "transform:translateY(" + x / 7 + "%);";
  para3.style.cssText = "transform:translateY(" + x / 9 + "%);";
  para4.style.cssText = "transform:translateY(" + x / 12 + "%);";
  para5.style.cssText = "transform:translateY(" + x / 17 + "%);";
}

let headLine = document.querySelector(".head_line");
let bodyLine = document.querySelector(".body_line");

function leftNavMapping(x){
  mappedL = mapping(x,0,window.innerHeight,9,45,true);
  scale = mapping(x,0,window.innerHeight + 80 ,60,0,true);

  headLine.style.cssText = `background: hsl(338, 100%, ${mappedL}%); transform: scaleX(calc(40% + ${scale}%));`;
  bodyLine.style.cssText = `background: hsl(338, 100%, ${mappedL}%); transform: scaleX(calc(100% - ${scale}%));`;
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
      return;
    }
    if(this.size < 0.01){
      this.size = 0;
      return;
    }
    this.size = lerp(this.size, 0, 0.3);
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
  numParticels = Math.floor(window.innerWidth / 12)
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
      bookmark:array[i].bookmark,
      file:array[i].file
    };
    movieObject.push(new Film(movie));
  };
};


function namesTransitionDelay(){
  let names = document.querySelectorAll(".name");
  names.forEach(x=>{
    for(let i = 0; i< x.children.length; i++){
      x.children[i].style.transitionDelay = `${i*0.095}s`
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

getFetch("/eleInfo")
.then((data)=>{USER = data;})
.then(()=>{
  prepMovies(USER);

  checkMovieArray();
  for(let i = movieObject.length-1;i >= 0; i--){
    movieObject[i].mapName();
    movieObject[i].buildMovie();
    movieObject[i].display();
    movieObject[i].addeventlistener();
  }
  namesTransitionDelay();

  searchObj.searchLister();

  imgRatios();
})
.catch((err)=>{
  if(err){
    console.log("NO USER FOUND WITH THAT COOKIE!!!",err);
  }else{
    console.log("SOMETHING HAPPEND WITH THE QUERY OF D.B.!!!");
  };
});



function checkMovieArray(){
  let empty = document.createElement("div");
  empty.classList.add("ele_wraper");
  empty.classList.add("flex_middle");
  empty.innerHTML = 
  `
    <div class="ele"></div>
    <p>No Movies Added</p>
  `;
  if(movieObject.length == 0){
    movieWraper.appendChild(empty);
  }
}
class Film {
  constructor(data){
    this.name = data.name;
    this.link = data.link;
    this.img = data.img;
    this.rating = data.rating;
    this.genre = data.genre;
    this.type = data.type;
    this.time = data.time;
    this.bookmark = data.bookmark;
    this.file = data.file;

    // this.Name = [];
    this.eleWraper;
  }
  mapName(){
    this.Name = [];
    let word = [];
    for(let i = 0;i < this.name.length + 1; i++){
      let span;
      if(i === this.name.length || this.name[i] === " "){
        let wordbreak = `<span class='word'>${word.join(" ")}</span>`;
        this.Name.push(wordbreak);
        word = [];
      }else{
        span = "<span class='letter'>"+this.name[i]+"</span>";
        word.push(span);
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
        <div class="section play flex_middle">
          <a href="${this.link}" target="_blank" class="play_butt flex_middle" data-type="object" data-color="rgba(255, 82, 144, 0.2)">
            <svg class="svg-icon" width="31" height="36" viewBox="0 0 31 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 16.268C31.3333 17.0378 31.3333 18.9623 30 19.7321L3 35.3205C1.66666 36.0903 -1.68435e-06 35.1281 -1.61807e-06 33.5885L-2.75998e-07 2.41154C-2.09723e-07 0.87194 1.66667 -0.0903097 3 0.679491L30 16.268Z" fill="#773464"/>
            </svg> 
          </a> 
        </div>
        <div class="section genre flex_middle">
          <p class="label">Genre:</p>
          <p>${this.genre}</p>
        </div>
        <div class="section info">
          <div class="child flex_middle">
            <div class="rating flex_middle">
              <p class="label">Rating:</p>
              ${this.rating}
            </div>
            <div class="border"></div>
          </div>
          <div class="child flex_middle">
            <div class="type flex_middle">
              <p class="label">Type:</p>
              ${this.type}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="image_wraper flex_middle">
      <img src="${this.img}">
      <div class="bookmark_wraper flex_middle" data-bookmark="${this.bookmark}">
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path d="M14.467,1.771H5.533c-0.258,0-0.47,0.211-0.47,0.47v15.516c0,0.414,0.504,0.634,0.802,0.331L10,13.955l4.136,4.133c0.241,0.241,0.802,0.169,0.802-0.331V2.241C14.938,1.982,14.726,1.771,14.467,1.771 M13.997,16.621l-3.665-3.662c-0.186-0.186-0.479-0.186-0.664,0l-3.666,3.662V2.711h7.994V16.621z"></path>
        </svg>
      </div>
    </div>
    <div class="name_parent">
      <p class="name" data-name="${this.name}">
        ${this.Name.join(" ")}
      </p>
    </div>
    `
  }
  display(){
    movieWraper.appendChild(this.eleWraper);
  }
  updateMovie(){
    this.eleWraper.innerHTML = 
    `
    <div class="edit_wraper flex_middle">
      <svg class="svg-icon" width="40" height="14" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7ZM24.5 7C24.5 9.48528 22.4853 11.5 20 11.5C17.5147 11.5 15.5 9.48528 15.5 7C15.5 4.51472 17.5147 2.5 20 2.5C22.4853 2.5 24.5 4.51472 24.5 7ZM37.5 7C37.5 9.48528 35.4853 11.5 33 11.5C30.5147 11.5 28.5 9.48528 28.5 7C28.5 4.51472 30.5147 2.5 33 2.5C35.4853 2.5 37.5 4.51472 37.5 7Z"/>
      </svg>                             
    </div>
    <div class="ele">
      <div class="info_wraper">
        <div class="section play flex_middle">
          <a href="${this.link}" target="_blank" class="play_butt flex_middle" data-type="object" data-color="rgba(255, 82, 144, 0.2)">
            <svg class="svg-icon" width="31" height="36" viewBox="0 0 31 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 16.268C31.3333 17.0378 31.3333 18.9623 30 19.7321L3 35.3205C1.66666 36.0903 -1.68435e-06 35.1281 -1.61807e-06 33.5885L-2.75998e-07 2.41154C-2.09723e-07 0.87194 1.66667 -0.0903097 3 0.679491L30 16.268Z" fill="#773464"/>
            </svg> 
          </a> 
        </div>
        <div class="section genre flex_middle">
          <p class="label">Genre:</p>
          <p>${this.genre}</p>
        </div>
        <div class="section info">
          <div class="child flex_middle">
            <div class="rating flex_middle">
              <p class="label">Rating:</p>
              ${this.rating}
            </div>
            <div class="border"></div>
          </div>
          <div class="child flex_middle">
            <div class="type flex_middle">
              <p class="label">Type:</p>
              ${this.type}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="image_wraper flex_middle">
      <img src="${this.img}">
      <div class="bookmark_wraper flex_middle" data-bookmark="${this.bookmark}">
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path d="M14.467,1.771H5.533c-0.258,0-0.47,0.211-0.47,0.47v15.516c0,0.414,0.504,0.634,0.802,0.331L10,13.955l4.136,4.133c0.241,0.241,0.802,0.169,0.802-0.331V2.241C14.938,1.982,14.726,1.771,14.467,1.771 M13.997,16.621l-3.665-3.662c-0.186-0.186-0.479-0.186-0.664,0l-3.666,3.662V2.711h7.994V16.621z"></path>
        </svg>
      </div>
    </div>
    <div class="name_parent">
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
        form.edit(this);
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
    this.editWraper = this.eleWraper.querySelector(".edit_wraper")
    this.nameParent = this.eleWraper.querySelector(".name_parent");

    if(top.top < window.innerHeight + 100){
      this.ele.classList.remove("hidden");
      this.nameParent.classList.remove("hidden");
      this.editWraper.classList.remove("hidden");
    }else{
      this.ele.classList.add("hidden");
      this.nameParent.classList.add("hidden");
      this.editWraper.classList.add("hidden");
    }
  }
}


function imgRatios() {
  let imageWraper = movieObject[0].eleWraper.querySelector(".image_wraper");
  let ratio = imageWraper.clientWidth/imageWraper.clientHeight;

  for(let i = 0 ; i < movieObject.length ; i++){
    let img = movieObject[i].eleWraper.querySelector("img");
    img.onload = ()=>{
      let imgRatio = img.width/img.height;
      if(imgRatio > ratio){
        img.classList.add("height");
      }else{
        img.classList.add("width");
      }
    }
  }
}








class Form {
  constructor(){
    this.element;

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

    this.fileObject;
    this.fileInput = document.querySelector("#image_file");
    this.fileClicked = false;
    this.imgContainer = document.querySelector(".img_container");
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
    this.form.addEventListener("click",()=>{
      this.form.classList.remove("invalid_img");
      this.form.classList.remove("invalid_name");
    })

    this.img.addEventListener("change",()=>{
      this.fileClicked = false;
      if(this.img.value.length == 0){
        this.imgValue.classList.remove("width");
        this.imgValue.classList.remove("height");
      }else{
        let url = this.img.value
        this.imgValue.src = url;
      }
    })

    this.imgValue.onload = ()=>{
      // let isLoaded = this.imgValue.complete && this.imgValue.naturalHeight !== 0; //true if loaded
      this.imgValue.classList.remove("width");
      this.imgValue.classList.remove("height");
      let x = this.imgContainer.getBoundingClientRect();
      let ratio = x.width/x.height;
      
      if((this.imgValue.width/this.imgValue.height) > ratio){
        this.imgValue.classList.add("height");
      }else{
        this.imgValue.classList.add("width");
      }
    }

    this.fileInput.addEventListener("change",()=>{
      this.fileClicked = true;
      this.img.value = this.fileInput.files[0].name;
      this.fileObject = this.fileInput.files[0];
      this.imgValue.src = URL.createObjectURL(this.fileInput.files[0]);
    })

    


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
  
      if(this.fileClicked){
        let name = {name:this.name.value}
        postFetch("/Checkname",name)
        .then((check)=>{
          if(!check){
            console.log("invalid_name class added !!!");
            this.form.classList.add("invalid_name");
            this.buttons.classList.remove("loading");
            this.loader.classList.remove("loading");
          }else{
            let fd = new FormData();
            fd.append("file",this.fileObject);
            fetch('/AddMovieFile', {
              method: 'POST',
              body:fd
            })
            .then(response=>response.json())
            .then((url)=>{
              let regex = /.([A-Z]).*/g;
              let imgLink = this.element.img.match(regex)[0];
              let imgURL = imgLink.substring(0, imgLink.length-5);
              imgURL= imgURL.substring(1);


              let body = {
                data: {
                  name:this.element.name,
                  link:this.element.link,
                  img:this.element.img,
                  genre:this.element.genre,
                  rating:this.element.rating,
                  type:this.element.type,
                  time:this.element.time,
                  bookmark:this.element.bookmark,
                  file:this.element.file
                },
                updatedData: {
                  name:this.name.value,
                  link:this.link.value,
                  img:url,
                  genre:this.genre.value,
                  rating:this.rating.value,
                  type:this.type.value,
                  time:this.time.innerHTML,
                  bookmark:this.element.bookmark,
                  file:this.element.file
                },
                imgURL: imgURL
              }
              postFetch("/editMovieFile",body)
              .then((permision)=>{
                if(permision){
                  this.element.name = body.updatedData.name,
                  this.element.link = body.updatedData.link,
                  this.element.img = body.updatedData.img,
                  this.element.genre = body.updatedData.genre,
                  this.element.rating = body.updatedData.rating,
                  this.element.time = body.updatedData.time,
                  this.element.type = body.updatedData.type,
                  this.element.bookmark = body.updatedData.bookmark,
                  this.element.file = body.updatedData.file
                }
                this.element.mapName();
                this.element.updateMovie();
                namesTransitionDelay();
                imgRatios();
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
          }
        })
        .catch(()=>{
          console.log("invalid_name class added !!!");
          this.form.classList.add("invalid_name");
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
        })

      }else{
        let data = {
          data:{
            name:this.element.name,
            link:this.element.link,
            img:this.element.img,
            genre:this.element.genre,
            rating:this.element.rating,
            type:this.element.type,
            time:this.element.time,
            bookmark:this.element.bookmark,
            file:this.element.file
          },
          updatedData:{
            name:this.name.value,
            link:this.link.value,
            img:this.img.value,
            genre:this.genre.value,
            rating:this.rating.value,
            type:this.type.value,
            time:this.time.innerHTML,
            bookmark:this.element.bookmark,
            file:this.element.file
          }
        }
        postFetch("/editMovie",data)
        .then((permition)=>{
          if(permition){
            this.element.name = data.updatedData.name,
            this.element.link = data.updatedData.link,
            this.element.img = data.updatedData.img,
            this.element.genre = data.updatedData.genre,
            this.element.rating = data.updatedData.rating,
            this.element.time = data.updatedData.time,
            this.element.type = data.updatedData.type,
            this.element.bookmark = data.updatedData.bookmark,
            this.element.file = data.updatedData.file
          }
          this.element.mapName();
          this.element.updateMovie();
          namesTransitionDelay();
          imgRatios();
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
        .catch(()=>{
          console.log("invalid_name class added !!!");
          this.form.classList.add("invalid_name");
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
        })
      }
    })




    this.deleteButt.addEventListener("click",()=>{
      this.buttons.classList.add("loading");
      this.loader.classList.add("loading");

      if(this.element.file){
        let regex = /.([A-Z]).*/g;
        let imgLink = this.element.img.match(regex)[0];
        let imgURL = imgLink.substring(0, imgLink.length-5);
        imgURL= imgURL.substring(1);

        let data = {
          imgURL: imgURL,
          name:this.element.name,
          link:this.element.link,
          img:this.element.img,
          genre:this.element.genre,
          rating:this.element.rating,
          type:this.type.value,
          time:this.element.time,
          bookmark:this.element.bookmark,
          file:this.element.file
        }
        postFetch("/DeleteMovieFile",data)
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
        .catch((reason)=>{
          console.log(reason+" this is the reason NOT DELETED!!!");
        })
      }else{
        let data = {
          name:this.element.name,
          link:this.element.link,
          img:this.element.img,
          genre:this.element.genre,
          rating:this.element.rating,
          type:this.type.value,
          time:this.element.time,
          bookmark:this.element.bookmark,
          file:this.element.file
        }
        postFetch("/DeleteMovie",data)
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
        .catch((reason)=>{
          console.log(reason+" this is the reason NOT DELETED!!!");
        })
      }
    })



    this.form.addEventListener("submit",(e)=>{
      e.preventDefault();
      if(this.imgValue.height === 0){
        this.form.classList.add("invalid_img");
      }else{
        this.buttons.classList.add("loading");
        this.loader.classList.add("loading");
        
        if(this.fileClicked){
          let data = {
            name:this.name.value,
            link:this.link.value,
            img:this.img.value,
            genre:this.genre.value,
            rating:this.rating.value,
            type:this.type.value,
            time:this.time.innerHTML,
            bookmark:false,
            file:true
          };
          this.submit(data,data.file);
        }else{
          let data = {
            name:this.name.value,
            link:this.link.value,
            img:this.img.value,
            genre:this.genre.value,
            rating:this.rating.value,
            type:this.type.value,
            time:this.time.innerHTML,
            bookmark:false,
            file:false
          };
          this.submit(data,data.file);
        }
      }
    })

    this.name.addEventListener("input",()=>{
      this.nameValue.innerHTML = this.name.value;
    })

  }




  submit(body,file){
    if(file){
      let name = {name:body.name}
      postFetch("/Checkname",name)
      .then((check)=>{
        if(!check){
          console.log("invalid_name class added !!!");
          this.form.classList.add("invalid_name");
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
        }else{
          let fd = new FormData();
          fd.append("file",this.fileObject);
          fetch('/AddMovieFile', {
            method: 'POST',
            body:fd
          })
          .then(response=>response.json())
          .then((url)=>{
            let body = {
              name:this.name.value,
              link:this.link.value,
              img:url,
              genre:this.genre.value,
              rating:this.rating.value,
              type:this.type.value,
              time:this.time.innerHTML,
              bookmark:false,
              file:true
            }
            postFetch("/Insertmovie",body)
            .then(()=>{
              movieObject.push(new Film(body));
              movieWraper.innerHTML = "";
              movieObject[movieObject.length-1].mapName();
              movieObject[movieObject.length-1].buildMovie();
            })
            .then(()=>{
              for(let i = movieObject.length-1;i >= 0; i--){
                movieObject[i].display();
              }
              movieObject[movieObject.length-1].addeventlistener();
              namesTransitionDelay();
              imgRatios();
      
              setTimeout(() => {
                this.formOverlay.classList.remove("open");
                this.formOverlay.classList.remove("edit");
      
                this.buttons.classList.remove("loading");
                this.loader.classList.remove("loading");
                form.clear();
              }, 500);
            })
          })
        }
      })
      .catch(()=>{
        console.log("invalid_name class added !!!");
        this.form.classList.add("invalid_name");
        this.buttons.classList.remove("loading");
        this.loader.classList.remove("loading");
      })
    }else{
      postFetch("/AddMovie",body)
      .then((permision)=>{
        if(permision){
          movieObject.push(new Film(body));
          movieWraper.innerHTML = "";
          movieObject[movieObject.length-1].mapName();
          movieObject[movieObject.length-1].buildMovie();

          for(let i = movieObject.length-1;i >= 0; i--){
            movieObject[i].display();
          }
          movieObject[movieObject.length-1].addeventlistener();
          namesTransitionDelay();
          imgRatios();
  
          setTimeout(() => {
            this.formOverlay.classList.remove("open");
            this.formOverlay.classList.remove("edit");
  
            this.buttons.classList.remove("loading");
            this.loader.classList.remove("loading");
            form.clear();
          }, 500);
        }else{
          console.log("invalid_name class added !!!");
          this.form.classList.add("invalid_name");
          this.buttons.classList.remove("loading");
          this.loader.classList.remove("loading");
          return;
        }
      })
      .catch(()=>{
        console.log("invalid_name class added !!!");
        this.form.classList.add("invalid_name");
        this.buttons.classList.remove("loading");
        this.loader.classList.remove("loading");
      })
    }
  }





  edit(film){
    this.element = film;

    this.name.value = film.name;
    this.link.value = film.link;
    this.img.value = film.img;
    this.genre.value = film.genre;
    this.rating.value = film.rating;
    this.type.value = film.type;
    this.timeAdded.innerHTML = `Last Update: `+ film.time;
    this.nameValue.innerHTML = film.name;
    this.imgValue.src = film.img;

    this.formOverlay.classList.add("edit");
    form.handleTime();
  }
  clear(){
    this.fileClicked = false;
    setTimeout(() => {
      this.name.value = "";
      this.link.value = "";
      this.img.value = "";
      this.genre.value = "";
      this.rating.value = "";
      this.type.value = "";
      this.imgValue.src = " ";
      this.nameValue.innerHTML = "";
      this.form.classList.remove("invalid_name");
      this.form.classList.remove("invalid_img");
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
          movieList.dataset.mode = "";
        })
      }
    })
    this.input.addEventListener("input",()=>{
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
          elt[0].eleWraper.style.display = "flex";
        })
      })
    })
    movieList.dataset.mode = "";
  }
}
let searchObj = new searchBar()







window.onload = () =>{
  let loadingScreen = document.querySelector(".loading_overlay");
  setTimeout(() => {
    loadingScreen.classList.add("close");
    counter = 50;
  }, 1300);

  handleScrolling();
    const scrollContent = document.querySelector(".scroll-content");
  
    requestAnimationFrame(animate);
    function animate () {
      topOffset = scrollContent.getBoundingClientRect().top;
      //animation that run only on the head
      if(-(topOffset) < window.innerHeight){
        parallaxAnimation(-topOffset);
        canvasAnimation();
  
        leftNavMapping(-topOffset);
        toggleScrollText(-topOffset);
        leftNavUpdate(-topOffset);
      }
      //animation that run only on the body
      if(-(topOffset) > window.innerHeight + 40){
      for(let i = movieObject.length-1;i >= 0; i--){
        movieObject[i].hidden();
      }
        rightNav.style.cssText = `transform:translateY(${-(topOffset)-window.innerHeight - 50}px);`;
      }else{
        rightNav.style.cssText = `transform:translateY(0px);`;
      };
      ballFunctions(topOffset);
      requestAnimationFrame(animate);
    }
};



let logoutButtons = document.querySelectorAll(".logout_butt");

logoutButtons.forEach(x=>{x.addEventListener("click",()=>{
  fetch("/logout")
  .then(permision=>{
    window.location.href = permision.url;
  })
  .catch(reason=>{
    console.log(`problems in the server for ${reason}`);
  })
})})