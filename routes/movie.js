const path = require('path');

const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

const isAuth = require("../util/is-auth");

router.get('/', movieController.getIndex);

router.get('/upcoming', movieController.getUpcoming);


router.get('/top-ten', movieController.getTopMovie);


module.exports = router;
