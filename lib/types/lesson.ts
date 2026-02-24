import type { Media } from "./media";
import type { CourseBase } from "./course";

/**
 * Lightweight lesson reference
 */
export interface LessonBase {
  id: string;
  title: string;
}

/**
 * Full lesson model
 */
export interface Lesson extends LessonBase {
  course: CourseBase;

  videoUrl: Media;

  durationMinutes?: number;
  order?: number;

  createdAt: string;
  updatedAt: string;
}
