const User = require("../models/user"); 

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try{ //from request body extract username, email, password
    let {username, email, password} = req.body;
    const newUser = new User({email, username });//create new user
    const registeredUser = await User.register(newUser, password);//register new user in database, it is aynchronus method so use await
    console.log(registeredUser);

    //automatically login in when signup 
    req.login(registeredUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });


    } catch(e){
       req.flash("error", e.message);
       //after showing error in case of error then return to signup page.
       res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) =>{//router.post go toward /login, it is async function that user exist or not. authentication task will done by passport the work is to identify is user already exist or not. if user not present in database so direclty redirect to login page
    //authentication fail due to any resons like user not exist in DB , then failureFlash fail msg flash on screen
    req.flash("success","Welcome back to wonderlust!");
   
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
  }
  
module.exports.logout = (req, res, next) => {
    req.logout((err) => { // logout method take callback as parameter, that is when the user logout what should be the next step is written in the call back
   //in call back we define parameter as err it at time of logout any error will occer the nthat error come in the 'err', it error not come then 'err' is empty or undefined.
   if(err){
    return next(err);
   }
   req.flash("success", " You are logged out!");
   res.redirect("/listings");
});
}