import mongoose from "mongoose";
import { DBNAME } from "../constants.js";

const connectDB = async () => {
  try {
    const response = mongoose.connect(`${process.env.MONGO_URL}/${DBNAME}`);
    console.log(`db connected`);
  } catch (error) {
    console.log(`error connecting db`);
    process.exit(1);
  }
};

export default connectDB;
