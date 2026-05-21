"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;
exports.sanitizeUser = sanitizeUser;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateSignup(body) {
    if (!body.firstName?.trim())
        return "First name is required";
    if (!body.lastName?.trim())
        return "Last name is required";
    if (!body.email?.trim())
        return "Email is required";
    if (!EMAIL_REGEX.test(body.email.trim()))
        return "Invalid email address";
    if (!body.password)
        return "Password is required";
    if (body.password.length < 6)
        return "Password must be at least 6 characters";
    return null;
}
function validateLogin(body) {
    if (!body.email?.trim())
        return "Email is required";
    if (!EMAIL_REGEX.test(body.email.trim()))
        return "Invalid email address";
    if (!body.password)
        return "Password is required";
    return null;
}
function sanitizeUser(user) {
    const { password, __v, ...safe } = user;
    return {
        ...safe,
        _id: String(safe._id ?? ""),
    };
}
