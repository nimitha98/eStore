var mongoose = require('mongoose');
//Product schema setup
var productSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    stock : Number
});

module.exports = mongoose.model("Product", productSchema);