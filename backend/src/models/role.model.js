import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RoleSchema = new Schema({
  roleName: { type: String, required: true },
  permissions: [{ type: String }],
  description: { type: String },
});

export default model("Role", RoleSchema);
