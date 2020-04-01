var mongoose = require('mongoose');
var cartSchema = new mongoose.Schema({
    name : String,
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);

