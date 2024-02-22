const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


const isAuth = require("../util/is-auth");

// /user/add-movie => GET
router.get('/add-movie', isAuth , userController.getAddMovie);

//user/add-movie => POST
router.post('/add-movie',isAuth , userController.postAddMovie);

router.get('/edit',isAuth , userController.getUserEdit);

router.post('/edit',isAuth , userController.postUserEdit);

router.get('/recommended' ,isAuth , userController.getRecommended)

router.get('/wishlist/:movieId',isAuth , userController.getAddToWishlist);

router.get('/watched/:movieId',isAuth , userController.getAddToWatch);

router.get('/wishlist',isAuth , userController.getMyWishlist);

router.get('/watched-movie',isAuth , userController.getWatchedMovies);
// router.get('/watched-movie',isAuth , (req,res,next)=>{
//     console.log("testing route");
// });

module.exports = router;
