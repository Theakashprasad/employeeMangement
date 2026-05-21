"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    companyId: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    fullyRemote: { type: Boolean, default: false },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    salaryType: {
        type: String,
        enum: ["Yearly", "Monthly", "Hourly"],
    },
    description: { type: String, required: true },
    tags: { type: String },
    jobRole: { type: String },
    educationLevel: { type: String },
    experienceLevel: { type: String },
    jobType: { type: String },
    jobLevel: { type: String },
    expirationDate: { type: Date },
}, {
    timestamps: true, // adds createdAt & updatedAt automatically
});
const Job = (0, mongoose_1.model)("Job", JobSchema);
exports.default = Job;
