import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timeout.css";

const Timeout = () => {
  const [inputTimeout, setInputTimeout] = useState(""); // Initialize as an empty string
  const [isTimeoutInput, setIsTimeoutInput] = useState(false);
  const [dbTimeout, setDbTimeout] = useState("");

  // Fetch timeout
  const fetchTimeout = () => {
    axios
      .get("http://localhost:3030/timeout")
      .then((response) => {
        const sec = response.data["timeout_sec"];
        setDbTimeout(sec);
      })
      .catch((error) => {
        console.error("Error fetching timeout", error);
      });
  };

  // useEffect
  useEffect(() => {
    fetchTimeout();
  }, []);

  const handleEdit = (newValue, field) => {
    setInputTimeout(newValue); // Update the inputTimeout state directly
  };

  // Save button and POST to db
  const handleSave = async () => {
    axios
      .post("http://localhost:3030/timeout", {
        timeout_sec: inputTimeout,
      })
      .then(() => {
        console.log(`Saved ${inputTimeout}(sec) to the database!`);

        // Refresh timeout
        fetchTimeout();

        // Hide input
        setIsTimeoutInput(false);
      })
      .catch((error) => {
        console.error("Error saving timeout to the database", error);
      });
  };

  return (
    <div className="container mt-4 mb-4">
      {isTimeoutInput ? (
        <div className="input-container mt-4">
          <label className="form-label">Timeout (sec): </label>
          <input
            type="number"
            className="form-control"
            style={{ width: "100px" }}
            value={inputTimeout}
            onChange={(e) => handleEdit(e.target.value, "timeout_sec")}
          />
          <button className="btn btn-warning" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <button
          className="btn btn-info"
          onClick={() => {
            setInputTimeout(dbTimeout); // Set the input value to the fetched timeout value
            setIsTimeoutInput(true);
          }}
        >
          Timeout ({dbTimeout} sec)
        </button>
      )}
    </div>
  );
};

export default Timeout;
