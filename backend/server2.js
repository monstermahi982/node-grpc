const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./table.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const demoProto = grpc.loadPackageDefinition(packageDefinition).demo;

function generateTable(call) {
    console.log("-----------");
    
  const number = call.request.number;
  let counter = 1;

  // Send each row of the table with a 1-minute delay
  const interval = setInterval(() => {
    if (counter <= 10) {
      // Limiting to 10 rows for the multiplication table
      console.log("write done");
      
      call.write({
        row: counter,
        result: `${number} x ${counter} = ${number * counter}`,
      });
      counter++;
    } else {
      clearInterval(interval);
      call.end(); // End the response after 10 rows
    }
  }, 1000); // 1-minute delay (60000 milliseconds)
}

const server = new grpc.Server();
server.addService(demoProto.TableService.service, {
  GenerateTable: generateTable,
});

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server running on port ${PORT}`);
    server.start();
  }
);
