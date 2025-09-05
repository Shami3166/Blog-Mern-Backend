import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  user: Schema.Types.ObjectId; // Reference to logged-in user
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
