var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Product = require('./models/product');
var Cart = require('./models/cart');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/electronics',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//seedDB();

//passport congfiguration
app.use(session({
    secret : "This is a secret message. Top secret in the world",
    resave : false,
    saveUninitialized : false,
    store : new MongoStore({ mongooseConnection : mongoose.connection}),
    cookie : { maxAge : 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    next();
})

//index page- show all products
app.get('/', function(req, res){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{products : products});
        }
    })
});

//individual product page
app.get('/products/:id', function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        }
        else{
            res.render('product/show', {product : product});
        }
    })
});

//add item to cart
app.get('/addtocart/:id', function(req, res){
    Product.findById(req.params.id, function(err, product){
        //console.log(product);
        console.log(req.session.cart, "cart");
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.add(product._id, product.price, product.name);
        req.session.cart = cart;
        console.log(cart);
        console.log(req.session.cart);
        res.redirect('back');
    });
});

app.get('/removefromcart/:id', function(req, res){
    Product.findById(req.params.id, function(err, product){
        console.log(product);
        var cart = new Cart(req.session.cart);
        cart.remove(product._id);
        req.session.cart = cart;
        console.log(cart);
        console.log(req.session.cart);
        res.redirect('/cart');
    });
});


//cart routes
app.get('/cart', function(req, res){
    //console.log(req.session.cart.products)
    if(req.session.cart && req.session.cart.products){
        res.render('cart/items', { products : req.session.cart.products });
    }
    else{
        res.render('cart/empty');
    }
});

app.post('/cart', function(req, res){
    res.redirect('cart');
});

//AUTH routes
app.get('/register', function(req, res){
    res.render('user/register');
})

//sign up
app.post('/register', function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('user/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

//Login routes
app.get('/login', function(req, res){
    res.render('user/login');
});

//login logic with middleware
app.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login'
    }), function(req, res){
    
});

//logout
app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, function(){
    console.log('eStore server started and running on port 3000');
});