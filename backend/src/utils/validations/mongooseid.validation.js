import mongoose from "mongoose";

const validateId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export { validateId };
