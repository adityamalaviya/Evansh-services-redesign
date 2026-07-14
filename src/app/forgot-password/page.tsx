import type { Metadata } from "next";
import ForgotPasswordPage from "@frontend/modules/Auth/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Forgot Password | Evansh Services",
  description: "Reset your Evansh Services account password.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
