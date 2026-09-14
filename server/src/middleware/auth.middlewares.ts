import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({
        message: "Authorization token is required by user",
      });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    req.user = {
      id: decoded.id as string,
      email: decoded.email as string,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
