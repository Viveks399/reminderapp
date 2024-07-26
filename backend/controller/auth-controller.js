import User from "../models/user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in the name and email and password" });
    }

    const hash = bcrypt.hashSync(req.body.password, 5);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    console.log("error - ", err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Found, Please Register" });
    }
    let isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
      return res.status(404).json({ message: "Invalid Password" });
    } else {
      res.status(200).json({
        message: "Login Successful",
        userData: {
          name: user.name,
          email: user.email,
          id: user._id,
          profileImage: user.profileImage,
        },
      });
    }
  } catch (err) {
    console.log("error", err);
  }
};
