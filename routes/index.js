var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');
var bcrypt = require("bcrypt");
var mongoose = require("mongoose");


//AUTH routes
router.get('/register', function (req, res) {
    res.render('user/register');
})

//sign up
// router.post('/register', function (req, res) {
//     User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
//         if (err) {
//             console.log(err);
//             return res.render('user/register');
//         }
//         passport.authenticate('local')(req, res, function () {
//             res.redirect('/');
//         });
//     });
// });



router.post('/signup', function (req, res) {

    Users = new User({ email: req.body.email, username: req.body.username });

    User.register(Users, req.body.password, function (err, user) {
        if (err) {
            res.json({ success: false, message: "Your account could  not be saved. Error: " + err });
        } else {
            res.json({ success: true, message: "Your account has  been saved" });
        }
    });
});

//Login routes
router.get('/login', function (req, res) {
    res.render('user/login');
    // console.log(req.flash('loginMessage'));
    // res.render('user/login', { message: req.flash('loginMessage') });
});

//login logic with middleware
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function (req, res, err) {
    if (err) {
        console.log(err);
    }
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//user profile
router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({ user: req.user }, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        var allOrders = [];
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            allOrders.push(cart);
        });
        console.log(allOrders);
        res.render('user/profile', { orders: allOrders });
    });
});


//signup 
router.get("/signup", function (req, res) {
    res.render("user/signup", { title: "Signup Page" });
});

//signup post request
// router.post("/signup", function (req, res) {
// console.log("In signup");
// var db = mongoose.connection;
// db.collection("users")
//     .find({ email: req.body.email })
//     .toArray(function (err, result) {
//         if (err) {
//             console.log("Error : " + err);
//             //db.close();
//         } else {
//             console.log(result);
//             console.log(result.length);
//             var len = result.length;
//             if (len !== 0) {
//                 console.log("found");
//                 res.json({
//                     message: "A user with that email has already registered.",
//                     status: "error",
//                 });
//                 //db.close();
//             } else {
//                 console.log("Not found");
//                 var name = req.body.username;
//                 var email = req.body.email;
//                 var password = bcrypt.hashSync(req.body.password, 10);

//                 var data = {
//                     username: name,
//                     email: email,
//                     password: password,
//                 };
//                 db.collection("users").insertOne(data, function (err, doc) {
//                     if (err) {
//                         console.log("Unexpected Error :" + err);
//                         res.json({
//                             message: "Unexpected error occured while creating account",
//                             status: "error",
//                         });
//                         // db.close();
//                     } else {
//                         console.log("document added to collection");
//                         res.json({
//                             message: "Account created successfully.",
//                             status: "success",
//                         });
//                         // db.close();
//                     }
//                 });
//             }
//         }
//         // db.close();
//     });

// User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
//     if (err) {
//         console.log(err);
//         return res.render('signup');
//     }
//     passport.authenticate('local')(req, res, function () {
//         console.log("In signup !");
//         res.redirect('/');
//     });
// });



//     User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
//         if (err) {
//             //console.log(err);
//             return res.render('signup');
//         }
//         passport.authenticate('local', function (err, user, info) {
//             console.log("Passport ///////////////////////");
//             if (err) { return next(err) }
//             if (!user) {
//                 // *** Display message without using flash option
//                 // re-render the login form with a message

//                 console.log("This is the info message");
//                 console.log("///////////////////////////////////////////////////////");
//                 console.log(info.message);
//                 return res.render('signup', { message: info.message })
//             }
//         });
//     });

// });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkForAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.username == 'admin') {
            //console.log(req.user.username);
            next();
        }
        else {
            res.redirect('back');
        }
    }
    else {
        res.redirect('back');
    }
}



//search for categories

router.get("/search", function (req, res) {
    var title = req.query["title"];
    var category = req.query["category"];
    console.log("Title : " + title);
    console.log("Category : " + category);
    var query = {};
    if (
        (category === "All" || category === undefined) &&
        (title === undefined || title === "")
    ) {
        console.log("both empty !!");
    } else if (category === "All" || category === undefined) {
        console.log("category undefined");
        query = { title: { $regex: title, $options: "i" } };
    } else if (title === undefined || title === "") {
        console.log("title undefined");
        query = { category: category };
    } else {
        console.log("both defined");
        query = { title: { $regex: title, $options: "i" }, category: category };
    }
    console.log("Category : " + category);
    console.log("Title : " + title);
    Product.find(query, function (err, products) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(products);
        }
    })
});

module.exports = router;