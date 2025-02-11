const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./service.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const demoProto = grpc.loadPackageDefinition(packageDefinition).demo;

// Create a gRPC client
const client = new demoProto.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Call the SayHello method
client.SayHello({ name: "John" }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Server Response:", response.message);
  }
});

client.TempMahesh({ name: "Mahesh", age: 25 }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Server Response:", response.message);
  }
});
