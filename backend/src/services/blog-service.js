const { BlogRepository, CachedBlogRepository } = require("../repositories");
const jwt = require("jsonwebtoken");
const { Redis } = require("ioredis");
const rabbit = require("../utils/rabbitmq");
const { create } = require("./user-service");

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
});

const realBlogRepo = new BlogRepository();
const blogRepo = new CachedBlogRepository(realBlogRepo, redisClient);

async function CreateBlog(call, callback) {
    try {
        const authHeader = call.metadata.get("authorization")[0];
        if (!authHeader) {
            return callback({
            code: 16, // UNAUTHENTICATED
            message: "Authorization header missing",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { title, content } = call.request;

        const newBlog = await blogRepo.create({
            title,
            content,
            author_id: decoded.id,
        });

        // Publish event to RabbitMQ
        await rabbit.publishEvent('blog-events', 'blog.created', {
            blogId: newBlog.id,
            title: newBlog.title,
            authorId: newBlog.author_id,
            createdAt : Date.now()
        });



        callback(null, {
            message: `Blog created successfully with ID: ${newBlog.id}`,
        });
        } catch (error) {
            console.error("CreateBlog Error:", error);
            callback({
            code: 13, // INTERNAL
                message: error.message,
            });
    }
}
  // Fetch all blogs
async function GetBlogs(call, callback) {
    try {
        const blogs = await blogRepo.findAll();

      // Transform to match proto message structure
        const formattedBlogs = blogs.map((b) => ({
            id: b.id,
            title: b.title,
            content: b.content,
            authorId: b.author_id,
        }));

        callback(null, { blogs: formattedBlogs });
        } catch (error) {
        console.error("GetBlogs Error:", error);
        callback({
            code: 13,
            message: error.message,
        });
    }
}

  // Fetch single blog by ID
async function GetBlogById(call, callback) {
        try {
        const { id } = call.request;
        const blog = await blogRepo.findById(id);

        if (!blog) {
            return callback({
            code: 5, // NOT_FOUND
            message: "Blog not found",
            });
        }

        callback(null, {
            id: blog.id,
            title: blog.title,
            content: blog.content,
            authorId: blog.author_id,
        });
        } catch (error) {
        console.error("GetBlogById Error:", error);
        callback({
            code: 13,
            message: error.message,
        });
    }
}

  // Update blog
async function UpdateBlog(call, callback) {
        try {
        const authHeader = call.metadata.get("authorization")[0];
        const token = authHeader?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { id, title, content } = call.request;
        const blog = await blogRepo.findById(id);

        if (!blog) {
            return callback({ code: 5, message: "Blog not found" });
        }

        if (blog.author_id !== decoded.id) {
            return callback({ code: 7, message: "Permission denied" });
        }

        const updated = await blogRepo.update(id, { title, content });
        callback(null, { message: `Blog ${updated.id} updated successfully` });
        } catch (error) {
            console.error("UpdateBlog Error:", error);
            callback({
            code: 13,
            message: error.message,
        });
        }
}

  // Delete blog
async function DeleteBlog(call, callback) {
        try {
            const authHeader = call.metadata.get("authorization")[0];
            const token = authHeader?.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const { id } = call.request;
            const blog = await blogRepo.findById(id);

            if (!blog) {
                return callback({ code: 5, message: "Blog not found" });
            }

        if (blog.author_id !== decoded.id) {
            return callback({ code: 7, message: "Permission denied" });
            }

            await blogRepo.delete(id);
            callback(null, { message: "Blog deleted successfully" });
        } catch (error) {
            console.error("DeleteBlog Error:", error);
            callback({
                code: 13,
                message: error.message,
        });
        }
}


module.exports = {
    CreateBlog,
    GetBlogs,
    GetBlogById,
    UpdateBlog,
    DeleteBlog,
};