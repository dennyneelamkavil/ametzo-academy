import { Metadata } from "next";
import SeoFormClient from "../components/SeoFormClient";

export const metadata: Metadata = {
  title: "Create Seo | Ametzo Academy Admin",
  description: "Create a new seo in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSeoPage() {
  return <SeoFormClient mode="create" />;
}
