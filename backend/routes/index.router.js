const express = require('express');
var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
})
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.get('/userProfile/:to',jwtHelper.verifyJwtToken,ctrlUser.userProfile);
router.get('/getUserName/:publickey', ctrlUser.getUserName);
router.get('/getAuctionById/:auctionid', ctrlUser.getAuctionById);
router.get('/productDetails', ctrlUser.productDetails);   
router.get('/userDetails', ctrlUser.userDetails); 


router.put('/changepassword',ctrlUser.changepassword);
router.put('/forgotpassword',ctrlUser.forgotpassword);
router.put('/storeselectedproduct',ctrlUser.showselectedproducts)


router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/productdetailssave',ctrlUser.productdetailssave); 


module.exports = router;



