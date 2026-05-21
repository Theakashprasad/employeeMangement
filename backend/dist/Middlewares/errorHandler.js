"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};
exports.errorHandler = errorHandler;
