const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const UserRoutes=require('./routes/users');

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(flash());

app.use((req, res, next) => { 
    res.locals.success = req.flash("success");
    res.locals.error=req.flash('error');
    next();
})

app.use("/",UserRoutes);

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');    
});