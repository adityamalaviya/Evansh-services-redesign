import type { Metadata } from "next";
import ResetPasswordPage from "@frontend/modules/Auth/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password | Evansh Services",
  description: "Set a new password for your Evansh Services account.",
};

export default function Page() {
  return <ResetPasswordPage />;
}
