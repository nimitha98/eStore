var mongoose = require('mongoose');
//Product schema setup
var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
    description: String,
    stock: Number,
    price: Number,
    reviews: [
        {
            text: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    unlist : Boolean
});

module.exports = mongoose.model("Product", productSchema);