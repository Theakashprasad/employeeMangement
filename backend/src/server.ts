import connectDB from "./Config/dbConfig";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/authRoutes";
import employeeRoutes from "./Routes/employeeRoutes";
import { seedEmployeesIfEmpty } from "./utils/seedEmployees";
import { notFoundHandler, errorHandler } from "./Middlewares/errorHandler";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
const allowedOrigins = (
  process.env.CLIENT_ORIGINS ?? "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.get("/", (_req, res) => {
  res.json({ message: "Employee Management API", status: "running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/employees", employeeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await seedEmployeesIfEmpty();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
