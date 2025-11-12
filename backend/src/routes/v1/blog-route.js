const express = require('express');
const {BlogController} = require('../../controllers');
const { authMiddleware } = require('../../middlewares/auth-middleware');

const router = express.Router();

// Protected routes require a valid token
router.post('/create', authMiddleware, BlogController.createBlog);
router.get('/', BlogController.getBlogs);
router.get('/:id', BlogController.getBlogById);
router.put('/:id', authMiddleware, BlogController.updateBlog);
router.delete('/:id', authMiddleware, BlogController.deleteBlog);

module.exports = router;