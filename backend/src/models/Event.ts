import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  userId: string;

  name: string;
  email: string;

  occasion: string;

  eventDate: Date;

  eventMonth: number;

  eventDay: number;

  department: string;

  customMessage?: string;

  status:
    | "pending"
    | "generating"
    | "generated"
    | "sending"
    | "sent"
    | "failed";

  source: "excel" | "onedrive";

  photoUrl: string;

  generatedWishImage: string;

  generatedWishText?: string;

  generatedAt: Date;

  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    occasion: {
      type: String,
      required: true,
    },

    photoUrl: {
      type: String,
      default: "",
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventMonth: {
      type: Number,
      required: true,
    },

    eventDay: {
      type: Number,
      required: true,
    },

    department: String,

    customMessage: String,

    status: {
      type: String,
      enum: ["pending", "generating", "generated", "sending", "sent", "failed"],
      default: "pending",
    },

    source: {
      type: String,
      default: "excel",
    },
    generatedWishImage: {
      type: String,
      default: "",
    },

    generatedWishText: {
      type: String,
      default: "",
    },

    generatedAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEvent>("Event", EventSchema);
