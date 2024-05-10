import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";
import dotenv from "dotenv"
dotenv.config();

const router = express.Router();
// const maxAge = 60;
const secretKey = "aman";


function generateToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    secretKey,
    {
      expiresIn: '1m',
    }
  );
}


router.post("/register", async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      console.log(req.body, ";liuyf")
      const user = await UserModel.findOne({ email });
      // console.log(user,"lgfcugv")

      if (user) {
        return res.json({
          message: "User Already Exist!",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      
      res.json({
        message: "User registered",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });
  
  

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
    
      if (!user) {
        return res.json({
          message: "User does not Exist",
        });
      }
    
      const hPassword = await bcrypt.compare(password, user.password);
      if (!hPassword) {
        return res.json({
          message: "Wrong Password",
        });
      }
    
      const token = generateToken(user._id);
    
      res.json({message:"Login successful",
        token,
        userID: user._id,
        email: user.email
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });
  
  
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secretKey, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { router as userRouter };