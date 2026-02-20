import { Metadata } from "next";
import UserFormClient from "../components/UserFormClient";

export const metadata: Metadata = {
  title: "Create User | Ametzo Academy Admin",
  description: "Create a new user in Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateUserPage() {
  return <UserFormClient mode="create" />;
}
