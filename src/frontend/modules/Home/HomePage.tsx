import { Suspense } from "react";
import { Header, Hero, Courses, Footer } from "@frontend/components";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Courses />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
