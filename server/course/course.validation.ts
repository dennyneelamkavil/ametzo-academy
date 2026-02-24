import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";
import { SeoValidation } from "@/server/seo/seo.validation";

export const CreateCourseSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),

  category: z.string().min(1),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),

  durationHours: z.number().min(0).optional(),
  totalLessons: z.number().min(0).optional(),

  price: z.number().min(0).optional(),

  image: MediaValidation.optional(),

  isPublished: z.boolean().optional(),

  seo: SeoValidation.optional(),
});

export const UpdateCourseSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),

  category: z.string().optional(),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),

  durationHours: z.number().min(0).optional(),
  totalLessons: z.number().min(0).optional(),

  price: z.number().min(0).optional(),

  image: MediaValidation.optional(),

  isPublished: z.boolean().optional(),

  seo: SeoValidation.optional(),
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
