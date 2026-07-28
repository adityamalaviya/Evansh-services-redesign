import { Suspense } from "react";
import AuthLoginPage from "@frontend/modules/Auth/AuthLoginPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLoginPage />
    </Suspense>
  );
}