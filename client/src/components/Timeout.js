import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timeout.css";

const Timeout = () => {
  const [inputTimeout, setInputTimeout] = useState("");
  const [isTimeoutInput, setIsTimeoutInput] = useState(false);
  const [dbTimeout, setDbTimeout] = useState("");

  // Fetch timeout
  const fetchTimeout = async () => {
    const timeoutApi = "http://localhost:3030/timeout";
    try {
      const response = await axios.get(timeoutApi);
      const sec = response.data["timeout_sec"];
      setDbTimeout(sec);
    } catch (error) {
      console.error("Error to fetch timeout", error);
    }
  };

  // Timeout save button
  const handleTimeoutSave = async () => {
    const timeoutApi = "http://localhost:3030/timeout";
    // Post seconds to db
    try {
      await axios.post(timeoutApi, {
        timeout_sec: inputTimeout,
      });
      console.log(`Save ${inputTimeout}(sec) to db!`);
    } catch (error) {
      console.error("Error save timeout to db", error);
    }

    // set timeout in this component
    fetchTimeout();

    // hiden input
    setIsTimeoutInput(false);
  };

  useEffect(() => {
    fetchTimeout();
  }, []);

  return (
    <div className="timeout-input">
      {isTimeoutInput ? (
        <>
          <label>Timeout(sec): </label>
          <input
            type="number"
            value={inputTimeout}
            onChange={(e) => setInputTimeout(e.target.value)}
          />
          <button
            className="btn btn-warning"
            // className="btn btn-danger button-start-stop"
            onClick={handleTimeoutSave}
          >
            save
          </button>
        </>
      ) : (
        <button
          className="btn btn-info"
          // className="btn btn-danger button-start-stop"
          onClick={() => setIsTimeoutInput(true)}
        >
          Timeout ({dbTimeout} sec)
        </button>
      )}
    </div>
  );
};

export default Timeout;
