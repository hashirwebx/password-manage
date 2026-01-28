import mongoose, { Schema, model, models } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

// organizationSchema.index({ ownerId: 1 });
organizationSchema.index({ name: 1 });

const Organization = models.Organization || model("Organization", organizationSchema);

export type OrganizationDocument = mongoose.Document & {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export default Organization as mongoose.Model<OrganizationDocument>;
