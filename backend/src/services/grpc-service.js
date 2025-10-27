const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const blogService = require('./blog-service');

function startGrpcServer() {
    const server = new grpc.Server();

    // Load proto dynamically from blog-services (sibling folder)
    const protoPath = path.join(__dirname, '..', '..', 'src', 'proto', 'blog.proto');

    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDefinition).blog;
// HERE I AM MAPPING THE SERVICE METHODS TO THE GRPC IMPLEMENTATIONS 
    const handlers = {
        CreateBlog: blogService.CreateBlog,
        GetBlogs: blogService.GetBlogs,
        GetBlogById: blogService.GetBlogById,
        UpdateBlog: blogService.UpdateBlog,
        DeleteBlog: blogService.DeleteBlog,
    };

    server.addService(proto.BlogService.service, handlers);

    const PORT = process.env.GRPC_PORT || 50051;
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        server.start();
        console.log(`✅ gRPC Blog Service running on port ${port}`);
    });
}

module.exports = { startGrpcServer };
