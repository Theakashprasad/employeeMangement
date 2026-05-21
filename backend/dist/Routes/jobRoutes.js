"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import upload from "../Middlewares/uploadMiddleware";
const JobController = require("../Controllers/jobController");
const router = (0, express_1.Router)();
router.get("/:id", 
// authenticationMiddleware,
JobController.getJobs);
router.get("/viewOne/:id", 
// authenticationMiddleware,
JobController.getOneJob);
router.post("/", 
// authenticationMiddleware,
JobController.postJob);
router.put("/:id", 
// authenticationMiddleware,
JobController.editJob);
router.delete("/:id", 
// authenticationMiddleware,
JobController.deleteJob);
exports.default = router;
