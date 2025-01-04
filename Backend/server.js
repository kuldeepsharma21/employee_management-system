import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/dbConnect.js";
import userRouter from "./routes/routes.user.js";
import departmentRouter from "./routes/routes.department.js";
import cors from "cors";

dotenv.config({});

connectDB();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/department", departmentRouter);
// Catch-all route for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
