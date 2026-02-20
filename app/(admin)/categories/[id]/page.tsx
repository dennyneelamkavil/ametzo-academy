import { Metadata } from "next";
import CategoryViewClient from "../components/CategoryViewClient";

export const metadata: Metadata = {
  title: "View Category | Ametzo Academy Admin",
  description: "View category details in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewCategoryPage({ params }: Params) {
  const { id } = await params;
  return <CategoryViewClient id={id} />;
}
