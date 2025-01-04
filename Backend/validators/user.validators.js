import { body } from "express-validator";

export const signUpValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("email is required"),
  body("gender").notEmpty().withMessage("gender is required"),
  body("hobbies").isArray().withMessage("Employees should be an array"),
  body("role").notEmpty().withMessage("role is required"),
];

export const loginValidation = [
  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("email is required"),
];
