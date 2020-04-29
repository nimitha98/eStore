var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

//add item to cart
router.get('/addtocart/:id', function (req, res) {
    Product.findById(req.params.id, function (err, product) {
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

router.get('/removefromcart/:id', function (req, res) {
    Product.findById(req.params.id, function (err, product) {
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
router.get('/cart', function (req, res) {
    //console.log(req.session.cart.products)
    if (req.session.cart && req.session.cart.products) {
        res.render('cart/items', { products: req.session.cart.products, totalPrice: req.session.cart.totalPrice });
    }
    else {
        res.render('cart/empty');
    }
});

router.post('/cart', function (req, res) {
    res.redirect('cart');
});

//checkout routes
router.get('/checkout', isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }

    res.render('cart/checkout');
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
    });

    order.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            req.session.cart = null;
            res.redirect('/');
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;