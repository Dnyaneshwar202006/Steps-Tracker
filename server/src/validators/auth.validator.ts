import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name cant be empty"),
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password length should be minimum of 6 characters"),
];
