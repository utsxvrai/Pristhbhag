const express = require('express');
const {InfoController} = require('../../controllers');
const userRoutes = require('./user-route');
const blogRoutes = require('./blog-route'); 

const router = express.Router();

router.get('/info', InfoController.getInfo);
router.use('/user', userRoutes);
router.use('/blog', blogRoutes);


module.exports = router;