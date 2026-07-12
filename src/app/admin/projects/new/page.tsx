import { Suspense } from "react";
import NewProjectPage from "@frontend/modules/Admin/Projects/NewProjectPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <NewProjectPage />
    </Suspense>
  );
}
