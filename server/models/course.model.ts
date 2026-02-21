import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";
import { SeoSchema } from "@/server/seo/seo.schema";

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    durationHours: Number,
    totalLessons: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: MediaSchema,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    seo: {
      type: SeoSchema,
    },
  },
  { timestamps: true },
);

export const CourseModel = models.Course || model("Course", CourseSchema);
