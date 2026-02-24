import "server-only";
import { z } from "zod";
import { MediaValidation } from "@/server/media/media.validation";

export const CreateLessonSchema = z.object({
  title: z.string().min(2),

  course: z.string().min(1),

  videoUrl: MediaValidation,

  durationMinutes: z.number().min(0).optional(),
  order: z.number().min(0).optional(),
});

export const UpdateLessonSchema = z.object({
  title: z.string().min(2).optional(),

  course: z.string().optional(),

  videoUrl: MediaValidation.optional(),

  durationMinutes: z.number().min(0).optional(),
  order: z.number().min(0).optional(),
});

export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;
