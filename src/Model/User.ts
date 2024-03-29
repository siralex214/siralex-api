import mongoose, { Schema } from "mongoose";
import { APP } from "../config/default";
import bcrypt from "bcrypt";
import Log from "../utils/Log";
import { role } from "../types/role";
import { generateKey } from "../utils/generateStreamKey";

export interface UserDocument extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  role: role;
  password: string;
  streamKey: string;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  role: Number,
  password: String,
  streamKey: String,
  createdAt: Date,
  updatedAt: Date,
  deactivatedAt: Boolean,
});

UserSchema.pre<UserDocument>("save", async function (next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(APP.saltWorkFactor);

  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  this.streamKey = generateKey();
  user.role = role.user;
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  user.deactivatedAt = false;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;
  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch((e: Error) => Log.error(e));
};

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
