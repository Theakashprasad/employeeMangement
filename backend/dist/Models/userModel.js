"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    image: { type: String },
    companyName: { type: String },
    orgType: { type: String },
    industryType: { type: String },
    teamSize: { type: String },
    yearEstablished: { type: String },
    aboutUs: { type: String },
    location: { type: String },
    contactNumber: { type: String },
    logo: { type: String },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
