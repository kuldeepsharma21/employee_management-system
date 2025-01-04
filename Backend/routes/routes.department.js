import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";
import { departmentValidation } from "../validators/department.validators.js";

const router = express.Router();

router.post("/create-department", departmentValidation, createDepartment);
router.get("/get-department", getAllDepartments);
router.patch("/update-department", updateDepartment);
router.delete("/delete-department", deleteDepartment);

export default router;
