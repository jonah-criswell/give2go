
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("API call failed"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1 className="text-4xl font-bold text-blue-600">Hello from React + Rails</h1>
      <p>API says: {message}</p>
    </div>
  );
}

export default App;

