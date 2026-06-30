import { Header, Hero, Courses } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <Hero />
      <Courses />
      {/* Additional sections can be added here */}
    </main>
  );
}
