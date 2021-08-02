const Datastore = require("nedb");
const db = new Datastore({filename:"database.db"});
const bcrypt = require("bcryptjs");

db.loadDatabase((err)=>{
    if(err) throw err;
})
let document;
//db.insert(document,(err,newdoc)=>{console.log(newdoc)})

function findUser (username,email,password) {
    const user = {
        username:username,
        email:email,
        password:password,
        movielist:[],
        favourites:[]
    }
    return new Promise((res,rej)=>{
        db.find({username:username},(err,doc)=>{
            if(doc.length == 0){
                db.find({email:email},(err,doc)=>{
                    if(doc.length == 0){
                        res (true);
                        db.insert(user);             //comment this now
                    }else{
                        console.log("place taken!!!");
                        res (undefined);
                    }
                });
            }else{
                res (null);//this is null
            }
        });
    })
}
function authUser (email,password) {
    const authuser = {
        email:email,
        password:password
    }
    return new Promise((res,rej)=>{
        db.find({email:email},(err,doc)=>{
            console.log(bcrypt.compareSync(password,doc[0].password));
            if(doc.length == 0){
                console.log("wrong email");
                res(null);
            }else if(!(bcrypt.compareSync(password,doc[0].password))){
                console.log("wrong password!!!");
                res(null);
            }else{
                res(doc[0]);
            };
        })
    })
}
function allowUser (sessionid){
    return new Promise((res,rej)=>{
        db.find({_id:sessionid},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 0){
                res(null);
            }else{
                res(docs[0]);
            }
        })
    })
}
function updateUser (cookie,data) {
    return new Promise((res,rej)=>{
        db.find({username:cookie},(err,docs)=>{
            if(docs.length == 0){
              res(false);
            }else{
                user = docs[0];
                user.movielist.push(data);
                db.update({username:user.username},{$set:{movielist:user.movielist}},{},(err,numrep)=>{
                    console.log("has been added!!!");
                })
                db.persistence.compactDatafile();
                res(true);
            }
        })
        // const curruser = {
        //     "username":"a",
        //     "email":"a@a",
        //     "password":"$2a$14$uu98XLrhJE9Y7aCy2TuDkuS77CmQvwgizytsItqKdjgI2MC4e.ke2",
        //     "movielist":[],
        //     "favourites":[],
        //     "_id":"WSlGXsj0RQqfRVSw"
        // };

        //const user = curruser;
        //console.log(user);
        //user.movielist.push(data);
        //console.log(user);
        //db.update({username:'a'},{$set: {movielist:user.movielist}},{},(err, numReplaced)=>{
        //    console.log("has been added!!!");
            //})
        //})
        //db.persistence.compactDatafile();//for compacting the database
        //res(true);
    })
}
        // db.find({_id:cookie},(err,docs)=>{
        //     console.log(docs);
        //     if(docs.length == 0){
        //         res(false);
        //     }else{
            // const user = {
            //     "username":"a",
            //     "email":"a@a",
            //     "password":"$2a$14$uu98XLrhJE9Y7aCy2TuDkuS77CmQvwgizytsItqKdjgI2MC4e.ke2",
            //     "movielist":[],
            //     "favourites":[],
            //     "_id":"WSlGXsj0RQqfRVSw"
            // };
            // console.log(user);
            // user.movielist.push(data);
            // console.log(user);
            // db.update({_id:cookie},{_id:user},{},(err, numReplaced)=>{
            //     console.log("has been added!!!");
            // //})
            // }
    
function updateFavorite (cookie,data) {
    db.update({username:cookie},{$push:{favourites:data}},{},()=>{
        //console.log("added to favorites!!!");
    })
    return new Promise((res,rej)=>{
        db.find({username:cookie},(err,docs)=>{
            //console.log(docs[0],"this is docs");
            res(docs[0])
        })
        db.persistence.compactDatafile();
    })
    //db.persistence.compactDatafile();
}























function debugData() {
    return new Promise ((res,rej)=>{
        db.find({username:"devil",email:"devil@cry.com"},(err,docs)=>{
            if(err){throw err};
            if(docs.length  == 1){
                res(docs[0]);
            }else{
                rej(docs);
            };
        });
    });
};

function debugMovie(data){
    return new Promise((res,rej)=>{
        db.find({username:"devil"},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let foundName = docs[0].movies.find(({name})=>{
                    return name === data.name;
                })
                if(foundName){
                    rej(true);
                }else{
                    // addToSet adds a something only if it is unique
                    db.update({username:"devil"},{$addToSet:{movies:data}},(err,numreplaced)=>{
                        if(err)throw(err);
                        res(true);
                    });
                };
            }else{
                rej(false);
            };
        })
        db.persistence.compactDatafile();
    });
}

function editMovie(data){
    return new Promise((res,rej)=>{
        db.find({username:"devil"},(err,docs)=>{
            if(err)throw err;
            if(docs.length == 1){
                let index = docs[0].movies.findIndex(({name})=>{
                    return name == data.data.name;
                })
                docs[0].movies[index] = data.updatedData;
                db.update({username:"devil"},{ $set: {movies:docs[0].movies}},{},(err,numReplaced)=>{
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

function deleteMovie(data){
    return new Promise((res,rej)=>{
        db.update({username:"devil"},{ $pull: {movies:data}},{},(err,numreplaced)=>{
            if(err)throw(false);
            res(true);
        });
        db.persistence.compactDatafile();
    });
}








function debugUser (name,email,pass) {
    return new Promise ((res,rej)=>{
        db.find({username:name , email:email},(err,docs)=>{
            if(docs.length == 0){
                let newUser = {
                    username:name,
                    email:email,
                    password:pass,
                    movies:[],
                    bookmark:[]
                };
                db.insert(newUser);
                res(true);
            }else{
                res(false);
            }
        })
    })
}


module.exports = {findUser,authUser,allowUser,updateUser,updateFavorite,debugUser,debugData,debugMovie,deleteMovie,editMovie};
