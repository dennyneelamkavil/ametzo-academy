import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth/session";
import SignInForm from "./components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Ametzo Academy Admin",
  description: "Sign in to access the Ametzo Academy admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignInForm />;
}
