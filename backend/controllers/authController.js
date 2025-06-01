// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(
      `[ERROR] Register User - Username: ${req.body?.username}, Error: ${err.message}`,
      err.stack
    );
    res
      .status(500)
      .json({ message: "Failed to register user. Please try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "[CRITICAL_ERROR] Login: JWT_SECRET is not defined in .env!"
      );
      return res.status(500).json({
        message: "Server configuration error. Please contact support.",
      });
    }

    const tokenPayload = { id: user._id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
    });
  } catch (err) {
    console.error(
      `[ERROR] Login User - Username: ${req.body?.username}, Error: ${err.message}`,
      err.stack
    );
    res
      .status(500)
      .json({ message: "Failed to login. Please try again later." });
  }
};
