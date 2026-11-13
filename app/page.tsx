
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Work from "./components/sections/Work";
import Process from "./components/sections/Process";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <Hero />

      {/* Main Website Content */}
      <div className="w-full">
        <Services />
        {/* Services component goes here */}

        {/* Works component goes here */}
        <Work />
        {/* Process component goes here */}
        <Process />

      </div>

    </main>
  );
}
