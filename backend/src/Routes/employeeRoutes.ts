import { Router } from "express";
import authenticationMiddleware from "../Middlewares/authenticationMiddleware";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
} from "../Controllers/employeeController";

const router = Router();

router.use(authenticationMiddleware);

router.get("/analytics", getAnalytics);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
