var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');

//add item to cart
router.get('/addtocart/:id', function(req, res){
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

router.get('/removefromcart/:id', function(req, res){
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
router.get('/cart', function(req, res){
    //console.log(req.session.cart.products)
    if(req.session.cart && req.session.cart.products){
        res.render('cart/items', { products : req.session.cart.products, totalPrice : req.session.cart.totalPrice });
    }
    else{
        res.render('cart/empty');
    }
});

router.post('/cart', function(req, res){
    res.redirect('cart');
});

module.exports = router;