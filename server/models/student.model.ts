import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";

const StudentSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: MediaSchema,
    },
    savedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

StudentSchema.index({ phone: 1, isActive: 1 });
StudentSchema.index({ email: 1 });

export const StudentModel = models.Student || model("Student", StudentSchema);
