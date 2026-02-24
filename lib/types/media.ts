export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  alt?: string;
  caption?: string;
}

export type TempMediaFolder =
  | "temp/categories"
  | "temp/subcategories"
  | "temp/courses"
  | "temp/lessons"
  | "temp/seo";

export type FinalMediaFolder =
  | "categories"
  | "subcategories"
  | "courses"
  | "lessons"
  | "seo";

export type MediaFolder = TempMediaFolder | FinalMediaFolder;
