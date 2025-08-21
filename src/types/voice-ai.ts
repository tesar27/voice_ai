export interface VoiceAIConfig {
  apiKey: string;
  assistantId?: string;
  publicKey?: string;
}

export interface ConversationState {
  isConnected: boolean;
  isCallActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  volume?: number;
  callId?: string;
  duration?: number;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'function_call';
}

export interface VoiceSettings {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  optimizeStreamingLatency?: number;
}

export interface AIPersonality {
  name: string;
  role: string;
  background: string;
  traits: string[];
  expertise: string[];
  communicationStyle: string;
}
