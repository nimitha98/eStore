var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    // user : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'User'
    // },
    // placedOn : { type: Date, default: Date.now },
    // productId : {
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : 'Product'
    //     }, 
});

module.exports = mongoose.model('Order', commentSchema);

