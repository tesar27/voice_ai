"use client";

import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import VoiceChat from "@/components/ui/VoiceChat";

export default function Home() {
  const handleStartVoiceChat = () => {
    // This will trigger the floating voice chat button
    const voiceChatButton = document.querySelector(
      '[title="Talk to AI Agent"], [title="Starting AI Agent..."]'
    ) as HTMLButtonElement;
    if (voiceChatButton) {
      voiceChatButton.click();
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation onStartVoiceChat={handleStartVoiceChat} />
      <Hero onStartVoiceChat={handleStartVoiceChat} />
      <About />
      <VoiceChat />
    </main>
  );
}
