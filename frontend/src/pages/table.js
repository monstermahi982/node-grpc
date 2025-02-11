import { useState } from "react";

export default function Home() {
  const [number, setNumber] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setTableData([]);

    // Send a POST request to the API endpoint
    const response = await fetch("/api/grpc2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: parseInt(number) }),
    });

    if (response.ok) {
      const eventSource = new EventSource("/api/grpc2");

      eventSource.onmessage = function (event) {
        const newData = JSON.parse(event.data);
        if (newData.message === "Completed") {
          setLoading(false);
          eventSource.close();
        } else {
          setTableData((prevData) => [...prevData, newData]);
        }
      };

      eventSource.onerror = function (error) {
        console.error("EventSource failed:", error);
        setLoading(false);
        eventSource.close();
      };
    } else {
      console.error("Failed to send data to the server");
    }
  };

  return (
    <div className="container">
      <h1>Generate Multiplication Table</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter number"
        />
        <button type="submit">Generate Table</button>
      </form>

      {loading && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Row</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.row}</td>
                <td>{item.result}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
