import mongoose from "mongoose";


const { Schema, model } = mongoose;

const IncidentReportingSchema = new Schema({
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Open", "Closed"],
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  reportedAt: { 
    type: Date, 
    default: Date.now 
  },
  resolvedAt: { 
    type: Date 
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true
  },
  incidentType: { 
    type: Schema.Types.ObjectId, 
    ref: "IncidentType"
   },
  reportedBy: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
});

export default model("IncidentReporting", IncidentReportingSchema);
