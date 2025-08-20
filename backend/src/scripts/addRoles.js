import mongoose from 'mongoose';
import Role from "../models/role.model.js";
import { DBNAME } from "../constants.js";
import dotenv from 'dotenv';

dotenv.config();    

async function addRoles() {
  const MONGO_URL = `mongodb+srv://igauravgupta:XW8neptUb0YJR719@cluster0.q3oxndr.mongodb.net/${DBNAME}`;
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
  }
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const roles = [
    { roleName: 'USER', permissions: [], description: 'Standard user role' },
    { roleName: 'Admin', permissions: [], description: 'Administrator role' }
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ roleName: role.roleName });
    if (!exists) {
      await Role.create(role);
      console.log(`Role "${role.name}" added.`);
    } else {
      console.log(`Role "${role.name}" already exists.`);
    }
  }

  await mongoose.disconnect();
}

addRoles().catch(err => {
  console.error(err);
  process.exit(1);
});