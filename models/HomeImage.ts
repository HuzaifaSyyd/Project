import mongoose from "mongoose"

const HomeImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "hero", "gallery"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure the Image model is imported when this model is used
if (mongoose.models.Image) {
  // Image model already exists, no need to re-import
} else {
  // Import Image model to ensure it's registered
  require("./Image")
}

export default mongoose.models.HomeImage || mongoose.model("HomeImage", HomeImageSchema)
