import type { Media } from "./media";
import type { Seo } from "./seo";
import type { CategoryBase } from "./category";

/**
 * Lightweight course reference
 */
export interface CourseBase {
  id: string;
  title: string;
  slug: string;
}

/**
 * Full course model
 */
export interface Course extends CourseBase {
  description?: string;

  category: CategoryBase;

  level: "Beginner" | "Intermediate" | "Advanced";

  durationHours?: number;
  totalLessons: number;
  price: number;

  image?: Media;
  seo?: Seo;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}
