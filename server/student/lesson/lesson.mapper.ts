import "server-only";

export function mapLessonDetail(
  lesson: any,
  enrollment: any,
  isCompleted: boolean,
) {
  return {
    lesson_id: lesson._id.toString(),
    title: lesson.title,
    video_url: lesson.videoUrl?.url ?? null,
    duration_minutes: lesson.durationMinutes ?? 0,
    is_completed: isCompleted,
    progress_percent: enrollment?.progressPercent ?? 0,
  };
}
