require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcryptjs");


const sharp = require("sharp");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");



const {DBconnect,findUser,authUser,getUserData,createMovie,deleteMovie,editMovie,editFav,checkName,insertMovie,editMovieFile} = require("./utils.js");


/*================ handeling images and compression section =====================================================*/
/*================ handeling images and compression section =====================================================*/
/*================ handeling images and compression section =====================================================*/

cloudinary.config({
    cloud_name: process.env.YOUR_CLOUD_NAME,
    api_key: process.env.YOUR_API_KEY,
    api_secret: process.env.YOUR_API_SECRET
});


const bufferToStream = (buffer) => {
    const readable = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
    return readable;
}

// app.post("/upload", upload.single("file") ,async (req,res)=>{
//     const data = await sharp(req.file.buffer).webp({ quality: 15 }).toBuffer();
//     const stream = cloudinary.uploader.upload_stream(
//         { folder: "Uploaded" },
//         (error, result) => {
//             if (error) return console.error(error);
//             // return res.json({ URL: result.secure_url });
//             //console.log(result);//result.url
//             console.log(result);
//             return res.send(true);
//         }
//     );
//     bufferToStream(data).pipe(stream);
// })
// app.post("/delete", upload.single("file") ,async (req,res)=>{
//     cloudinary.uploader.destroy('Uploaded/dgwzro7ehduofwyshyiw',(error,result)=>{
//         console.log(result);
//         return res.send(false);
//     });
// })


/*================ handeling images and compression section =====================================================*/
/*================ handeling images and compression section =====================================================*/
/*================ handeling images and compression section =====================================================*/


app.use(session({
    secret:process.env.YOUR_SESSION_SECRET,
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
app.use(express.urlencoded({extended: true}));




app.get("/",(req,res)=>{
    // res.sendFile("index.html",root);
    if(!(req.session && req.session.userId)){
        res.sendFile("index.html",root);
    }else{
        res.redirect("/movieslist");
    }
})
app.get("/css",(req,res)=>{
    res.sendFile("style.css",root);
})


app.get("/register",(req,res)=>{
    if(!(req.session && req.session.userId)){
        res.sendFile("./register/index.html",root);
    }else{
        res.redirect("/movieslist");
    }
})
app.get("/register/css",(req,res)=>{
    res.sendFile("/register/style.css",root);
})
app.get("/register/js",(req,res)=>{
    res.sendFile("/register/script.js",root);
})


app.get("/login",(req,res)=>{
    if(!(req.session && req.session.userId)){
        res.sendFile("./login/index.html",root);
    }else{
        res.redirect("/movieslist");
    }

})
app.get("/login/css",(req,res)=>{
    res.sendFile("/login/style.css",root);
})
app.get("/login/js",(req,res)=>{
    res.sendFile("/login/script.js",root);
})



app.get("/movieslist",(req,res)=>{
    if(!(req.session && req.session.userId)){
        res.redirect("/login");
    }else{
        res.sendFile("./movieslist/index.html",root);
    }
    // res.sendFile("./movieslist/index.html",root);
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
    res.status(206).sendFile("/Image/"+req.params.name,root);
});



// post requests section ===========================================================================================================
// post requests section ===========================================================================================================

app.post('/register',(req,res)=>{
    let hash = bcrypt.hashSync(req.body.password,12);
    req.body.password = hash;
    findUser(req.body.username,req.body.email,req.body.password)
    .then((docs)=>{
        if(docs){
            res.redirect("/login");
        }else if(docs === undefined){
            res.status(204).send("Email taken!!!");
        }else{
            res.status(200).send("Username taken!!!");
        }
    })
    .catch(err=>{
        console.log(err);
    })
});
app.post("/login",(req,res)=>{
    authUser(req.body.email,req.body.password)
    .then((user)=>{
        if(user){
            req.session.userId = user._id;
            var time = 7 * 24 * 60 * 60 * 1000;
            req.session.cookie.expires = new Date(Date.now() + time)
            res.redirect("/movieslist");
        }else{
            res.send("wrong email or password");
        }
    })
    .catch(err=>{
        console.log(err);
    })
})


app.get('/eleInfo',(req,res)=>{
    getUserData(req.session.userId)
    .then((data)=>{
        if(data){
            res.send(data.movies);
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


app.post("/AddMovie",(req,res)=>{
    let data = {
        name:req.body.name,
        link:req.body.link,
        img:req.body.img,
        genre:req.body.genre,
        rating:req.body.rating,
        type:req.body.type,
        time:req.body.time,
        bookmark:req.body.bookmark,
        file:req.body.file
    }
    createMovie(req.session.userId,data)
    .then((permision)=>{
        if(permision){
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


app.post("/Checkname",(req,res)=>{
    checkName(req.session.userId,req.body.name)
    .then((permi)=>{
        if(permi){
            res.send(true);
        }else{
            res.send(false);
        }
    }).catch(()=>{
        res.send(null);
    })
})


app.post("/AddMovieFile", upload.single("file") , async(req,res)=>{
    const sendImageFile = async () =>{
        const data = await sharp(req.file.buffer).webp({ quality: 20 }).toBuffer();
        const stream = cloudinary.uploader.upload_stream(
            { folder: "Uploaded" },
            (error, result) => {
                if (error) return console.error(error);
                res.json(result.url);
            }
        );
        bufferToStream(data).pipe(stream);
    }
    sendImageFile();
})


app.post("/Insertmovie",(req,res)=>{
    let data = {
        name:req.body.name,
        link:req.body.link,
        img:req.body.img,
        genre:req.body.genre,
        rating:req.body.rating,
        type:req.body.type,
        time:req.body.time,
        bookmark:req.body.bookmark,
        file:req.body.file
    }
    insertMovie(req.session.userId,data)
    .then((info)=>{
        res.send(info);
    })
    .catch(err=>{
        console.log(err);
    })
});


app.post("/DeleteMovie",(req,res)=>{
    deleteMovie(req.session.userId,req.body)
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

app.post("/DeleteMovieFile",(req,res)=>{
    cloudinary.uploader.destroy(req.body.imgURL,(error,result)=>{
        console.log(result);
        if(result.result === 'not found'){
            res.send(false)
        }
        else{
            let body = {
                name:req.body.name,
                link:req.body.link,
                img:req.body.img,
                genre:req.body.genre,
                rating:req.body.rating,
                type:req.body.type,
                time:req.body.time,
                bookmark:req.body.bookmark,
                file:req.body.file
            }
            deleteMovie(req.session.userId,body)
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
        }
    });
});


app.post("/editMovie",(req,res)=>{
    editMovie(req.session.userId,req.body)
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


app.post("/editMovieFile",(req,res)=>{
    cloudinary.uploader.destroy(req.body.imgURL,(error,result)=>{
        console.log(result);
        if(result.result === 'not found'){
            res.send(false)
        }else{
            editMovieFile(req.session.userId,req.body)
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

        }
    });
})


app.post("/mockFavEdit",(req,res)=>{
    editFav(req.session.userId,req.body)
    .then((data)=>{
        if(data){
            res.send(true);
        }
    })
    .catch((reason)=>{
        if(reason){
            res.send(false);
        }else{
            res.send(null);
        }
    })
});

app.get("/logout",(req,res)=>{
    req.session.userId = undefined;
    res.redirect("/login");
})

app.use(function (req,res,next){
	res.status(404).send('<h1>Error 404 Page not found <a href="/">Go Home</a></h1>');
});



// DBconnect()
// .then((res)=>{
//     if(res){
//         console.log("server listening at port 3000 after db connected");
//         // const PORT = process.env.PORT || 3000;
//         // app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)});
//     }
// })
// .catch((err)=>{
//     console.log(err);
// })
app.use('/db',function (req, res, next) {
    console.log('Time:', Date.now())
    next()
    DBconnect()
    .then((something)=>{
        if(something){
            
            console.log("server listening at port 3000 after db connected");
            res.send("server listening at port 3000 after db connected");
            // const PORT = process.env.PORT || 3000;
            // app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)});
        }
    })
    .catch((err)=>{
        console.log(err);
    })  
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)});