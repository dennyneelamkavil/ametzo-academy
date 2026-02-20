import { Metadata } from "next";
import RolesListClient from "./components/RolesListClient";

export const metadata: Metadata = {
  title: "Roles | Ametzo Academy Admin",
  description: "Manage roles in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RolesPage() {
  return <RolesListClient />;
}
