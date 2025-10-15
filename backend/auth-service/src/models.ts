import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {
  email: string;
  password: string;
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
