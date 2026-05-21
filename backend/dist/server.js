"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("./Config/dbConfig"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const employeeRoutes_1 = __importDefault(require("./Routes/employeeRoutes"));
const seedEmployees_1 = require("./utils/seedEmployees");
const errorHandler_1 = require("./Middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGINS ?? "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
app.get("/", (_req, res) => {
    res.json({ message: "Employee Management API", status: "running" });
});
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "API is healthy" });
});
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/employees", employeeRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, dbConfig_1.default)();
        await (0, seedEmployees_1.seedEmployeesIfEmpty)();
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
