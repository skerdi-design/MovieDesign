const form = document.querySelector(".form");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    form.querySelector(".submit_butt").classList.add("grey");

    let data = {
        email: form.querySelector("#email").value,
        password: form.querySelector("#password").value
    };
    let options = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body:JSON.stringify(data)
    };
    fetch("/login",options)
    .then((res)=>{
        if(res.redirected){
            window.location.href = res.url;
        }else{
            form.classList.add("username_null");
        }
    })
})

form.addEventListener("click",()=>{
    form.classList.remove("username_null");
})