import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
    url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure related models are imported when this model is used
if (mongoose.models.Image) {
  // Image model already exists
} else {
  require("./Image")
}

if (mongoose.models.Category) {
  // Category model already exists
} else {
  require("./Category")
}

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema)
