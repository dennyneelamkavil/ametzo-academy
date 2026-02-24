export function mapCourse(course: any) {
  return {
    id: String(course._id),
    title: course.title,
    slug: course.slug,
    description: course.description,
    category: course.category,
    level: course.level,
    durationHours: course.durationHours,
    totalLessons: course.totalLessons,
    price: course.price,
    image: course.image,
    isPublished: course.isPublished,
    seo: course.seo,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}
