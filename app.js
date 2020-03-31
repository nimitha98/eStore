var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Product = require('./models/product');
var Review = require('./models/review');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/electronics',{useNewUrlParser : true, useUnifiedTopology : true});

app.set('view engine', 'ejs');
seedDB();
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

app.listen(3000, function(){
    console.log('eStore server started and running on port 3000');
});