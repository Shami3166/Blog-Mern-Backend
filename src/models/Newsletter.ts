import mongoose, { Document, Schema } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  createdAt: Date;
}

const newsletterSchema: Schema<INewsletter> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model<INewsletter>("Newsletter", newsletterSchema);
export default Newsletter;
