"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationMiddleware_1 = __importDefault(require("../Middlewares/authenticationMiddleware"));
const employeeController_1 = require("../Controllers/employeeController");
const router = (0, express_1.Router)();
router.use(authenticationMiddleware_1.default);
router.get("/analytics", employeeController_1.getAnalytics);
router.get("/", employeeController_1.getEmployees);
router.get("/:id", employeeController_1.getEmployeeById);
router.post("/", employeeController_1.createEmployee);
router.put("/:id", employeeController_1.updateEmployee);
router.delete("/:id", employeeController_1.deleteEmployee);
exports.default = router;
