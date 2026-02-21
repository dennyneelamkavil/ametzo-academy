import "server-only";

export function mapCourseForStudentList(course: any, isEnrolled: boolean) {
  return {
    id: course._id.toString(),
    title: course.title,
    slug: course.slug,
    image: course.image ? { url: course.image.url } : null,
    durationHours: course.durationHours ?? 0,
    totalLessons: course.totalLessons ?? 0,
    price: course.price ?? 0,
    isEnrolled,
  };
}

export function mapCourseDetail(
  course: any,
  lessons: any[],
  enrollment: any | null,
) {
  return {
    id: course._id.toString(),
    title: course.title,
    slug: course.slug,
    description: course.description ?? null,
    image: course.image ? { url: course.image.url } : null,
    durationHours: course.durationHours ?? 0,
    totalLessons: course.totalLessons ?? 0,
    price: course.price ?? 0,

    isEnrolled: !!enrollment,
    progressPercent: enrollment?.progressPercent ?? 0,

    lessons: lessons.map((l) => ({
      id: l._id.toString(),
      title: l.title,
      durationMinutes: l.durationMinutes ?? 0,
      order: l.order ?? 0,
    })),

    seo: course.seo ?? null,
  };
}
