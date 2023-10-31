import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Schedule = () => {
  const [isScheduled, setIsScheduled] = useState(0); // [1, 0]
  const [startTime, setStartTime] = useState("00:00:00");
  const [stopTime, setStopTime] = useState("00:00:00");

  const fetchScheduleTime = async () => {
    axios
      .get("http://localhost:3030/schedule")
      .then((response) => {
        console.log(response.data);
        setStartTime(response.data.start_time);
        setStopTime(response.data.stop_time);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchScheduleTime();
  }, []);

  const handleSubmit = async () => {
    axios
      .post("http://localhost:3030/schedule", {
        is_scheduled: isScheduled,
        start_time: startTime,
        stop_time: stopTime,
      })
      .then((response) => {
        // console.log(response);
        // Refresh the data
        fetchScheduleTime();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Schedule</h2>
        <div className="row">
          <div className="col-md-12">
            <form className="border rounded p-4 shadow">
              <div className="form-group mb-2">
                {/* Is Scheduled */}
                <div class="col-12 mb-2">
                  <label htmlFor="is_scheduled">啟用: </label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                  />
                </div>
                {/* Start Time */}
                <div class="col-12 mb-2">
                  <label htmlFor="start_time">Start Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              {/* Stop Time */}
              <div className="form-group mb-2">
                <div class="col-12">
                  <label htmlFor="stop_time">Stop Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={stopTime}
                    onChange={(e) => setStopTime(e.target.value)}
                  />
                </div>
              </div>
              {/* Save Button */}
              <div className="form-group mb-2 text-center">
                <Button
                  className="btn btn-sm btn-success"
                  onClick={() => handleSubmit()}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
