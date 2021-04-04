const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcryptjs");

const {findUser,authUser,allowUser,updateUser,updateFavorite,removeFavorite,XYZ} = require("./utils.js");


let user;

app.use(session({
    secret:"hellocookie",
    saveUninitialized: false,
    resave: false,
}));
const root = {root:"./public"};


// app.use("/movieslist",(req,res,next)=>{
//     console.log(req.session);
//     next();
// })

// app.use(express.static('public'));

app.use(express.json({limit:'1mb'}));


// app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.sendFile("index.html",root);
})
app.get("/css",(req,res)=>{
    res.sendFile("style.css",root);
})


app.get("/register",(req,res)=>{
    res.sendFile("./register/index.html",root);
})
app.get("/register/css",(req,res)=>{
    res.sendFile("/register/style.css",root);
})
app.get("/register/js",(req,res)=>{
    res.sendFile("/register/script.js",root);
})


app.get("/login",(req,res)=>{
    res.sendFile("./login/index.html",root);
})
app.get("/login/css",(req,res)=>{
    res.sendFile("/login/style.css",root);
})
app.get("/login/js",(req,res)=>{
    res.sendFile("/login/script.js",root);
})

let userfound;

app.get("/movieslist",(req,res)=>{
    // if(!(req.session && req.session.userId)){
    //     res.redirect("/login");
    // }else{
    //     allowUser(req.session.userId)
    //     .then(doc=>{
    //         // console.log(user);
    //         if(doc === null){
    //         res.redirect("/login");
    //         }else{
    //         //setting the user variable as the one that db found
    //         userfound=doc;
    //         res.sendFile("./movieslist/index.html",root);
    //     }
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     });
    // }




    // findUser ("a","a@a","a")
    // .then(user =>{
    //     userfound = user;
    //     console.log(userfound);
    // })
    res.sendFile("./movieslist/index.html",root);
})
app.get("/movieslist/css",(req,res)=>{
    res.sendFile("/movieslist/style.css",root);
})
app.get("/movieslist/js",(req,res)=>{
    res.sendFile("/movieslist/script.js",root);
})
app.get("/image/:name",(req,res)=>{
    res.sendFile("/image/"+req.params.name,root);
})

app.get("/userinfo",(req,res)=>{
    user = {
        "username":"a",
        "email":"a@a",
        "movielist":[
            {
                title:"Dark, Season 1",
                genre:"Sci-fi, Horror",
                img:"https://www.tjtoday.org/wp-content/uploads/2018/02/c245fb206fecea20e4f18e26dc8fa74aae6f80b5.jpg",
                rating:10,
                type:"Series",
                link:"https://real-123movies.best/tv-series/dark-season-1-sub-eng/CVSsgCoB/rEsW3Pef"
            },
        ],
        "favourites":[
            {
                title:"Dark, Season 1",
                genre:"Sci-fi, Horror",
                img:"https://www.tjtoday.org/wp-content/uploads/2018/02/c245fb206fecea20e4f18e26dc8fa74aae6f80b5.jpg",
                rating:10,
                type:"Series",
                link:"https://real-123movies.best/tv-series/dark-season-1-sub-eng/CVSsgCoB/rEsW3Pef"
            }
        ],
    }
    // console.log(user);
    res.json(userfound);
})




app.post('/register',(req,res)=>{
    let hash = bcrypt.hashSync(req.body.password,14);
    req.body.password = hash;
    findUser(req.body.username,req.body.email,hash)
    .then((docs)=>{
        if(docs === null){
            res.send("Username taken!!!");
        }else if (docs === undefined){
            res.status(204).send("Email taken!!!");
        }else{
            res.redirect("/login");
        }
    });
})
app.post("/login",(req,res)=>{
    authUser(req.body.email,req.body.password)
    .then(docs=>{
        if(docs===null){
            res.send("wrong email");
        }else{
            user = docs;
            req.session.userId = user._id;
            req.session.cookie.maxAge = 1000*1000000;
            console.log(user);
            res.redirect("/movieslist");
        } 
    })
})
app.post("/add",(req,res)=>{
    updateUser(userfound.username,req.body)
    .then(docs=>{
        if(docs == false){
            res.status(204).send("something wrong happend!")
        }else{
            res.status(200).send("updated!!!");
        }
    })
})
app.post("/favorite",(req,res)=>{
    let document;
    // console.log(req.body.name,req.body.photo,req.body.link);
    let element = {
        name:req.body.name,
        photo:req.body.photo,
        link:req.body.link
    }
    updateFavorite(userfound.username,element,req.body.checked)
    .then(docs=>{
        //console.log(docs,"this is docs")
        const found = docs.movielist.find(elements=>{
            //console.log(elements.title,element.name)
            return elements.title == element.name;
        })
        //console.log(found,"this is found");
        document = found;
        console.log(document,"thsi is old documnet");
        // found.added = '<i class="fas fa-star"></i>';
        console.log(document,"thsi is new documnet");
        XYZ(userfound.username,found,document);
    });
    res.send("ok");
})
app.post("/remove-favorite",(req,res)=>{
    let document;
    let element = {
        name:req.body.name,
        photo:req.body.photo,
        link:req.body.link
    }
    removeFavorite(userfound.username,element,req.body.unchecked)
    .then(docs=>{
        const found = docs.movielist.find(elements=>{
            return elements.title == element.name;
        })
        document = found;
        XYZ(userfound.username,found,document);
    });
    res.send("ok")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)});