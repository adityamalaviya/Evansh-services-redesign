import { Suspense } from "react";
import RegisterPage from "@frontend/modules/Auth/RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}

