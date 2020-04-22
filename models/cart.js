module.exports = function Cart(oldCart, productId, price, name){
    //if(oldCart) {
        console.log(oldCart,"present");
        this.products = oldCart.products || {};
        this.totalQuantity = oldCart.totalQuantity || 0;  
        this.totalPrice = oldCart.totalPrice || 0;
    // }
    // else {
        //console.log(oldCart,"absent");
        //this.products = {};
        //this.products[productId]  = { price : price, quantity : 1, name : name };
        //this.totalQuantity = 0;
    //} 

    this.add = function(productId, price, name){
        console.log(this.products);
        console.log(productId);
        console.log(this.products[productId]);

        var item = this.products[productId];
        if(!item){
            this.products[productId] = { price : price, quantity : 1, name : name };
        }
        else{
            this.products[productId].quantity += 1;
        }  
        this.totalQuantity += 1;
        this.totalPrice += price;
    }

    this.remove = function(productId){
        this.products[productId].quantity--;
        this.totalQuantity--;
        this.totalPrice -= this.products[productId].price;
        if(this.products[productId].quantity <= 0){
            delete this.products[productId];
        }
        if(this.totalQuantity <= 0){
            delete this.totalQuantity;
            delete this.products;
            delete this.totalPrice;
            delete this;
        }
    }
}
