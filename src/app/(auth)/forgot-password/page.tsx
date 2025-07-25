import { Metadata } from "next";
import ForgotPasswordClientComponent from "./forgot-password.client";

export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: "Jelszó visszaállítása",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientComponent />;
}
