import mongoose, { Schema, model, models } from "mongoose";

const shareSchema = new Schema(
  {
    entryId: { type: Schema.Types.ObjectId, ref: "Entry", required: true, index: true },
    fromUserId: { type: String, required: true, index: true },
    fromEmail: { type: String, required: true },
    toUserId: { type: String, required: true, index: true },
    toEmail: { type: String, required: true },
    permissions: {
      type: String,
      enum: ["read"],
      default: "read",
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

shareSchema.index({ entryId: 1, toUserId: 1 }, { unique: true });

const Share = models.Share || model("Share", shareSchema);

export default Share as mongoose.Model<{
  entryId: mongoose.Types.ObjectId;
  fromUserId: string;
  fromEmail: string;
  toUserId: string;
  toEmail: string;
  permissions: "read";
  status: "active" | "revoked";
}>;
