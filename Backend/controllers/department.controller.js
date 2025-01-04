import { validationResult } from "express-validator";
import Department from "../models/department.model.js";
import User from "../models/user.model.js";

export const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { departmentName, categoryName, location, salary, employees } =
    req.body;

  try {
    const newDepartment = new Department({
      departmentName,
      categoryName,
      location,
      salary,
      employees: employees,
    });

    const savedDepartment = await newDepartment.save();

    // Update users with department reference
    await User.updateMany(
      { _id: { $in: employees } },
      { $set: { department: savedDepartment._id } }
    );

    res.status(201).json({
      message: "Department created successfully!",
      department: savedDepartment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error });
  }
};

export const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.query;
  const { departmentName, categoryName, location, salary, employees } =
    req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        departmentName,
        categoryName,
        location,
        salary,
        employees,
      },
      { new: true }
    ).populate("employees", "-password");

    console.log(req.query);

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Department id is required" });
  }

  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error });
  }
};

export const getAllDepartments = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const category = req.query.category || "";
      const location = req.query.location || "";

      const sortColumn = req.query.sortColumn || "employees";
      const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
  
      const filter = {};
  
      if (category) {
        filter.categoryName = { $regex: category, $options: "i" }; // Case-insensitive match
      }
  
      if (location) {
        filter.location = { $regex: location, $options: "i" }; // Case-insensitive match
      }

      const sortOptions = {};
      sortOptions[sortColumn] = sortDirection;
  
      const departments = await Department.find(filter)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "employees",
          select: "-password", // Exclude password field from employee data
        })
        .sort(sortOptions);
  
      const totalDepartments = await Department.countDocuments(filter);
  
      const totalPages = Math.ceil(totalDepartments / limit);
  
      res.status(200).json({
        departments,
        pagination: {
          currentPage: page,
          totalPages,
          totalDepartments,
          limit,
        },
      });
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ message: "Error fetching departments", error });
    }
  };
  


