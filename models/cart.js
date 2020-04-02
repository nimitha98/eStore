// var mongoose = require('mongoose');
// var cartSchema = new mongoose.Schema({
//     products : [
//         {
//             type : mongoose.Schema.Types.ObjectId,
//             ref : 'Product'
//         }
//     ]
// });

// module.exports = mongoose.model('Cart', cartSchema);

module.exports = function Cart(oldCart, productId, price){
    // this.products = oldCart.products;
    // this.totalQuantity = oldCart.quantity;
    // this.totalPrice = oldCart.totalPrice;

    // this.add = function(product, productId){
    //     var existingItem = this.products[productId];
    //     if(!existingItem){
    //         this.products[productId] = {product : product, quantity : 0, price : 0};
    //         existingItem = this.products[productId];
    //     }
    //     existingItem.quantity++;
    //     //existingItem.price = 

    // }
    if(oldCart)
    {
        this.products = oldCart.products;
        var item = this.products[productId];
        if(!item){
            this.products[productId] = {price : price, quantity : 1};
        }
        else{
            this.products[productId].quantity += 1;
        }  
    }
    else{
        this.products =  {productId : {price : price, quantity : 1} } ;
    }
    // this.add = function(productId, price){
    //     var item = this.products[productId];
    //     if(!item){
    //         this.products[productId] = {price : price, quantity : 1};
    //     }
    //     else{
    //         this.products[productId].quantity += 1;
    //     }  
    // }
}
