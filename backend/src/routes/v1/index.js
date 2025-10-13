const express = require('express');
const {InfoController} = require('../../controllers');
const userRoutes = require('./user-route');

const router = express.Router();

router.get('/info', InfoController.getInfo);
router.use('/user', userRoutes);

module.exports = router;