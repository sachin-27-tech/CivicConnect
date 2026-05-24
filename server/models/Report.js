const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required."],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: 1000
    },
    category: {
      type: String,
      enum: ["Road Damage", "Garbage", "Streetlight", "Water Leakage", "Other"],
      required: true
    },
    image: {
      type: String,
      required: [true, "An issue photo is required."]
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        default: ""
      }
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });
reportSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Report", reportSchema);
