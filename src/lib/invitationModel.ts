import mongoose, { Schema, model, models } from "mongoose";

const invitationSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
      index: true,
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitedByEmail: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

invitationSchema.index({ organizationId: 1, email: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "pending" } });

const Invitation = models.Invitation || model("Invitation", invitationSchema);

export type InvitationDocument = mongoose.Document & {
  organizationId: mongoose.Types.ObjectId;
  email: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "declined" | "expired";
  invitedBy: mongoose.Types.ObjectId;
  invitedByEmail: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Invitation as mongoose.Model<InvitationDocument>;
