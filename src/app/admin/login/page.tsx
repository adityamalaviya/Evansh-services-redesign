import { Suspense } from "react";
import AdminLoginPage from "@frontend/modules/Admin/AdminLoginPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
