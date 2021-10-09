const Datastore = require("nedb");
const db = new Datastore({filename:"database.db"});
const bcrypt = require("bcryptjs");

db.loadDatabase((err)=>{
    if(err) throw err;
})




function findUser (username,email,password) {
    return new Promise((res,rej)=>{
        db.find({username:username},(err,doc)=>{
            if(doc.length == 0){
                db.find({email:email},(err,doc)=>{
                    if(doc.length == 0){
                        res (true);
                        db.insert({
                            username:username,
                            email:email,
                            password,password,
                            movies:[]
                        });
                        db.persistence.compactDatafile();
                    }else{
                        res (undefined);
                    }
                });
            }else{
                res (null);
            }
        });
    })
}

function authUser (email,password) {
    return new Promise((res,rej)=>{
        db.find({email:email},(err,doc)=>{
            if(doc.length == 0){
                res(null);
            }else if(doc.length > 1){
                res(undefined);
            }else{
                let hashing = bcrypt.compareSync(password,doc[0].password)
                if(!hashing){
                    res(null);
                    return;
                }
                res(doc[0]);
            }
        })
    })
}

function getUserData(id) {
    return new Promise ((res,rej)=>{
        db.find({_id:id},(err,docs)=>{
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
        db.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let foundName = docs[0].movies.find(({name})=>{
                    return name === data.name;
                })
                if(foundName){
                    rej(true);
                }else{
                    // addToSet adds a something only if it is unique
                    db.update({_id:id},{$addToSet:{movies:data}},(err,numreplaced)=>{
                        if(err)throw(err);
                        res(true);
                    });
                    db.persistence.compactDatafile();
                };
            }else{
                rej(false);
            };
        })
    });
}


function checkName (id,name){
    return new Promise ((res,rej)=>{
        db.find({_id:id},(err,docs)=>{
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
        db.update({_id:id},{$addToSet:{movies:data}},(err,numreplaced)=>{
            if(err)throw(err);
            res(true);
        });
    });
}


function deleteMovie(id,data){
    return new Promise((res,rej)=>{
        db.update({_id:id},{ $pull: {movies:data}},{},(err,numreplaced)=>{
            if(err)throw(false);
            res(true);
        });
        db.persistence.compactDatafile();
    });
}


function editMovie(id,data){
    return new Promise((res,rej)=>{
        db.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == data.data.name;
                })
                docs[0].movies[index] = data.updatedData;
                db.update({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw false;
                    res(true);
                });
            }else{
                rej(false);
            };
        })
        db.persistence.compactDatafile();
    });
}


function editMovieFile(id,data){
    return new Promise((res,rej)=>{
        db.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == data.data.name;
                })
                docs[0].movies[index] = data.updatedData;
                db.update({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw false;
                    res(true);
                });
            }else{
                rej(false);
            };
        })
        db.persistence.compactDatafile();
    });
}


function editFav(id,ele){
    return new Promise((res,rej)=>{
        db.find({_id:id},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == ele.name;
                })
                docs[0].movies[index].bookmark = ele.bookmark;
                db.update({_id:id},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
                    if(err)throw err;
                    res(true);
                })
            }else{
                rej(true);
            };
        });
        db.persistence.compactDatafile();
    });
};





module.exports = {findUser,authUser,getUserData,createMovie,deleteMovie,editMovie,editFav,checkName,insertMovie,editMovieFile};
