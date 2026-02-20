import { Metadata } from "next";
import PermissionsListClient from "./components/PermissionsListClient";

export const metadata: Metadata = {
  title: "Permissions | Ametzo Academy Admin",
  description: "Manage permissions in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PermissionsPage() {
  return <PermissionsListClient />;
}
