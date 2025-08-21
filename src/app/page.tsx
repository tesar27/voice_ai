"use client";

import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import VoiceChat from "@/components/ui/VoiceChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <About />
      <VoiceChat />
    </main>
  );
}
