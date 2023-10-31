import React, { useEffect, useState } from "react";
import axios from "axios";

const ReqTimeoutTable = () => {
  const [reqTimeout, setReqTimeout] = useState(99);

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

  useEffect(() => {
    fetchReqTimeout();
  }, []);

  const handleSave = () => {
    axios
      .post("http://localhost:3030/req-timeout", {
        req_timeout_sec: reqTimeout,
      })
      .then(() => {
        alert('"Req Timeout" saved successfully!');
        console.log("ReqTimeout saved to db!");

        // Reload timeout
        fetchReqTimeout();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Request Timout</h2>
      <div className="row">
        <div className="col-md-12">
          <form className="border rounded p-4 shadow">
            <div className="form-group mb-2">
              <label htmlFor="req_timeout_sec">Timeout (sec):</label>
              {/* Req Timeout input */}
              <input
                type="text"
                className="form-control"
                id="req_timeout_sec"
                value={reqTimeout}
                onChange={(e) => setReqTimeout(e.target.value)}
              />
              {/* Save button */}
              <div className="form-group mt-2 text-center">
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReqTimeoutTable;
