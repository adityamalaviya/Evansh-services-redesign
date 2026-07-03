import React from "react";
import Header from "@frontend/components/Navigation/Header/Header";
import Footer from "@frontend/components/Navigation/Footer/Footer";
import Works from "@frontend/modules/Works/Components/Works";

export default function WorksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="pt-20">
        <Works />
      </main>
      <Footer />
    </div>
  );
}
