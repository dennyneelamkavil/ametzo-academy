import "server-only";

export function mapCategoryForStudentList(category: any) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image ? { url: category.image.url } : null,
    description: category.description ?? null,
  };
}

export function mapCategoryDetail(category: any, courses: any[]) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image ? { url: category.image.url } : null,
    description: category.description ?? null,

    courses: courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      image: course.image ? { url: course.image.url } : null,
      durationHours: course.durationHours ?? 0,
      totalLessons: course.totalLessons ?? 0,
      price: course.price ?? 0,
    })),

    seo: category.seo ?? null,
  };
}
