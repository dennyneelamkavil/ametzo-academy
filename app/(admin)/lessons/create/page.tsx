import { Metadata } from "next";
import LessonFormClient from "../components/LessonFormClient";

export const metadata: Metadata = {
  title: "Create Lesson | Ametzo Academy Admin",
  description: "Create a new lesson in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateLessonPage() {
  return <LessonFormClient mode="create" />;
}
