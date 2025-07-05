import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  chatName: { type: String, required: true },
  userId :{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},{timeStamps: true});

export default model("Chat", ChatSchema);
