export const eventHandler = (req, res, next) => {
  const event = req.body;
  console.log(event);
  res.status(201).json({ message: "event recieved" });
};
