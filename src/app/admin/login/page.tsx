import { Suspense } from "react";
import AdminLoginPage from "@frontend/modules/Admin/AdminLoginPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}