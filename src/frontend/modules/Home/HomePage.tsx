import { Header, Hero, Courses, Footer } from "@frontend/components";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main>
        <Hero />
        <Courses />
      </main>
      <Footer />
    </div>
  );
}
