import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timeout.css";

const Timeout = () => {
  const [inputTimeout, setInputTimeout] = useState(""); // Initialize as an empty string
  const [isTimeoutInput, setIsTimeoutInput] = useState(false);
  const [dbTimeout, setDbTimeout] = useState("");
  const [reqTimeout, setReqTimeout] = useState("");
  const [parentCount, setParentCount] = useState("");
  const [recommandTimeout, setRecommandTimeout] = useState("");

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

  // Fetch request timeout
  const fetchReqTimeout = async () => {
    // Fetch data from the API
    axios
      .get("http://localhost:3030/req-timeout")
      .then((response) => {
        // Extract the values from the API response
        const { req_timeout_sec } = response.data;
        setReqTimeout(req_timeout_sec);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Fetch count of parent
  const fetchParentCount = () => {
    axios
      .get("http://localhost:3030/parent/count")
      .then((response) => {
        const { count } = response.data;
        setParentCount(count);
      })
      .catch((error) => {
        console.error("Error fetching parent count", error);
      });
  };

  // useEffect
  useEffect(() => {
    fetchTimeout();
    fetchReqTimeout();
    fetchParentCount();
  }, []);

  useEffect(() => {
    const recommand = (parentCount / 2) * (reqTimeout + reqTimeout + 1);
    setRecommandTimeout(recommand);
  }, [parentCount, reqTimeout]);

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
        <>
          <button
            className="btn btn-info"
            onClick={() => {
              setInputTimeout(dbTimeout); // Set the input value to the fetched timeout value
              setIsTimeoutInput(true);
            }}
          >
            Timeout ({dbTimeout} sec)
          </button>
          <span> Recommand: {recommandTimeout}</span>
        </>
      )}
    </div>
  );
};

export default Timeout;
