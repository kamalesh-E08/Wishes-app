import mongoose from "mongoose";

const WishSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },

    occasion: {
      type: String,
      required: true,
    },

    theme: {
      type: String,
      required: true,
    },

    uploadedImage: {
      type: String,
      required: true,
    },

    generatedImage: {
      type: String,
      required: true,
    },

    people: [
      {
        type: String,
      },
    ],

    decorations: [
      {
        type: String,
      },
    ],

    customMessage: {
      type: String,
    },

    animationEnabled: {
      type: Boolean,
      default: false,
    },

    aiProvider: {
      type: String,
      default: "Gemini",
    },

    prompt: {
      type: String,
    },

    downloads: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Wish", WishSchema);
