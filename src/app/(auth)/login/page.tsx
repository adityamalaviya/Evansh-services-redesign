import { Suspense } from "react";
import AuthLoginPage from "@frontend/modules/Auth/AuthLoginPage";

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafb] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthLoginPage />
    </Suspense>
  );
}
