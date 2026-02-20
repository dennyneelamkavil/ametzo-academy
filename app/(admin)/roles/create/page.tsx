import { Metadata } from "next";
import RoleFormClient from "../components/RoleFormClient";

export const metadata: Metadata = {
  title: "Create Role | Ametzo Academy Admin",
  description: "Create a new role in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePermissionPage() {
  return <RoleFormClient mode="create" />;
}
