import { Metadata } from "next";
import LessonFormClient from "../../components/LessonFormClient";

export const metadata: Metadata = {
  title: "Edit Lesson | Ametzo Academy Admin",
  description: "Edit lesson in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditLessonPage({ params }: Params) {
  const { id } = await params;
  return <LessonFormClient mode="edit" id={id} />;
}
