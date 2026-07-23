import mongoose, { Document, Schema } from "mongoose";

export interface IOneDriveConnection extends Document {
  userId: string;

  fileId: string;

  fileName: string;

  syncEnabled: boolean;

  accessToken?: string;

  lastSync?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const OneDriveConnectionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    fileId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    syncEnabled: {
      type: Boolean,
      default: true,
    },

    accessToken: String,

    lastSync: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOneDriveConnection>(
  "OneDriveConnection",
  OneDriveConnectionSchema,
);
