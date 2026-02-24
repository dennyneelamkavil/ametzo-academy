import type { Media } from "./media";
import type { CourseBase } from "./course";

/**
 * Lightweight student reference
 */
export interface StudentBase {
  id: string;
  fullName?: string;
  phone: string;
}

/**
 * Full student model
 */
export interface Student extends StudentBase {
  email?: string;

  avatar?: Media;

  savedCourses?: CourseBase[];

  isActive: boolean;

  lastLoginAt?: string;

  createdAt: string;
  updatedAt: string;
}
