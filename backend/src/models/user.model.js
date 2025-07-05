import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


const { Schema, model } = mongoose;

const userSchema = new Schema({
  emailId:{
    type: String,
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  role: { 
    type: Schema.Types.ObjectId, 
    ref: "Role",
    required: true
  },
},{
  timeStamps: true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  console.log("Comparing password:", password, this.password);
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id , role: this.role}, process.env.ACCESSTOKENKEY, {
    expiresIn: "7m",
  });
};


const User = model("User", userSchema);

export default User;
