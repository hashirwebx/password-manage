import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

userSchema.index({ organizationId: 1, email: 1 });

const User = models.User || model("User", userSchema);

export type UserDocument = mongoose.Document & {
  email: string;
  passwordHash: string;
  organizationId?: mongoose.Types.ObjectId;
  role: "owner" | "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
};

export default User as mongoose.Model<UserDocument>;