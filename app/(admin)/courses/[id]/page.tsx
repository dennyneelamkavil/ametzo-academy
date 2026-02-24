import { Metadata } from "next";
import CourseViewClient from "../components/CourseViewClient";

export const metadata: Metadata = {
  title: "View Course | Ametzo Academy Admin",
  description: "View course details in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewCoursePage({ params }: Params) {
  const { id } = await params;
  return <CourseViewClient id={id} />;
}
