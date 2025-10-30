const express = require('express');
const {BlogController} = require('../../controllers');

const router = express.Router();

router.post('/create', BlogController.createBlog);
router.get('/', BlogController.getBlogs);
router.get('/:id', BlogController.getBlogById);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);


module.exports = router;