const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine" ,"ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOptions = {
    secret: "mysupersecretstring", 
    resave:false , 
    saveUninitialized:true ,
};

//use of express session 
app.use(session(sessionOptions));
app.use(flash());

//define middleware for access of flash msg
app.get((req, res, next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

//pair(key, msg) key: key is on the the basis on which we able to identify msg
//user able to register on the platform , registration done by query string 
app.get("/register", (req, res) =>{
 let {name = "anonymous"} = req.query;//extract name from query , if we dont give any name then default name anonymous will appear
 req.session.name = name;
 if(name === "anonymous"){
    req.flash("error", "user not registered");
 }else{
 req.flash("success", "user registerd succesfully!");
 }
 res.redirect("/hello");
});

//hellow route for any name it should say hello
app.get("/hello", (req, res) =>{
     res.render("page.ejs", {name : req.session.name});
});

//app will listen on this port 3000
app.listen(3000, () =>{
    console.log("server is listening to 3000");
})

