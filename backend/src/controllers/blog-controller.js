const { BlogClient } = require('../services');
const { StatusCodes } = require('http-status-codes');
const grpc = require('@grpc/grpc-js');

async function createBlog(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authorization header missing' });
        }

        const metadata = new grpc.Metadata();
        metadata.add('authorization', authHeader);

        const blog = { title: req.body.title, content: req.body.content };

        const createdBlog = await BlogClient.createBlog(blog, metadata);
        res.status(StatusCodes.CREATED).json(createdBlog);
    } catch (error) {
        console.error('Error in createBlog controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal Server Error' });
    }
}

async function getBlogs(req, res) {
    try {
        const blogs = await BlogClient.getBlogs();
        res.status(StatusCodes.OK).json(blogs);
    } catch (error) {
        console.error('Error in getBlogs controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function getBlogById(req, res) {
    try {
        const blog = await BlogClient.getBlogById(req.params.id);
        res.status(StatusCodes.OK).json(blog);
    } catch (error) {
        console.error('Error in getBlogById controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function updateBlog(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const metadata = new grpc.Metadata();
        if (authHeader) metadata.add('authorization', authHeader);

        const blogData = { id: req.params.id, title: req.body.title, content: req.body.content };
        const updatedBlog = await BlogClient.updateBlog(blogData, metadata);
        res.status(StatusCodes.OK).json(updatedBlog);
    } catch (error) {
        console.error('Error in updateBlog controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function deleteBlog(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const metadata = new grpc.Metadata();
        if (authHeader) metadata.add('authorization', authHeader);

        const result = await BlogClient.deleteBlog(req.params.id, metadata);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in deleteBlog controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};