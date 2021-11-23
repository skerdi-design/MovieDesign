const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


const userDB = process.env.YOUR_DB_CONNECT;
function DBconnect (){
    return new Promise((res,rej)=>{
        mongoose.connect(userDB,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>{
            console.log("conected");
            res(true);
        })
        .catch((err)=>{
            rej(fasle);
        })
    })
}

const moviesSchema = new Schema({
    username:String,
    email:String,
    password:String,
    movies:[Schema.Types.Mixed]
})
const movies = mongoose.model("movie", moviesSchema);


function findUser (username,email,password) {
    return new Promise((res,rej)=>{
        movies.find({username:username},(err,doc)=>{
            if(doc.length == 0){
                movies.find({email:email},(err,doc)=>{
                    if(doc.length == 0){
                        res(true);
                        const user = new movies({
                            username:username,
                            email:email,
                            password:password,
                            movies:[]
                        })
                        user.save();
                    }else{
                        res(undefined);
                    }
                });
            }else{
                res(null);
            }
        });
    })
}

function authUser (email,password) {
    return new Promise((res,rej)=>{
        movies.find({email:email},(err,docs)=>{
            if(docs.length == 0){
                res(null);
            }else if(docs.length > 1){
                res(undefined);
            }else{
                let hashing = bcrypt.compareSync(password,docs[0].password)
                if(!hashing){
                    res(null);
                    return;
                }
                res(docs[0]);
            }
        })
    })
}

function getUserData(id) {
    return new Promise ((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err){throw err};
            if(docs.length  == 1){
                res(docs[0]);
            }else{
                rej(docs);
            };
        });
    });
};


function createMovie(id,data){
    return new Promise((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let foundName = docs[0].movies.find(({name})=>{
                    return name === data.name;
                })
                if(foundName){
                    rej(true);
                }else{
                    // addToSet adds something only if it is unique
                    movies.updateOne({_id:id},{$addToSet:{movies:data}},(err,numreplaced)=>{
                        if(err)throw(err);
                        res(true);
                    });
                };
            }else{
                rej(false);
            };
        })
    });
}


function checkName (id,name){
    return new Promise ((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err){throw err};
            if(docs.length  == 1){
                let Name = docs[0].movies.find((title)=>{
                    return title.name == name;
                })
                if(Name){
                    res(false);
                }else{
                    res(true);
                }
            }else{
                rej(false);
            };
        });
    });
}


function insertMovie(id,data) {
    return new Promise ((res,rej)=>{
        movies.updateOne({_id:id},{$addToSet:{movies:data}},(err,numreplaced)=>{
            if(err)throw(err);
            res(true);
        });
    });
}


function deleteMovie(id,data){
    return new Promise((res,rej)=>{
        movies.updateOne({_id:id},{ $pull: {movies:data}},(err,numreplaced)=>{
            if(err)throw(false);
            res(true);
        });
    });
}


function editMovie(id,data){
    return new Promise((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == data.data.name;
                })
                docs[0].movies[index] = data.updatedData;
                movies.updateOne({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw false;
                    res(true);
                });
            }else{
                rej(false);
            };
        })
    });
}


function editMovieFile(id,data){
    return new Promise((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == data.data.name;
                })
                docs[0].movies[index] = data.updatedData;
                movies.updateOne({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw false;
                    res(true);
                });
            }else{
                rej(false);
            };
        })
    });
}


function editFav(id,ele){
    return new Promise((res,rej)=>{
        movies.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == ele.name;
                })
                docs[0].movies[index].bookmark = ele.bookmark;
                movies.updateOne({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw err;
                    res(true);
                })
            }else{
                rej(true);
            };
        });
    });
};

module.exports = {DBconnect,findUser,authUser,getUserData,createMovie,deleteMovie,editMovie,editFav,checkName,insertMovie,editMovieFile};