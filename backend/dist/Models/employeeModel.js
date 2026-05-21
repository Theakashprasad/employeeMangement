"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EmployeeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    department: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["Active", "Inactive", "On Leave"],
        default: "Active",
    },
    joiningDate: { type: Date, required: true },
}, { timestamps: true });
const Employee = (0, mongoose_1.model)("Employee", EmployeeSchema);
exports.default = Employee;
