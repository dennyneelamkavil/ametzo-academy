import "server-only";
import { Schema, model, models } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";

const LessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    videoUrl: {
      type: MediaSchema,
      required: true,
    },
    durationMinutes: Number,
    order: Number,
  },
  { timestamps: true },
);

LessonSchema.index({ course: 1, order: 1 });

export const LessonModel = models.Lesson || model("Lesson", LessonSchema);
