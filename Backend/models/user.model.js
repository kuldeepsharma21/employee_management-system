import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, minlength: 8, maxlength: 20 },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  hobbies: { type: [String], default: [] },
  role: { type: String, enum: ["Employee", "Manager"], required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    validate: {
      validator: function () {
        return this.role === "Employee";
      },
      message: "department can be assigned to employees only",
    },
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
