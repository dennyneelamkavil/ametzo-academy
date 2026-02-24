import type { CourseBase } from "./course";
import type { StudentBase } from "./student";
import type { LessonBase } from "./lesson";

export interface EnrollmentBase {
  id: string;
}

/**
 * Full enrollment model
 */
export interface Enrollment extends EnrollmentBase {
  student: StudentBase;
  course: CourseBase;

  status: "active" | "completed" | "cancelled";

  accessExpiresAt: string;
  lifetimeAccess: boolean;

  progressPercent: number;

  completedLessons?: LessonBase[];

  lastAccessedLesson?: LessonBase;

  lastActivityAt?: string;

  pricing?: {
    currency: string;
    originalPrice?: number;
    pricePaid?: number;
    discountAmount?: number;
    couponCode?: string;
  };

  payment?: {
    provider?: string;
    paymentId?: string;
    orderId?: string;
    status: "pending" | "paid" | "failed" | "refunded";
    paidAt?: string;
  };

  enrolledAt: string;
  completedAt?: string;

  createdAt: string;
  updatedAt: string;
}
