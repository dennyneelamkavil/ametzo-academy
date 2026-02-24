export function mapLesson(lesson: any) {
  return {
    id: String(lesson._id),
    title: lesson.title,
    course: lesson.course,
    videoUrl: lesson.videoUrl,
    durationMinutes: lesson.durationMinutes,
    order: lesson.order,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}
