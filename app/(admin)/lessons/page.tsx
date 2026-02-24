import { Metadata } from "next";
import LessonsListClient from "./components/LessonsListClient";

export const metadata: Metadata = {
  title: "Lessons | Ametzo Academy Admin",
  description: "Manage lessons in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LessonsPage() {
  return <LessonsListClient />;
}
