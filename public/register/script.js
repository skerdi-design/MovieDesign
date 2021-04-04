const form = document.querySelector(".register");
const invalid = document.querySelector(".invalid");
const invalid2 = document.querySelector(".invalid2")
const input = document.querySelector("#name");
const input2 = document.querySelector("#email");


form.addEventListener("submit",(e)=>{
    const data = {
        username:document.querySelector("#name").value,
        email:document.querySelector("#email").value,
        password:document.querySelector("#password").value
    }
    console.log(data.username,data.email,data.password);
    e.preventDefault();
    console.log("submited");
    const head = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body:JSON.stringify(data)
    };
    fetch('/register',head)
    .then(res=>{
        console.log(res);
        if(res.redirected == false && res.status == 200){
            invalid.classList.add("true");
            input.classList.add("wrong");
        }else if(res.redirected == false && res.status == 204){
            invalid.classList.add("true");
            input.classList.add("wrong");
            input2.classList.add("wrong");
            invalid2.classList.add("true");
        }else{
            window.location.href = res.url
        }
    });
})

input.addEventListener("click",(e)=>{
    input.classList.remove("wrong");
    invalid.classList.remove("true");
    input2.classList.remove("wrong");
    invalid2.classList.remove("true");
});
input2.addEventListener("click",(e)=>{
    input.classList.remove("wrong");
    invalid.classList.remove("true");
    input2.classList.remove("wrong");
    invalid2.classList.remove("true");
});