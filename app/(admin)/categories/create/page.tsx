import { Metadata } from "next";
import CategoryFormClient from "../components/CategoryFormClient";

export const metadata: Metadata = {
  title: "Create Category | Ametzo Academy Admin",
  description: "Create a new category in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCategoryPage() {
  return <CategoryFormClient mode="create" />;
}
