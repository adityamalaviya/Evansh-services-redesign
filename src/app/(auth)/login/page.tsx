import { Suspense } from "react";
import AuthLoginPage from "@frontend/modules/Auth/AuthLoginPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthLoginPage />
    </Suspense>
  );
}