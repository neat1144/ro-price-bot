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

export const setHeaders = () => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",

    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language":
      "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-CN;q=0.5",
    Dnt: "1",
    // Host: "httpbin.org",
    Referer:
      "https://event.gnjoy.com.tw/Ro/RoShopSearch?fbclid=IwAR1xC46Qfmpbv0RzjG2t7LpJp19ZUKNnpBDL0QLKNfAbzScZYgU_Sl9C04Q",
    "Sec-Ch-Ua":
      '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    // "Sec-Fetch-User": "?1",
    // "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60",
    // "X-Amzn-Trace-Id": "Root=1-65267ecd-1956ffae7713148b3b9305fa",
    "x-request-with": "XMLHttpRequest",
  };

  return headers;
};

// Get start_time and stop_time by /schedule api
export const getScheduleTime = async () => {
  const response = await axios
    .get("http://localhost:3030/schedule")
    .catch((error) => {
      console.error("Error to get schedule time!", error);
    });

  return response.data;
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
