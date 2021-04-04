const form = document.querySelector(".form");
const message = document.querySelector(".message");
const input = document.querySelectorAll("input");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    // window.location.href = "http://localhost:3000/movieslist/";
    const data = {
        email:document.querySelector("#email").value,
        password:document.querySelector("#password").value
    }
    const options = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body:JSON.stringify(data)
    };
    fetch("/login",options)
    .then(res=>{
        if(res.redirected === false){
            message.classList.add("wrong");
            input.forEach(x=>{
                x.classList.add("wrong");
            })
        }else{
            window.location.href = res.url;
        }
    });
})

input.forEach(x=>{x.addEventListener("click",()=>{
    x.classList.remove("wrong"),
    message.classList.remove("wrong");
})})