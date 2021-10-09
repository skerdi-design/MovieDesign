const form = document.querySelector(".form");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    form.querySelector(".submit_butt").classList.add("grey");

    let data = {
        username: form.querySelector("#username").value,
        email: form.querySelector("#email").value,
        password: form.querySelector("#password").value
    }
    let options = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body:JSON.stringify(data)
    }
    fetch("register",options)
    .then(res=>{
        if(res.redirected){
            window.location.href = res.url;
        }else{
            if(res.status === 204){
                form.classList.add("email_taken");
            }else{
                form.classList.add("username_taken");
            }
            form.querySelector(".submit_butt").classList.remove("grey");
        }
    })
})
form.addEventListener("click",()=>{
    form.classList.remove("email_taken");
    form.classList.remove("username_taken");
})