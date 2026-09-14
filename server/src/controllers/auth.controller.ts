import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered to the app successfully",
      result,
    });
  } catch (error) {
    console.error("User did not register failed: ", error);

    return res.status(500).json({
      message: "Internal Server Error occurred",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: "Login Successful",
      result,
    });
  } catch (error) {
    console.error("User Login failed: ", error);

    return res.status(401).json({
        message: "Invalid Email or Password",
    });
  };
};
