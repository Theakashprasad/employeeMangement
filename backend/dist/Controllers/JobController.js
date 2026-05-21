"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.editJob = exports.postJob = exports.getOneJob = exports.getJobs = void 0;
const jobModel_1 = __importDefault(require("../Models/jobModel"));
const getJobs = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = id;
        const jobs = await jobModel_1.default.find({ companyId }).sort({
            createdAt: -1,
        });
        // console.log('all data',jobs)
        return res.status(200).json(jobs);
    }
    catch (error) {
        console.error("Get Jobs By Company Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.getJobs = getJobs;
const getOneJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobModel_1.default.findById(id);
        console.log('data', job);
        // console.log('all data',jobs)
        return res.status(200).json(job);
    }
    catch (error) {
        console.error("Get Jobs By Company Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.getOneJob = getOneJob;
const postJob = async (req, res) => {
    try {
        // const { data } = req.body;
        const jobData = req.body;
        console.log("Incoming Job Data:", jobData);
        // Optional: attach logged-in user
        if (req.user) {
            jobData.user = req.user;
        }
        const newJob = await jobModel_1.default.create(jobData);
        console.log('DB UPDATE', newJob);
        return res.status(201).json({
            message: "Job created successfully",
            job: newJob,
        });
    }
    catch (error) {
        console.error("Post Job Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.postJob = postJob;
const editJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedJob = await jobModel_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // return updated document
            runValidators: true, // apply schema validation
        });
        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }
        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    }
    catch (error) {
        console.error("Update Job Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.editJob = editJob;
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id', id);
        const deletedJob = await jobModel_1.default.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found",
            });
        }
        return res.status(200).json({
            message: "Job deleted successfully",
            job: deletedJob,
        });
    }
    catch (error) {
        console.error("Delete Job Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.deleteJob = deleteJob;
