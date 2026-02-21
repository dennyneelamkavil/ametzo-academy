import "server-only";

export function mapSavedCourses(product: any) {
  return {
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    thumbnail: product.coverImage ? { url: product.coverImage.url } : null,
  };
}
