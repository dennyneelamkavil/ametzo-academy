import { Metadata } from "next";
import CategoriesListClient from "./components/CategoriesListClient";

export const metadata: Metadata = {
  title: "Categories | Ametzo Academy Admin",
  description: "Manage categories in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CategoriesPage() {
  return <CategoriesListClient />;
}
