import axios from "axios";

import { appendFile } from "fs/promises";
async function appendToFile(fileName, data) {
  try {
    await appendFile(fileName, data, { flag: "a" });
  } catch (error) {
    console.error(`Got an error trying to append the file: {error.message}`);
  }
}
export const getEvents = (req, res, next) => {};
export const postEvent = (req, res, next) => {
  const event = req.body;
  const { type, data } = event;
  let expression;
  if (type == "usageUpdatedAtMidnight") {
    expression = `the daily usage limit updated for all users at midnight\n`;
  } else {
    expression =  `the user with userId: ${data.userId} has triggerd this event: ${type}\n`;
  }
  
  appendToFile("./logging.txt", expression);
  axios.post("http://images-management-srv:4001/api/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://storage-management-srv:4002/api/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://usage-management-srv:4003/api/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://query-service-srv:4005/api/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
};
