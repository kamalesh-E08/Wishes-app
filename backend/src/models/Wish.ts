import mongoose from "mongoose";

const WishSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    occasion: {
      type: String,
      required: true,
    },

    theme: {
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
