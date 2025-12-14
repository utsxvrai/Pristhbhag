const express = require('express');
const {InfoController} = require('../../controllers');
const userRoutes = require('./user-route');
const blogRoutes = require('./blog-route'); 
const sttRoutes = require('./stt-route');
const evaluationRoutes = require('./evaluation-route');

const router = express.Router();

router.get('/info', InfoController.getInfo);
router.use('/user', userRoutes);
router.use('/blog', blogRoutes);
router.use('/stt', sttRoutes);
router.use('/evaluation', evaluationRoutes);

module.exports = router;