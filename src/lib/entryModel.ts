import mongoose, { Schema, models, model } from "mongoose";

const entrySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
     organizationId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    url: { type: String },
    notes: { type: String },
    status: { type: String, default: "Healthy" },
    risk: { type: String, default: "Low" },
  },
  { timestamps: true }
);

entrySchema.index({ organizationId: 1, updatedAt: -1 });

const Entry = models.Entry || model("Entry", entrySchema);

export default Entry as mongoose.Model<{
  name: string;
  username: string;
  organizationId?: mongoose.Types.ObjectId;
  password: string;
  url?: string;
  notes?: string;
  status?: string;
  risk?: string;
}>;
