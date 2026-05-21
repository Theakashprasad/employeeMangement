import { Schema, model } from "mongoose";
import { IEmployee } from "../Interface/employeeInterface";

const EmployeeSchema = new Schema<IEmployee>(
  {
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
  },
  { timestamps: true },
);

const Employee = model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
