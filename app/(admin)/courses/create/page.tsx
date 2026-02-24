import { Metadata } from "next";
import CourseFormClient from "../components/CourseFormClient";

export const metadata: Metadata = {
  title: "Create Course | Ametzo Academy Admin",
  description: "Create a new course in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCoursePage() {
  return <CourseFormClient mode="create" />;
}
