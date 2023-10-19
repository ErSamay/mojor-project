const express = require("express");
const app = express();
const users = require("./routes/users.js")
const posts = require("./routes/post.js")
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , "/public")));

const sessionOptions = {
    secret : "mysupersecretstring" , 
    resave : false , 
    saveUninitialized : true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register" , (req , res) => { 
    let { name } = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error" , "user not regitered");  
    }
    else{
        req.flash("success" , "user registered successfully : ");
    }
    res.redirect("/hello")
})

app.get("/hello" , (req , res) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    res.render("page.ejs" , {name : req.session.name , })
})
app.listen (3000)