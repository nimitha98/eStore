module.exports = function Cart(oldCart, productId, price){
    if(oldCart) {
        this.products = oldCart.products;
        var item = this.products[productId];
        if(!item){
            this.products[productId] = { price : price, quantity : 1 };
        }
        else{
            this.products[productId].quantity += 1;
        }  
    }
    else {
        this.products[productId]  = { price : price, quantity : 1 };
    }
}
