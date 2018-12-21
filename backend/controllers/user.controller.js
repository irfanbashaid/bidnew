const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.publickey = req.body.publickey;
    user.save((err, doc) => {
        if (!err)
        {
            res.json("signed up succesfully");
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate Credentials Occured.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {    
    passport.authenticate('local', (err, user, info) => {         
        if (err) { return res.status(400).json(err); }
        else if (user.publickey != req.body.publickey){
        return res.status(404).json({ status: false, message: 'Invalid Credentials.'  });
        }
        else if (user){ return res.status(200).json({ "token": user.generateJwt() });}
        else{ return res.status(404).json(info);}
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id},
        (err, user) => {
            if (!user){
                return res.status(404).json({ status: false, message: 'User record not found.' });
            }
            else{
                return res.status(200).json({user : _.pick(user,['fullName','email','publickey']) });
            }
        }
    );
}

module.exports.changepassword = (req, res, next) =>{     
User.findOne({"email":req.body.email},function(err,user){
    if (err){
        return res.status(404).json({ status: false, message: 'User record not found.' });               
    }
    else{
        if(!user.verifyPassword(req.body.passwordold)){             
            
                return res.status(404).json({ status: false, message: 'User password is wrong.' });     
            }
            else{
                var _user = new User();                
                User.findOneAndUpdate({'email':user.email},{$set:{"password":_user.encryptPassword(req.body.password)}},function(errr,userr){
                    if(!userr){
                        return res.status(404).json({ status: false, message: 'User record not found.' }); 
                    }                   
                    else if(userr) {                        
                        return res.status(200).json(user);
                    }   
                })
            }
         }
      })
   }

module.exports.forgotpassword = (req, res, next) =>{
    var _user = new User();
    User.findOne({'email':req.body.email},function(err,user){
        if(!user){
            return res.status(404).json({ status: false, message: 'User record not found.' }); 
        }
        else if(user.publickey != req.body.publickey){
            return res.status(404).json({ status: false, message: 'User private key miss match.' }); 
        }          
        else {
            User.findOneAndUpdate({'email':user.email},{$set:{"password":_user.encryptPassword(req.body.password)}},function(errr,userr){
                if(!userr){
                    return res.status(404).json({ status: false, message: 'User record not found.' }); 
                }                  
                else {
                    console.log("success");                    
                    return res.status(200).json(user);
                }   
            })
        }
    })
 }

    module.exports.getAuctionById=(req,res,next)=>{
        Game.findOne({"auctionid":req.params.auctionid},function(err,productDetail){
            if(!err){
                return res.json(productDetail);
            }
        })
    }


    module.exports.productdetailssave = ( req, res, next )=>{
        var Auction = new Game();
        Game.find(function(errr,games){  
            Auction.auctionid = games.length+1;
            Auction.productname = req.body.product_name;
            Auction.ipfshash =req.body.ipfs_hash;
            Auction.save(function(err,user){
                if (!err){
                    console.log("user");
                    console.log(user);
                    res.json(games.length+1);
                }
                else {
                    if (err.code == 11000)
                        res.status(422).send(["Error Occured"]);
                    else
                        return next(err);
                }
            })
        })
    }


    module.exports.productDetails = (req, res, next) =>{
        Game.find(function(err,productsDetail){
            if(err){
                return res.status(400).json(err);
            }    
            else {
                return res.status(200).json(productsDetail);
            }
        })
    }
 

    module.exports.getUserName=(req,res,next)=>{
        User.findOne({'publickey':req.params.publickey},function(err,userDetail){
            if(err){
                return res.status(400).json(err);
            }
            else {
                return res.status(200).json(userDetail);
            }
         })
        }
 
    module.exports.userDetails = (req, res, next) =>{
        User.findOne({"email":emailid},function(err,userDetail){
            return res.json(userDetail);
        })    
    }

    module.exports.showselectedproducts = (req, res, next) =>{
        var stat;
        Game.findOne({"auctionid":req.body.auctionid},function(er,res){
        if(res["Auctionstatus"]==true){
        Game.findOneAndUpdate({"auctionid":req.body.auctionid},{$set:{Auctionstatus:false}},function(err,userDetail){
        if(err){
            return res.status(400).json(err);
        }
      })
    }
    else{
    Game.findOneAndUpdate({"auctionid":req.body.auctionid},{$set:{Auctionstatus:true}},function(err,userDetail){
        if(err){
            return res.status(400).json(err);
        }
       })
    }
        })
        return res.status(200).json("successfully updated");
    }

