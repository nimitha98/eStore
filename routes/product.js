var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);

    }
});

var upload = multer({ storage: storage });

//index page- show all products
router.get('/', function (req, res) {
    res.redirect('/productspaging/1');
});
// router.get('/products', function (req, res) {
//     Product.find({}, function (err, products) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             res.render('index', { products: products });
//         }
//     })
// });
router.get('/products', function (req, res) {
    res.redirect('/productspaging/1');
});


router.get('/productspaging/:page', function (req, res, next) {
    var perPage = 4
    var page = req.params.page || 1


    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, products) {
            Product.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('index', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })

    //res.redirect('/search');
})

//NEW product
router.get('/products/new', checkForAdmin, function (req, res) {
    res.render('product/new');
});

//CREATE product and save in database
router.post('/products', upload.single('mypic'), checkForAdmin, function (req, res) {

    var name = req.body.name;
    console.log("name : " + name);
    var image = req.body.name + '.jpg';
    var desc = req.body.description;
    var price = parseInt(req.body.price);
    var stock = parseInt(req.body.stock);
    console.log("Price : " + price);
    console.log("Stock : " + stock);
    console.log("image : " + image);
    console.log("desc : " + desc);
    console.log("Price : " + parseInt(price));
    console.log("Stock : " + parseInt(stock));
    var category = req.body.category;
    var newProduct = { name: name, image: image, description: desc, price: price, stock: stock, category: category };

    //add product to database
    Product.create(newProduct, function (err, newEntry) {
        if (err) {
            console.log("Some problem", err);
        }
        else {
            res.redirect('/');
        }
    });
});
//SHOW individual product page
router.get('/products/:id', function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('product/show', { product: product });
        }
    })
});

//EDIT product
router.get('/products/:id/edit', checkForAdmin, function (req, res) {
    Product.findById(req.params.id, function (err, foundProduct) {
        console.log(req.params.id, "from edit");
        res.render('product/edit', { product: foundProduct });
    });
});

//UPDATE product
router.put('/products/:id', upload.single('product[image]'), checkForAdmin, function (req, res) {
    var product = req.body.product;
    product.image = product.name + ".jpg";
    product.price = parseInt(product.price);
    product.stock = parseInt(product.stock);
    Product.findByIdAndUpdate(req.params.id, product, function (err, updatedProduct) {
        console.log(req.params.id, "from update");
        //console.log(req.body.product);
        //console.log(updatedProduct);
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/products/' + req.params.id);
        }
    });
});

//DESTROY product
router.delete('/products/:id', checkForAdmin, function (req, res) {
    // Product.findByIdAndDelete(req.params.id, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.redirect('/');
    //     }
    // });
    //Implement soft delete
    Product.findById(req.params.id, function (err, foundProduct) {
        console.log(req.params.id, "from delete");
        //console.log(req.body.product);
        //console.log(updatedProduct);
        foundProduct.unlist = true;
        foundProduct.save(function (err, updatedProduct) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(updatedProduct);
                res.redirect('/');
            }
        });
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkForAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.username == 'admin') {
            //console.log(req.user.username);
            next();
        }
        else {
            res.redirect('back');
        }
    }
    else {
        res.redirect('back');
    }
}


//search for categories

router.get("/search", function (req, res) {
    var name = req.query["title"];
    var category = req.query["category"];
    // console.log("Title : " + name);
    // console.log("Category : " + category);
    var query = {};
    if (
        (category === "All" || category === undefined) &&
        (name === undefined || name === "")
    ) {
        //  console.log("both empty !!");
    } else if (category === "All" || category === undefined) {
        // console.log("category undefined");
        query = { name: { $regex: name, $options: "i" } };
    } else if (name === undefined || name === "") {
        // console.log("name undefined");
        query = { category: { $regex: category, $options: "i" } };
    } else {
        // console.log("both defined");
        query = { name: { $regex: name, $options: "i" }, category: { $regex: category, $options: "i" } };
    }
    var perPage = 4;
    var page = req.params.page || 1



    Product
        .find(query)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, products) {
            Product.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(products);
                    console.log(page);
                    console.log(count / perPage);
                    var data = {
                        products: products,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    };

                    res.json(data);
                }
            })
        })
});

module.exports = router;