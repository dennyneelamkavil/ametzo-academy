import { Metadata } from "next";
import LessonViewClient from "../components/LessonViewClient";

export const metadata: Metadata = {
  title: "View Lesson | Ametzo Academy Admin",
  description: "View lesson details in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewLessonPage({ params }: Params) {
  const { id } = await params;
  return <LessonViewClient id={id} />;
}
