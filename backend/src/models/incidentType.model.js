import mongoose from "mongoose";

const { Schema, model } = mongoose;

const IncidentTypeSchema = new Schema({
  IncidentType: {
     type: String, 
     required: true 
    },
  description: { 
    type: String 
  },
});

export default model("IncidentType", IncidentTypeSchema);
