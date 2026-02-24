import { Metadata } from "next";
import CoursesListClient from "./components/CoursesListClient";

export const metadata: Metadata = {
  title: "Courses | Ametzo Academy Admin",
  description: "Manage courses in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CoursesPage() {
  return <CoursesListClient />;
}
