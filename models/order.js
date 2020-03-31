var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    text : String,
    product : { id :
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        },
        username : String
    }
});

module.exports = mongoose.model('Order', commentSchema);

