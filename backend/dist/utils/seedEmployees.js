"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEmployeesIfEmpty = void 0;
const employeeModel_1 = __importDefault(require("../Models/employeeModel"));
const SEED_DATA = [
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
        email: "marcus.williams@company.com",
        department: "Product",
        designation: "Product Manager",
        status: "Active",
        joiningDate: new Date("2021-03-10"),
    },
    {
        name: "Priya Nair",
        email: "priya.nair@company.com",
        department: "Design",
        designation: "Lead Designer",
        status: "Active",
        joiningDate: new Date("2022-07-22"),
    },
    {
        name: "James Okafor",
        email: "james.okafor@company.com",
        department: "Sales",
        designation: "Account Executive",
        status: "Active",
        joiningDate: new Date("2023-11-05"),
    },
    {
        name: "Sofia Martinez",
        email: "sofia.martinez@company.com",
        department: "HR & Ops",
        designation: "HR Manager",
        status: "On Leave",
        joiningDate: new Date("2020-02-18"),
    },
    {
        name: "Liam Tremblay",
        email: "liam.tremblay@company.com",
        department: "Engineering",
        designation: "Backend Developer",
        status: "Active",
        joiningDate: new Date("2023-09-12"),
    },
    {
        name: "Emma Johnson",
        email: "emma.johnson@company.com",
        department: "Marketing",
        designation: "Marketing Lead",
        status: "Active",
        joiningDate: new Date("2024-01-08"),
    },
    {
        name: "David Park",
        email: "david.park@company.com",
        department: "Engineering",
        designation: "DevOps Engineer",
        status: "Inactive",
        joiningDate: new Date("2021-11-30"),
    },
    {
        name: "Rachel Green",
        email: "rachel.green@company.com",
        department: "Sales",
        designation: "Sales Director",
        status: "Active",
        joiningDate: new Date("2019-06-14"),
    },
    {
        name: "Omar Hassan",
        email: "omar.hassan@company.com",
        department: "Product",
        designation: "Product Analyst",
        status: "Active",
        joiningDate: new Date("2024-04-20"),
    },
    {
        name: "Lisa Wong",
        email: "lisa.wong@company.com",
        department: "Design",
        designation: "UI Designer",
        status: "Active",
        joiningDate: new Date("2024-02-14"),
    },
    {
        name: "Tom Bradley",
        email: "tom.bradley@company.com",
        department: "Marketing",
        designation: "Content Strategist",
        status: "Inactive",
        joiningDate: new Date("2022-08-03"),
    },
];
const seedEmployeesIfEmpty = async () => {
    try {
        const count = await employeeModel_1.default.countDocuments();
        if (count === 0) {
            await employeeModel_1.default.insertMany(SEED_DATA);
            console.log(`Seeded ${SEED_DATA.length} employees`);
        }
    }
    catch (error) {
        console.error("Seed error:", error);
    }
};
exports.seedEmployeesIfEmpty = seedEmployeesIfEmpty;
