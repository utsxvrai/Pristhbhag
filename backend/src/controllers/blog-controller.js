const { BlogClient } = require("../services");
const { StatusCodes } = require("http-status-codes");
const grpc = require('@grpc/grpc-js');

async function createBlog(req, res) {
    try {
        // ✅ Extract and validate the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authorization header missing' });
        }

        // ✅ Build metadata to send JWT to gRPC service
        const metadata = new grpc.Metadata();
        metadata.add('authorization', authHeader);

        // ✅ Construct blog data (no author_id here — the gRPC service will decode it from token)
        const blog = {
            title: req.body.title,
            content: req.body.content,
        };

        // ✅ Wrap gRPC call in a Promise for async/await handling
        const createdBlog = await new Promise((resolve, reject) => {
            BlogClient.CreateBlog(blog, metadata, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });

        res.status(StatusCodes.CREATED).json(createdBlog);
    } catch (error) {
        console.error('Error in createBlog controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message || 'Internal Server Error',
        });
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
        const blog = await BlogClient.getBlogById(parseInt(req.params.id));
        res.status(StatusCodes.OK).json(blog);
    } catch (error) {
        console.error('Error in getBlogById controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }   
}

async function updateBlog(req, res) {
    try {
        const blogData = {
            id: parseInt(req.params.id),
            title: req.body.title,
            content: req.body.content
        };
        const updatedBlog = await BlogClient.updateBlog(blogData);
        res.status(StatusCodes.OK).json(updatedBlog);
    } catch (error) {
        console.error('Error in updateBlog controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
async function deleteBlog(req, res) {
    try {
        const blogId = parseInt(req.params.id);
        const result = await BlogClient.deleteBlog(blogId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in deleteBlog controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function deleteBlog(req, res) {
    try {
        const blogId = parseInt(req.params.id);
        const result = await BlogClient.deleteBlog(blogId);
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
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