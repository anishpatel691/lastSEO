import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hello, React! 🚀</h1>
      <p>Click the button to increase the count:</p>
      <h2>{count}</h2>
      <button 
        onClick={() => setCount(count + 1)} 
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Click Me
      </button>
    </div>
  );
}

export default App;
