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
seedDB();

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
            res.render('show', {product : product});
        }
    })
});

//add item to cart
app.get('/addtocart/:id', function(req, res){
    //var cart = new Cart(req.session.cart ? req.session.cart : )
    Product.findById(req.params.id, function(err, product){
        //var newCart = [{product._id : {price : product.price, quantity : 1}}];
        var cart = new Cart(req.session.cart, product._id, product.price);
        req.session.cart = cart;
        console.log(cart);
        console.log(req.session.cart);
        res.redirect('/');
    });
});
//buy product
// app.get('/products/:id/purchase', function(req, res){
//     //take user details and add to his purchases/orders - TBI
//     Product.findById(req.params.id, function(err, product){
//         if(err){
//             console.log(err);
//         }
//         else{
//             if(product.stock <= 0)
//             {
//                 //implement
//                 res.redirect('/products/:id/purchase');
//             }
//             else{
//                 res.render('purchase', {product : product});
//             }
//         }
//     })
// });

// app.post('/products/:id/purchase', function(req, res){
//     var address = req.body.address;
//     Product.findById(req.params.id, function(err, product){
//         if(err){
//             console.log(err);
//         }
//         else{
//             //console.log(product);
//             //var productArray = [];
//             //productArray.push(product);
//             Cart.find({}, function(err, cart){
//                 if(err){
//                     console.log(err);
//                 }
//                 else if(cart === []){
//                     console.log(product);
//                     console.log(cart);
//                     cart.products.push(product);
                    
//                     cart.save();
//                     res.redirect('/products/' + req.params.id);
//                 }
//                 else{
//                     Cart.create({}, function(err, cart){
//                         if(err){
//                             console.log(err);
//                         }
//                         else{
//                             console.log(product);
//                             console.log(cart);
//                             cart.products.push(product);
                            
//                             cart.save();
//                             res.redirect('/products/' + req.params.id);
//                         }
//                     })
//                 }
//             })
//         }
//     });
//     //res.render('cart',{address : address});
// });

app.get('/cart', function(req, res){
    // Cart.find({}).populate('products').exec(function(err, items){
    //     console.log(items);
    //     res.render('cart', {products : items[0].products});
    // })
    //Cart.create
    console.log(req.session.cart.products)
    res.render('cart', { products : req.session.cart.products });

});

app.post('/cart', function(req, res){
    // Cart.find({}, function(err, items){
    //     res.render('cart', {items : items[0]});
    // })
    res.redirect('cart');
});

//AUTH routes
app.get('/register', function(req, res){
    res.render('register');
})

//sign up
app.post('/register', function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

//Login routes
app.get('/login', function(req, res){
    res.render('login');
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