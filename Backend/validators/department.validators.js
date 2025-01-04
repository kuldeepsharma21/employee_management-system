import { body } from "express-validator";

export const departmentValidation = [
  body("departmentName").notEmpty().withMessage("Department name is required"),
  body("categoryName").notEmpty().withMessage("category name is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("salary").notEmpty().withMessage("Salary is required"),
  body("employees").isArray().withMessage("Employees should be an array"),
];
