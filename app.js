if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { HttpStatusCode } = require("axios");

//connect with db i.e mongodb 
const dbUrl = process.env.ATLASDB_URL;
main() 
.then(() =>{
    console.log("connected with DB");
})
.catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

//setup for ejs
app.set("view engine" ,"ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//as we use id by extracting it 
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate )
app.use(express.static(path.join(__dirname, "/public")));//for using static files like style.css

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
     },
     touchAfter: 24 * 3600,
});

store.on("error", (err) =>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

//define options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,//date.now give todays time +7 mean after 7 days cookie will expire 24 hrs, 60 mins, 60 sec , 1000 milisecs
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,//use for cross scripting attack
    }
};

app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//authenticate() use to generate a function that is used in passport LocalStrategy 

passport.serializeUser(User.serializeUser());//generate function that is used by passport to serialize user into the session , storing user information as it login so user need not to login again and again for every new page
passport.deserializeUser(User.deserializeUser());//generate function that is used by passport to deserialize user into the session, after completing session user information need to desereliaze information

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//root route added here
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//note: always take common path not go by name only common path from  that particularly review only section like here '/listings'
app.use("/listings", listingRouter);//when there route call of /listings then use listing file 
app.use("/listings/:listingId/reviews", reviewRouter);                                    
app.use("/", userRouter);


//server start at port 8080
app.listen(8080, ()=>{
    console.log("server is listening at port 8080.");
});  
