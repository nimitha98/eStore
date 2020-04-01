var mongoose = require('mongoose');
var cartSchema = new mongoose.Schema({
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);

