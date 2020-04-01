var mongoose = require('mongoose');
var Product = require('./models/product');
var Review = require('./models/review')

var data = [
    {
        name: "Apple iPhone 11", 
        image: "https://images.unsplash.com/photo-1580466931754-def27bb0f188?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Super fast ultra modern",
        price : 1000,
        stock : 10,
        category : 'mobile'
    },
    {
        name: "Samsung Galaxy S20", 
        image: "https://images.unsplash.com/photo-1583573636255-6a41ff5523d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Awesome camera",
        price : 900,
        stock : 10,
        category : 'mobile'
    },
    {
        name: "Google pixel", 
        image: "https://images.unsplash.com/photo-1520189123429-6a76abfe7906?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Captures the world",
        price : 800,
        stock : 10,
        category : 'mobile'
    }
]

function seedDB(){
    Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Removed all Products");
            data.forEach(function(seed){
                Product.create(seed, function(err, product){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("added a Product");
                        // Review.create({
                        //     text : "A simple review",
                        //     author : {id: null,username: "John"}
                        // }, function(err, review){
                        //     if(err){
                        //         console.log(err);
                        //     }
                        //     else{
                        //         console.log("review added");
                        //         product.comments.push(review);
                        //         product.save();
                        //     }
                        // })
                    }
                });
            });
        }
    });
}

module.exports = seedDB;

