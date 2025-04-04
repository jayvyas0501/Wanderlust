const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res)=> {
    res.render('users/signup')
}

module.exports.signup = async(req,res)=>{
    try{
    let{username,email,password} = req.body;    
    const newUser = new User({username,email})
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have successfully logged in!")
         res.redirect("/listings")
    })
   
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
    req.flash("success","you are logged in")
    const redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err) return next(err)
        req.flash("success","Logged Out Successfully")
        res.redirect("/login")
    })  
}