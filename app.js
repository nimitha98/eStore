var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Product = require('./models/product');
var Cart = require('./models/cart');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/electronics',{useNewUrlParser : true, useUnifiedTopology : true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();
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

//buy product
app.get('/products/:id/purchase', function(req, res){
    //take user details and add to his purchases/orders - TBI
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        }
        else{
            if(product.stock <= 0)
            {
                //implement
                res.redirect('/products/:id/purchase');
            }
            else{
                res.render('purchase', {product : product});
            }
        }
    })
});

app.post('/products/:id/purchase', function(req, res){
    var address = req.body.address;
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        }
        else{
            //console.log(product);
            //var productArray = [];
            //productArray.push(product);
            Cart.find({}, function(err, cart){
                if(err){
                    console.log(err);
                }
                else if(cart === []){
                    console.log(product);
                    console.log(cart);
                    cart.products.push(product);
                    
                    cart.save();
                    res.redirect('/products/' + req.params.id);
                }
                else{
                    Cart.create({}, function(err, cart){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(product);
                            console.log(cart);
                            cart.products.push(product);
                            
                            cart.save();
                            res.redirect('/products/' + req.params.id);
                        }
                    })
                }
            })
        }
    });
    //res.render('cart',{address : address});
});

app.get('/cart', function(req, res){
    Cart.find({}).populate('products').exec(function(err, items){
        console.log(items);
        res.render('cart', {products : items[0].products});
    })
    //Cart.create
});

app.post('/cart', function(req, res){
    // Cart.find({}, function(err, items){
    //     res.render('cart', {items : items[0]});
    // })
    res.redirect('/cart');
});

app.listen(3000, function(){
    console.log('eStore server started and running on port 3000');
});