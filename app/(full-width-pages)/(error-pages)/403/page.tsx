import { Metadata } from "next";
import Error403Client from "@/components/error/Error403Client";

export const metadata: Metadata = {
  title: "403 – Access Denied | Ametzo Academy Admin",
  description:
    "You do not have permission to access this page in the Ametzo Academy admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error403() {
  return <Error403Client />;
}
