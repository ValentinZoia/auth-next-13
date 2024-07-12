import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId | string | undefined;
  email: string;
  password: string;
  isConfirmed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IUserSchema extends Document {
  _id?: ObjectId | string | undefined;
  email: string;
  password: string;
  isConfirmed: boolean;
  created_at?: string;
  updated_at?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
