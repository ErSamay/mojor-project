const express = require("express");
const router = express.Router();
const User = require("../models/user")
const wrapAsync = require("../utils/wrap.js");
const passport = require("passport");


router.get("/signup" , (req , res) => {

    res.render("users/form.ejs")
})
router.post("/signup" , wrapAsync(
    async(req , res) => {
       try{
        let{username , email , password} = req.body;
        const newUser = new User({email , username});
       const registerUser =  await User.register(newUser , password);
       console.log(registerUser);
       req.flash("success" , "Welcome to wanderlust");
       res.redirect("/listings");
       }
    catch(err) {
        req.flash("error" , err.message);
        res.redirect("/signup")

    }
    
    
    
    
    })
)

router.get("/login" , (req , res) => {
    res.render("users/login.ejs")
})
router.post("/login" , 
     passport.authenticate("local" , {
    failureRedirect : "/login" , 
    failureFlash : true , 
}) , 
async (req , res) => {
    res.send("welcome to Wanderlust you are logged in")
}
);
 
module.exports = router;