import express from "express";
import { getAllusers, getEmployeeDetails, login, signup } from "../controllers/user.controller.js";
import {
  loginValidation,
  signUpValidation,
} from "../validators/user.validators.js";


const router = express.Router();

router.post("/signup", signUpValidation, signup);
router.post("/login", loginValidation, login);
router.get("/get-all-users", getAllusers);
router.get("/employee", getEmployeeDetails);

export default router;
