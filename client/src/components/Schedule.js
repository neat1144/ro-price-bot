import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
  const [formValues, setFormValues] = useState({
    is_scheduled: "0",
    start_time: "00:00",
    stop_time: "00:00",
  });

  const fetchScheduleTime = async () => {
    axios
      .get("http://localhost:3030/schedule")
      .then((response) => {
        console.log(response.data);

        setScheduleData(response.data.data);

        if (response.data.data.length > 0) {
          setSelectedScheduleIndex(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchScheduleTime();
  }, []);

  const handleScheduleChange = (index) => {
    setSelectedScheduleIndex(index);
    const selectedSchedule = scheduleData[index];
    setFormValues({
      is_scheduled: selectedSchedule.is_scheduled,
      start_time: selectedSchedule.start_time,
      stop_time: selectedSchedule.stop_time,
    });
  };

  const handleFormChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    const selectedSchedule = scheduleData[selectedScheduleIndex];
    axios
      .post("http://localhost:3030/schedule", {
        id: selectedSchedule.id,
        ...formValues,
      })
      .then((response) => {
        alert("Schedule saved successfully!");
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
            <div className="col-12 mb-2">
              <select
                className="form-control"
                value={selectedScheduleIndex}
                onChange={(e) => handleScheduleChange(e.target.value)}
              >
                {scheduleData.map((schedule, index) => (
                  <option key={schedule.id} value={index}>
                    Schedule {index + 1}
                  </option>
                ))}
              </select>
            </div>
            {selectedScheduleIndex !== null && (
              <form className="border rounded p-4 shadow">
                <div className="form-group mb-2">
                  {/* Status */}
                  <div className="col-12 mb-2">
                    <label htmlFor="is_scheduled">狀態: </label>
                    <select
                      className="form-control"
                      value={formValues.is_scheduled}
                      onChange={(e) =>
                        handleFormChange("is_scheduled", e.target.value)
                      }
                    >
                      <option value="0">停用</option>
                      <option value="1">啟用</option>
                    </select>
                  </div>
                  {/* Start time */}
                  <div className="col-12 mb-2">
                    <label htmlFor="start_time">Start Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formValues.start_time}
                      onChange={(e) =>
                        handleFormChange("start_time", e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* Stop time */}
                <div className="form-group mb-2">
                  <div className="col-12">
                    <label htmlFor="stop_time">Stop Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formValues.stop_time}
                      onChange={(e) =>
                        handleFormChange("stop_time", e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* Button */}
                <div className="form-group mb-2 text-center">
                  <Button
                    className="btn btn-sm btn-success"
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
