var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//AUTH routes
router.get('/register', function(req, res){
    res.render('user/register');
})

//sign up
router.post('/register', function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('user/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

//Login routes
router.get('/login', function(req, res){
    res.render('user/login');
});

//login logic with middleware
router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login'
    }), function(req, res){
    
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkForAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.username == 'admin'){
            //console.log(req.user.username);
            next();
        }
        else{
            res.redirect('back');
        }
    }
    else{
        res.redirect('back');
    }  
}

module.exports = router;