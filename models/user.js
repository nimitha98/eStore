var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    firstname : String,
    lastname : String,
    phone : String,
    username : String,
    password : String,
    orders : [
        {
            placedOn : { type: Date, default: Date.now },
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'},
            estimatedDelivery : Date
        }
    ],
    address : [
        {   
            address1 : String,
            address2 : String,
            country : String,
            state : String,
            zip : Number
        }
    ],
    cart : [
        {
            product : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'Product'
            }
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
