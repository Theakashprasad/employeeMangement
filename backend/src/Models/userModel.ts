import { Schema, model } from "mongoose";
import { IUser } from "../Interface/userInterface";

const UserSchema = new Schema<IUser>({
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

const User = model<IUser>("User", UserSchema);

export default User;
