const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcryptjs");

const {findUser,authUser,allowUser,updateUser,updateFavorite,debugUser,debugData,debugMovie,deleteMovie,editMovie} = require("./utils.js");


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
});
app.get("/movieslist/js",(req,res)=>{
    res.sendFile("/movieslist/script.js",root);
});
app.get("/movieslist/smooth",(req,res)=>{
    res.sendFile("/dist/smooth-scrollbar.js",root);
});
app.get("/image/:name",(req,res)=>{
    res.sendFile("/image/"+req.params.name,root);
});





let mockData = {
    movielist:[{
        a:'https://real-123movies.best/tv-series/dark-season-1-sub-eng/CVSsgCoB/rEsW3Pef',
        b:'https://wallpapercave.com/wp/wp4056407.jpg',
        c:'10',
        d:"dark",
        e:'Thriller,Sci-fi'
    },
    {
        a:'https://www5.gowatchseries.bz/dark-season-2-episode-1',
        b:'https://wallpapercave.com/wp/wp6123680.jpg',
        c:'10',
        d:"dark, s2",
        e:'Thriller,Sci-fi'
    },
    {
        a:'https://www5.gowatchseries.bz/the-queens-gambit-season-1-episode-1',
        b:'https://i.pinimg.com/originals/5a/d3/f1/5ad3f1a8c6a04f5eda5d5f2fa1331626.jpg',
        c:'10',
        d:"queen's gambit",
        e:'Period Drama'
    },
    {
        a:'https://www5.gowatchseries.bz/enola-holmes-episode-0',
        b:'https://wallpaperaccess.com/full/3963741.jpg',
        c:'8',
        d:"Enola Holmes",
        e:'Adventure, Mystery'
    },
    {
        a:'https://topeuropix.site/watch-online-movie/harry-potter-and-the-sorcerers-stone-online-free-hd-with-subtitles-europix?__cf_chl_jschl_tk__=5326482be86c205f8d964c2175c3fca7cb9bfbc0-1626372467-0-AX9tgs-c27Z_Tplih2Z73Pw5wuivEcpknh23XrTyeaKJTdiVhY8eAyy-0XrVcpY0JdwpfJG6ytEPWtcezg3dkhVPff7InlAMNJUv0vgpUhAajSGHEJW14Dx39qtoVk6bZ7jCxJN6C4lKCDFq921xrQHF0aOuVbAEelcc6J4kY7oZ9XjOBi4saM8f-PSfYVw4HA0MyzOVmQKff74Ms_3BNUeMikoofcRBH5pw_Jyxgt8tHmWNCWMxm17uXOUItY47CGyVoP-XghCI2hT_hl20U7kq6xl7xm6dYkL1WCUo4m1u1NAtN-hCBOLba8upi_ipHNSSvGEMHp71P2trDsCgp8dXZs-pIPYm__vbYwa_wVytAvroKaqUCsMVHznc-ZRlOz8OHcyMzEkFxO59KPt99Gym5LsA72CxbxDp-pI4rEFage9n9fuoybuVPI0D4JQvmzR-gPwh9RBJODQwzWoPlRF-976b3YA69SZec78vyCI-3S2EyAx1iu-yGhU_E3ufjoX3QL2TPPnUOCiCSCscRhU',
        b:'https://vistapointe.net/images/harry-potter-and-the-philosophers-stone-4.jpg',
        c:'8,5',
        d:"harry potter and the philosophers stone",
        e:'Fantasy, Adventure'
    }
    ]
}





// app.get("/userinfo",(req,res)=>{
//     user = {
//         "username":"a",
//         "email":"a@a",
//         "movielist":[
//             {
//                 title:"Dark, Season 1",
//                 genre:"Sci-fi, Horror",
//                 img:"https://www.tjtoday.org/wp-content/uploads/2018/02/c245fb206fecea20e4f18e26dc8fa74aae6f80b5.jpg",
//                 rating:10,
//                 type:"Series",
//                 link:"https://real-123movies.best/tv-series/dark-season-1-sub-eng/CVSsgCoB/rEsW3Pef"
//             },
//         ],
//         "favourites":[
//             {
//                 title:"Dark, Season 1",
//                 genre:"Sci-fi, Horror",
//                 img:"https://www.tjtoday.org/wp-content/uploads/2018/02/c245fb206fecea20e4f18e26dc8fa74aae6f80b5.jpg",
//                 rating:10,
//                 type:"Series",
//                 link:"https://real-123movies.best/tv-series/dark-season-1-sub-eng/CVSsgCoB/rEsW3Pef"
//             }
//         ],
//     }
//     // console.log(user);
//     res.json(userfound);
// })


















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
    res.send("ok");
})


















app.get('/eleinfo',(req,res)=>{
    debugData(/* here will be the cookie id that will be passed latter */)
    .then((data)=>{
        if(data){
            let formatedData = {
                movies:data.movies,
                bookmarks:data.bookmark
            };
            res.send(formatedData);
        };
    })
    .catch((reason)=>{
        if(reason){
            res.send({reason:reason});
        }else{
            res.send(false);
        };
    });
});

app.post("/mockUserAdd",(req,res)=>{
    let data = {
        name:req.body.name,
        link:req.body.link,
        img:req.body.img,
        genre:req.body.genre,
        rating:req.body.rating,
        bookmark:req.body.bookmark
    }
    debugMovie(data)
    .then((info)=>{
        if(info){
            res.send(true);
        }
    })
    .catch((reason)=>{
        if(reason){
            res.send(false);
        }else{
            res.send(null);
        };
    })
})

app.post("/mockUserDelete",(req,res)=>{
    deleteMovie(req.body)
    .then((data)=>{
        if(data){
            res.send(true);
        }
    })
    .catch((reason)=>{
        if(!reason){
            res.send(false);
        }
    });
});

app.post("/mockUserEdit",(req,res)=>{
    editMovie(req.body)
    .then((data)=>{
        if(data){
            res.send(true);
        }
    })
    .catch((reason)=>{
        if(reason){
            res.send(false);
        }
        res.send(null);
    })
})






// app.get("/mockUserData",(req,res)=>{
//     debugData()
//     .then((data)=>{
//         if(data){
//             mockUser = data.movies;
//             res.send(mockUser)
//         }else{
//             res.send(false)
//         }
//     })
// })











app.post("/mockUserInsert",(req,res)=>{
    debugUser(req.body.username,req.body.email,req.body.password)
    .then((data)=>{
        if(data){
            res.send(true);
        }else{
            res.send(false);
        }
    })
})


// app.use(function(req, res, next) {
//     res.status(200);
//     res.send('https://www.technistone.com/color-range/image-slab/Starlight%20Black_SLAB_web.jpg');
// });



























const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)});