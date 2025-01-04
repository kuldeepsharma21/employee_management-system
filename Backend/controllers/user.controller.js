import { validationResult } from "express-validator";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { firstName, lastName, email, password, gender, hobbies, role } =
      req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      gender,
      hobbies,
      role,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Registration Completed Successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      _id:user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      gender: user.gender,
      hobbies: user.hobbies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllusers = async (req, res) => {
  try {
    const users = await User.find({ role: "Employee" }, "_id firstName lastName email role");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};


export const getEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Employee id is required" });
    }

    const employee = await User.findById(id)
      .select("-password")
      .populate("department", "departmentName categoryName location salary");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error fetching employee details", error });
  }
};