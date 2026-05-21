import dotenv from "dotenv";
import mongoose from "mongoose";
import Employee from "../Models/employeeModel";

dotenv.config();

const sampleEmployees = [
  {
    name: "Alicia Chen",
    email: "alicia.chen@company.com",
    department: "Engineering",
    designation: "Senior Engineer",
    status: "Active" as const,
    joiningDate: new Date("2022-01-15"),
  },
  {
    name: "Marcus Williams",
    email: "marcus.w@company.com",
    department: "Product",
    designation: "Product Manager",
    status: "Active" as const,
    joiningDate: new Date("2021-03-20"),
  },
  {
    name: "Priya Nair",
    email: "priya.nair@company.com",
    department: "Design",
    designation: "Lead Designer",
    status: "Active" as const,
    joiningDate: new Date("2022-07-10"),
  },
  {
    name: "James Okafor",
    email: "james.o@company.com",
    department: "Sales",
    designation: "Account Executive",
    status: "Active" as const,
    joiningDate: new Date("2023-11-05"),
  },
  {
    name: "Sofia Martinez",
    email: "sofia.m@company.com",
    department: "HR",
    designation: "HR Manager",
    status: "On Leave" as const,
    joiningDate: new Date("2020-02-12"),
  },
  {
    name: "Liam Tremblay",
    email: "liam.t@company.com",
    department: "Engineering",
    designation: "Backend Developer",
    status: "Active" as const,
    joiningDate: new Date("2023-09-18"),
  },
  {
    name: "Emma Johnson",
    email: "emma.j@company.com",
    department: "Marketing",
    designation: "Marketing Lead",
    status: "Inactive" as const,
    joiningDate: new Date("2024-01-08"),
  },
  {
    name: "Noah Patel",
    email: "noah.p@company.com",
    department: "Engineering",
    designation: "DevOps Engineer",
    status: "Active" as const,
    joiningDate: new Date("2024-04-22"),
  },
  {
    name: "Olivia Brown",
    email: "olivia.b@company.com",
    department: "Sales",
    designation: "Sales Director",
    status: "Active" as const,
    joiningDate: new Date("2024-06-01"),
  },
  {
    name: "Ethan Davis",
    email: "ethan.d@company.com",
    department: "Finance",
    designation: "Financial Analyst",
    status: "Active" as const,
    joiningDate: new Date("2025-01-15"),
  },
  {
    name: "Mia Wilson",
    email: "mia.w@company.com",
    department: "Design",
    designation: "UI Designer",
    status: "Active" as const,
    joiningDate: new Date("2025-02-20"),
  },
  {
    name: "Lucas Garcia",
    email: "lucas.g@company.com",
    department: "Product",
    designation: "Associate PM",
    status: "Inactive" as const,
    joiningDate: new Date("2025-03-10"),
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: process.env.MONGODB_DB_NAME || "employee_management",
  });

  const count = await Employee.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} employees. Skipping seed.`);
  } else {
    await Employee.insertMany(sampleEmployees);
    console.log(`Seeded ${sampleEmployees.length} employees.`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
