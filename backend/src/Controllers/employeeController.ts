import { Response } from "express";
import Employee from "../Models/employeeModel";
import { CustomRequest } from "../Middlewares/authenticationMiddleware";

const sanitizeEmployee = (doc: object) => {
  const obj = doc as Record<string, unknown>;
  const { __v, password, ...rest } = obj;
  return rest;
};

export const getEmployees = async (req: CustomRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(String(req.query.limit ?? "10"), 10) || 10),
    );
    const search = String(req.query.search ?? "").trim();
    const department = String(req.query.department ?? "").trim();
    const status = String(req.query.status ?? "").trim();

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department && department !== "All") {
      filter.department = department;
    }
    if (status && status !== "All") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Employee.countDocuments(filter),
    ]);

    return res.status(200).json({
      employees: employees.map(sanitizeEmployee),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("getEmployees error:", error);
    return res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export const getEmployeeById = async (req: CustomRequest, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json(sanitizeEmployee(employee));
  } catch (error) {
    console.error("getEmployeeById error:", error);
    return res.status(500).json({ message: "Failed to fetch employee" });
  }
};

export const createEmployee = async (req: CustomRequest, res: Response) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    if (!name?.trim() || !email?.trim() || !department?.trim() || !designation?.trim()) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existing = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Employee with this email already exists" });
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      designation: designation.trim(),
      status: status ?? "Active",
      joiningDate: new Date(joiningDate),
    });

    return res.status(201).json(sanitizeEmployee(employee.toObject()));
  } catch (error) {
    console.error("createEmployee error:", error);
    return res.status(500).json({ message: "Failed to create employee" });
  }
};

export const updateEmployee = async (req: CustomRequest, res: Response) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (email && email.trim().toLowerCase() !== employee.email) {
      const duplicate = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: employee._id },
      });
      if (duplicate) {
        return res.status(409).json({ message: "Email already in use" });
      }
      employee.email = email.trim().toLowerCase();
    }

    if (name) employee.name = name.trim();
    if (department) employee.department = department.trim();
    if (designation) employee.designation = designation.trim();
    if (status) employee.status = status;
    if (joiningDate) employee.joiningDate = new Date(joiningDate);

    await employee.save();
    return res.status(200).json(sanitizeEmployee(employee.toObject()));
  } catch (error) {
    console.error("updateEmployee error:", error);
    return res.status(500).json({ message: "Failed to update employee" });
  }
};

export const deleteEmployee = async (req: CustomRequest, res: Response) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("deleteEmployee error:", error);
    return res.status(500).json({ message: "Failed to delete employee" });
  }
};

export const getAnalytics = async (_req: CustomRequest, res: Response) => {
  try {
    const [totalEmployees, activeEmployees, departmentWise, statusDistribution, monthlyJoined] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ status: "Active" }),
        Employee.aggregate([
          { $group: { _id: "$department", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 0, department: "$_id", count: 1 } },
        ]),
        Employee.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, status: "$_id", count: 1 } },
        ]),
        Employee.aggregate([
          {
            $group: {
              _id: {
                year: { $year: "$joiningDate" },
                month: { $month: "$joiningDate" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              count: 1,
              label: {
                $concat: [
                  {
                    $arrayElemAt: [
                      [
                        "",
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      "$_id.month",
                    ],
                  },
                  " ",
                  { $toString: "$_id.year" },
                ],
              },
            },
          },
        ]),
      ]);

    return res.status(200).json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      departmentWise,
      statusDistribution,
      monthlyJoined,
    });
  } catch (error) {
    console.error("getAnalytics error:", error);
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
