import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatDetailsSchema = new Schema({
  chatId:{
    type: Schema.Types.ObjectId,
    ref: "Chat"
  },
  req:{
    type: String,
    required: true
  },
  res:{
    type: String,
    required: true
  }
},{timeStamps: true});

export default model("ChatDetails", chatDetailsSchema);
