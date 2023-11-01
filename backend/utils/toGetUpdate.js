import axios from "axios";

// Get customer list
export const getBotIdToken = async () => {
  // Get bot id and token from db
  const response = await axios
    .get("http://localhost:3030/chat-id")
    .catch((error) => {
      console.error("Error to get bot id and token!", error);
    });

  return response.data;
};

export const getParentList = async () => {
  const response = await axios
    .get("http://localhost:3030/parent")
    .catch((error) => {
      console.error("Error to get parent list!", error);
    });

  return response.data["data"];
};

// Get child list by parent id
export const getChildList = async (parentId) => {
  const response = await axios
    .get(`http://localhost:3030/child/parent_id/${parentId}`)
    .catch((error) => {
      console.error("Error to get child list!", error);
    });

  return response.data["data"];
};

// Update child by id
export const updateChild = async (child) => {
  try {
    await axios.put(`http://localhost:3030/child/${child.id}`, child);
  } catch (error) {
    console.error("Error to update child!", error);
  }
};

// Get bot state
export const getBotState = async () => {
  const response = await axios
    .get("http://localhost:3030/bot-state")
    .catch((error) => {
      console.error("Error to get bot state!", error);
    });
  return response.data["bot_is_start"];
};

export const changeBotState = async (botState) => {
  axios
    .post("http://localhost:3030/bot-state", { bot_is_start: botState })
    .catch((error) => {
      console.error("Error to change bot state!", error);
    });
};

// Get timeout from db
export const getTimeout = async () => {
  const response = await axios
    .get("http://localhost:3030/timeout")
    .catch((error) => {
      console.error("Error to get timeout!", error);
    });
  return response.data["timeout_sec"];
};

// Get time
export const getDateTime = () => {
  // Create a new Date object to represent the current date and time
  const currentTime = new Date();

  // Get the current date components (month and day)
  const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Add 1 to the month because it's zero-based
  const day = String(currentTime.getDate()).padStart(2, "0");

  // Get the current time components (hours and minutes)
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");

  // Format the date and time as a string (e.g., "MM/DD HH:mm")
  const formattedTime = `${month}/${day}(${hours}:${minutes})`;

  return formattedTime;
};

export const getTime = () => {
  // Log time (only time)
  const currentTime = new Date();
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

// Get start_time and stop_time by /schedule api
export const getScheduleTime = async () => {
  const response = await axios
    .get("http://localhost:3030/schedule")
    .catch((error) => {
      console.error("Error to get schedule time!", error);
    });

  return response.data.data;
};

export const getCurrentTime = () => {
  const now = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
  });

  return now;
};

export const getReqTimeout = async () => {
  const response = await axios
    .get("http://localhost:3030/req-timeout")
    .catch((error) => {
      console.error("Error to get req timeout!", error);
    });

  return response.data["req_timeout_sec"];
};
