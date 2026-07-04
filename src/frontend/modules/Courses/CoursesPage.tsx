import { Suspense } from "react";
import { Header, Courses, Footer } from "@frontend/components";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main>
        <div className="pt-28 pb-20"> {/* Spacer for fixed header */}
          <Suspense fallback={null}>
            <Courses forceVisible={true} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
