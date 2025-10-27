const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '..', '..', 'src', 'proto', 'blog.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const blogProto = grpc.loadPackageDefinition(packageDefinition).blog;

const client = new blogProto.BlogService('localhost:50051', grpc.credentials.createInsecure());

module.exports = client;

