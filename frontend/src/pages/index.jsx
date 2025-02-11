import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [response, setResponse] = useState("");
  const sendGRPCRequest = async () => {
    const data = { name: "Mahesh", age: 30 };

    try {
      const response = await fetch("/api/grpc2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData); // Handle the gRPC response here
    } catch (error) {
      console.error("Error calling gRPC API:", error);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Enter Age"
        type="number"
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={sendGRPCRequest}>Send Request</button>
      <p>Response: {response}</p>
    </div>
  );
}
