import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Define the path to your .proto file
const PROTO_PATH = "../backend/service.proto";

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const demoProto = grpc.loadPackageDefinition(packageDefinition).demo;

export default async function handler(req, res) {
  // Only handle POST requests for gRPC calls
  if (req.method === "POST") {
    console.log("called here mahesh");
    
    const client = new demoProto.Greeter(
      "localhost:50051", // gRPC server address
      grpc.credentials.createInsecure()
    );

    // Prepare the request data (get data from the client request)
    const { name, age } = req.body; // assuming you are passing `name` and `age`

    // Call gRPC method (TempMahesh)
    client.TempMahesh({ name, age }, (error, response) => {
      if (error) {
        // Handle error
        res.status(500).json({ error: error.message });
      } else {
        // Send the gRPC response back to the client
        res.status(200).json({ message: response.message });
      }
    });
  } else {
    // If the request is not a POST, return a 405 Method Not Allowed
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
