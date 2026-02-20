import { Metadata } from "next";
import PermissionFormClient from "../components/PermissionFormClient";

export const metadata: Metadata = {
  title: "Create Permission | Ametzo Academy Admin",
  description: "Create a new permission in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePermissionPage() {
  return <PermissionFormClient mode="create" />;
}
