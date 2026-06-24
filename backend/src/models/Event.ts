import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  userId: string;

  name: string;
  email: string;

  occasion: string;

  eventDate: Date;

  department?: string;

  customMessage?: string;

  status: "pending" | "approved" | "generated" | "sent" | "failed";

  source: "excel" | "onedrive";

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

    eventDate: {
      type: Date,
      required: true,
    },

    department: String,

    customMessage: String,

    status: {
      type: String,
      default: "pending",
    },

    source: {
      type: String,
      default: "excel",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEvent>("Event", EventSchema);
