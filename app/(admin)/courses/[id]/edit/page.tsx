import { Metadata } from "next";
import CourseFormClient from "../../components/CourseFormClient";

export const metadata: Metadata = {
  title: "Edit Course | Ametzo Academy Admin",
  description: "Edit course in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditCoursePage({ params }: Params) {
  const { id } = await params;
  return <CourseFormClient mode="edit" id={id} />;
}
