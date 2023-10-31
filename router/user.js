const express = require("express");
const router = express.Router();
const User = require("../models/user")
const wrapAsync = require("../utils/wrap.js");
const passport = require("passport");
const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignUp)

.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderlogin )
.post(
     passport.authenticate("local" , {
    failureRedirect : "/login" , 
    failureFlash : true , 
}) , 
userController.login
);

router.get("/logout" , userController.logout);
 
module.exports = router;