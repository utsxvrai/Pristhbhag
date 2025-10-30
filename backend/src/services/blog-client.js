const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '..', '..', 'src', 'proto', 'blog.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const blogProto = grpc.loadPackageDefinition(packageDefinition).blog;

const client = new blogProto.BlogService(process.env.BLOG_SERVICE_HOST || 'localhost:50051', grpc.credentials.createInsecure());

function createBlog(data, metadata = new grpc.Metadata()) {
    return new Promise((resolve, reject) => {
        client.CreateBlog(data, metadata, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function getBlogs() {
    return new Promise((resolve, reject) => {
        client.GetBlogs({}, (err, res) => {
            if (err) return reject(err);
            // res.blogs is the repeated field
            resolve(res.blogs || []);
        });
    });
}

function getBlogById(id) {
    return new Promise((resolve, reject) => {
        client.GetBlogById({ id: String(id) }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function updateBlog(data, metadata = new grpc.Metadata()) {
    return new Promise((resolve, reject) => {
        client.UpdateBlog(data, metadata, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function deleteBlog(id, metadata = new grpc.Metadata()) {
    return new Promise((resolve, reject) => {
        client.DeleteBlog({ id: String(id) }, metadata, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};

