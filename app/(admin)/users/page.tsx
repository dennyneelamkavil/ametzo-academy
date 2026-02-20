import { Metadata } from "next";
import UsersListClient from "./components/UsersListClient";

export const metadata: Metadata = {
  title: "Users | Ametzo Academy Admin",
  description: "Manage users in the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UsersPage() {
  return <UsersListClient />;
}
