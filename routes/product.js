var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');

//index page- show all products
router.get('/', function(req, res){
    res.redirect('/products');
});
router.get('/products', function(req, res){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{products : products});
        }
    })
});

//NEW product
router.get('/products/new', checkForAdmin, function(req, res){
    res.render('product/new');
});

//CREATE product and save in database
router.post('/products', checkForAdmin, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = parseInt(req.body.price);
    var stock = parseInt(req.body.stock);
    var category = req.body.category;
    var newProduct = {name : name, image : image, description : desc, price: price, stock : stock, category: category};
    
    //add product to database
    Product.create(newProduct, function(err, newEntry){
        if(err){
            console.log("Some problem", err);
        }
        else{
            res.redirect('/');
        }
    }); 
});
//SHOW individual product page
router.get('/products/:id', function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        }
        else{
            res.render('product/show', {product : product});
        }
    })
});

//EDIT product
router.get('/products/:id/edit', checkForAdmin, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        console.log(req.params.id, "from edit");
        res.render('product/edit', {product : foundProduct});  
    });
});

//UPDATE product
router.put('/products/:id', checkForAdmin, function(req, res){
    var product = req.body.product;
    product.price = parseInt(product.price);
    product.stock = parseInt(product.stock);
    Product.findByIdAndUpdate(req.params.id, product, function(err, updatedProduct){
        console.log(req.params.id, "from update");
        //console.log(req.body.product);
        //console.log(updatedProduct);
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/products/' + req.params.id);
        }
    });
});

//DESTROY product
router.delete('/products/:id', checkForAdmin, function(req, res){
    Product.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkForAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.username == 'admin'){
            //console.log(req.user.username);
            next();
        }
        else{
            res.redirect('back');
        }
    }
    else{
        res.redirect('back');
    }  
}

module.exports = router;