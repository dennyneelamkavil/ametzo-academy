import "server-only";
import { Schema, model, models } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      index: true,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      index: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
    accessExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    lifetimeAccess: {
      type: Boolean,
      default: false,
      index: true,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    lastAccessedLesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    lastActivityAt: {
      type: Date,
      index: true,
    },
    pricing: {
      currency: {
        type: String,
        default: "INR",
      },
      originalPrice: Number,
      pricePaid: Number,
      discountAmount: Number,
      couponCode: String,
    },
    payment: {
      provider: String,
      paymentId: String,
      orderId: String,
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "paid",
        index: true,
      },
      paidAt: Date,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  { timestamps: true },
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const EnrollmentModel =
  models.Enrollment || model("Enrollment", EnrollmentSchema);
