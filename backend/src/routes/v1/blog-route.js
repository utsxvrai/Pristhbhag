const express = require('express');
const {BlogController} = require('../../controllers');

const router = express.Router();

router.post('/create', BlogController.createBlog);


module.exports = router;