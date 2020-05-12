var express = require('express');
var app = express();
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var fs = require('fs');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');
var seedDB = require('./seeds');
var multer = require('multer');

var productRouter = require('./routes/product');
var indexRouter = require('./routes/index');
var cartRouter = require('./routes/cart');


mongoose.connect('mongodb://localhost:27017/electronics', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(methodOverride('_method'));
//seedDB();

//passport congfiguration
app.use(session({
    secret: "This is a secret message. Top secret in the world",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(productRouter);
app.use(indexRouter);
app.use(cartRouter);


app.listen(3000, function () {
    console.log('eStore server started and running on port 3000');
});