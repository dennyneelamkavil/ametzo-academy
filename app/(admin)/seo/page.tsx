import { Metadata } from "next";
import SeoListClient from "./components/SeoListClient";

export const metadata: Metadata = {
  title: "Seo | Ametzo Academy Admin",
  description: "Manage seo in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoPage() {
  return <SeoListClient />;
}
