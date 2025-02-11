import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Load the .proto file
const PROTO_PATH = "../backend/table.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const demoProto = grpc.loadPackageDefinition(packageDefinition).demo;

export default function handler(req, res) {
  if (req.method === "POST") {
    // Set headers for SSE (Server-Sent Events)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Required for SSE

    const client = new demoProto.TableService(
      "localhost:50051",
      grpc.credentials.createInsecure()
    );

    const { number } = req.body; // Extract number from the request body

    // Call the GenerateTable method on the gRPC server
    const call = client.GenerateTable({ number });

    call.on("data", (response) => {
        console.log("00000");
        
      // Send each response to the client as a stream
      res.write(`data: ${JSON.stringify(response)}\n\n`);
    });

    call.on("end", () => {
      res.write("event: end\n");
      res.write("data: { \"message\": \"Completed\" }\n\n");
      res.end(); // End the SSE stream once done
    });

    call.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
