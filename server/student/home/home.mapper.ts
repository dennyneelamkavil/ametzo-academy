import "server-only";

export function mapHomeResponse(
  student: any,
  enrollments: any[],
  stats: {
    totalCourses: number;
    completedLessons: number;
  },
) {
  return {
    user: {
      name: student?.fullName ?? "Student",
    },

    overview: {
      active_courses: stats.totalCourses,
      completed_lessons: stats.completedLessons,
      total_courses: stats.totalCourses,
    },

    my_courses: enrollments.map((e) => ({
      course_id: e.course?._id?.toString(),
      title: e.course?.title,
      slug: e.course?.slug,
      image: e.course?.image ? { url: e.course.image.url } : null,
      totalLessons: e.course?.totalLessons ?? 0,
      progress_percent: e.progressPercent ?? 0,
    })),
  };
}
