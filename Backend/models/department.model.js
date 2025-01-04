import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  categoryName: {
    type: String,
    enum: {
      values: ["HR", "IT", "Sales", "Product", "Marketing"],
      message:
        "{VALUE} is not a valid category. Allowed categories are HR, IT, Sales, Product, and Marketing.",
    },
    required: true,
  },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Department", departmentSchema);
