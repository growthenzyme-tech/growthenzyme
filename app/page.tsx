
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#A8CFA8]/50">

      <Hero />

      {/* Main Website Content */}
      <div className="w-full">
        <Services />
        {/* Services component goes here */}
        {/* Works component goes here */}
        {/* Process component goes here */}

      </div>

    </main>
  );
}
