"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const employeeModel_1 = __importDefault(require("../Models/employeeModel"));
dotenv_1.default.config();
const sampleEmployees = [
    {
        name: "Alicia Chen",
        email: "alicia.chen@company.com",
        department: "Engineering",
        designation: "Senior Engineer",
        status: "Active",
        joiningDate: new Date("2022-01-15"),
    },
    {
        name: "Marcus Williams",
        email: "marcus.w@company.com",
        department: "Product",
        designation: "Product Manager",
        status: "Active",
        joiningDate: new Date("2021-03-20"),
    },
    {
        name: "Priya Nair",
        email: "priya.nair@company.com",
        department: "Design",
        designation: "Lead Designer",
        status: "Active",
        joiningDate: new Date("2022-07-10"),
    },
    {
        name: "James Okafor",
        email: "james.o@company.com",
        department: "Sales",
        designation: "Account Executive",
        status: "Active",
        joiningDate: new Date("2023-11-05"),
    },
    {
        name: "Sofia Martinez",
        email: "sofia.m@company.com",
        department: "HR",
        designation: "HR Manager",
        status: "On Leave",
        joiningDate: new Date("2020-02-12"),
    },
    {
        name: "Liam Tremblay",
        email: "liam.t@company.com",
        department: "Engineering",
        designation: "Backend Developer",
        status: "Active",
        joiningDate: new Date("2023-09-18"),
    },
    {
        name: "Emma Johnson",
        email: "emma.j@company.com",
        department: "Marketing",
        designation: "Marketing Lead",
        status: "Inactive",
        joiningDate: new Date("2024-01-08"),
    },
    {
        name: "Noah Patel",
        email: "noah.p@company.com",
        department: "Engineering",
        designation: "DevOps Engineer",
        status: "Active",
        joiningDate: new Date("2024-04-22"),
    },
    {
        name: "Olivia Brown",
        email: "olivia.b@company.com",
        department: "Sales",
        designation: "Sales Director",
        status: "Active",
        joiningDate: new Date("2024-06-01"),
    },
    {
        name: "Ethan Davis",
        email: "ethan.d@company.com",
        department: "Finance",
        designation: "Financial Analyst",
        status: "Active",
        joiningDate: new Date("2025-01-15"),
    },
    {
        name: "Mia Wilson",
        email: "mia.w@company.com",
        department: "Design",
        designation: "UI Designer",
        status: "Active",
        joiningDate: new Date("2025-02-20"),
    },
    {
        name: "Lucas Garcia",
        email: "lucas.g@company.com",
        department: "Product",
        designation: "Associate PM",
        status: "Inactive",
        joiningDate: new Date("2025-03-10"),
    },
];
async function seed() {
    await mongoose_1.default.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || "employee_management",
    });
    const count = await employeeModel_1.default.countDocuments();
    if (count > 0) {
        console.log(`Database already has ${count} employees. Skipping seed.`);
    }
    else {
        await employeeModel_1.default.insertMany(sampleEmployees);
        console.log(`Seeded ${sampleEmployees.length} employees.`);
    }
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
