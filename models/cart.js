module.exports = function Cart(oldCart, productId, price, name){
    if(oldCart) {
        this.products = oldCart.products;
        var item = this.products[productId];
        if(!item){
            this.products[productId] = { price : price, quantity : 1, name : name };
        }
        else{
            this.products[productId].quantity += 1;
        }  
    }
    else {
        this.products = {};
        this.products[productId]  = { price : price, quantity : 1, name : name };
    }
}
