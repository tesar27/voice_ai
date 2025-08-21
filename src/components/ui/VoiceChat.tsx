"use client";

import { useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface VoiceChatProps {
  publicKey?: string;
  assistantId?: string;
}

export default function VoiceChat({ publicKey, assistantId }: VoiceChatProps) {
  const [showDemo, setShowDemo] = useState(false);

  const {
    isCallActive,
    isMuted,
    volume,
    error,
    callDuration,
    startCall,
    endCall,
    toggleMute,
  } = useVoiceChat({ publicKey, assistantId });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartDemo = () => {
    if (publicKey) {
      startCall();
    } else {
      setShowDemo(true);
    }
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {/* Main Voice Chat Button */}
        {!isCallActive && !showDemo ? (
          <button
            onClick={handleStartDemo}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
            title="Talk to AI Agent"
          >
            <Phone size={28} />
          </button>
        ) : isCallActive ? (
          /* Call Interface */
          <div className="bg-black/90 backdrop-blur-md border border-gray-700 rounded-2xl p-6 min-w-[300px] shadow-2xl">
            {/* Call Status */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">AI Agent Active</span>
              </div>
              <div className="text-gray-400 text-sm">
                Duration: {formatDuration(callDuration)}
              </div>
            </div>

            {/* Volume Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isMuted ? (
                  <VolumeX size={16} className="text-gray-400" />
                ) : (
                  <Volume2 size={16} className="text-blue-400" />
                )}
                <span className="text-sm text-gray-400">Voice Level</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(volume * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isMuted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all duration-200"
                title="End Call"
              >
                <PhoneOff size={20} />
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone size={32} className="text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                AI Agent Demo
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Experience my AI-powered voice assistant! This demo showcases
                advanced voice AI technology using Vapi.ai integration. The AI
                agent can discuss my background, projects, and expertise in
                real-time conversation.
              </p>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> To enable the full voice AI experience,
                  a Vapi.ai API key is required. This demo shows the interface
                  and functionality.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCloseDemo}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300"
                >
                  Got it!
                </button>
                <p className="text-gray-400 text-sm">
                  Contact me to discuss implementing voice AI for your project
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
