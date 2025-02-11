const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./service.proto";

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const demoProto = grpc.loadPackageDefinition(packageDefinition).demo;

// Implement the SayHello method
function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}!` });
}

// Implement the SayHello method
function tempMahesh(call, callback) {
  callback(null, { message: `Temp, ${call.request.name}! and my age is ${call.request.age}` });
}

// Start the gRPC server
const server = new grpc.Server();
server.addService(demoProto.Greeter.service, { SayHello: sayHello, TempMahesh: tempMahesh });

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server running on port ${PORT}`);
    server.start();
  }
);
