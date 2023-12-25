import bcryptjs from "bcryptjs";
import User from "../modal/user.modal.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import axios from "axios";
export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    // console.log();
    const event = {
      type: "userCreated",
      data: {
        userId: newUser._id.toString(),
        username: newUser.username,
      },
    };
    axios.post("http://localhost:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...user } = validUser._doc;
    const event = {
      type: "userLoggedIn",
      data: {
        userId: validUser._id.toString(),
        username: validUser.username,
      },
    };
    axios.post("http://localhost:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      validUser,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res, next) => {
  try {
    // Clear the cookie by setting it to an empty value and expiring it
    res.cookie("access_token", "", { expires: new Date(0), httpOnly: true });

    // You might also want to perform additional cleanup or logging here

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
