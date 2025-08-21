'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Vapi from '@vapi-ai/web'

interface UseVoiceChatProps {
  publicKey?: string
  assistantId?: string
}

export function useVoiceChat({ publicKey, assistantId }: UseVoiceChatProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<any[]>([])
  
  const vapi = useRef<Vapi | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only initialize if we have a public key
    if (!publicKey) return

    try {
      vapi.current = new Vapi(publicKey)
      
      // Set up event listeners
      vapi.current.on('call-start', () => {
        setIsCallActive(true)
        setIsConnected(true)
        setError(null)
        
        // Start duration timer
        intervalRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1)
        }, 1000)
      })

      vapi.current.on('call-end', () => {
        setIsCallActive(false)
        setIsConnected(false)
        setCallDuration(0)
        
        // Clear duration timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      })

      vapi.current.on('volume-level', (level: number) => {
        setVolume(level)
      })

      vapi.current.on('message', (message: any) => {
        setMessages(prev => [...prev, message])
      })

      vapi.current.on('error', (error: any) => {
        setError(error.message || 'An error occurred')
        setIsCallActive(false)
        setIsConnected(false)
      })

    } catch (err: any) {
      setError('Failed to initialize voice chat: ' + err.message)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (vapi.current) {
        vapi.current.stop()
      }
    }
  }, [publicKey])

  const startCall = useCallback(async () => {
    if (!vapi.current) {
      setError('Voice chat not initialized. Please provide a valid API key.')
      return
    }
    
    try {
      setError(null)
      // For now, we'll create a simple assistant configuration
      // In production, you'd want to use a pre-configured assistantId
      const assistantConfig = {
        name: "Yerbolat's AI Assistant",
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are Yerbolat's AI assistant. You represent Yerbolat Tazhkeyev, a skilled AI engineer and developer. 

              About Yerbolat:
              - Expert in AI/ML development and voice AI integration
              - Specializes in Next.js, React, Python, and Node.js
              - Has experience building enterprise AI agents and automation solutions
              - Passionate about creating intelligent solutions that bridge human-AI interaction
              - Currently working on innovative voice AI projects

              Be conversational, friendly, and knowledgeable. Answer questions about Yerbolat's background, skills, and projects. If asked about specific technical details or project collaborations, be helpful but suggest they contact Yerbolat directly for detailed discussions.

              Keep your responses concise and natural for voice conversation.`
            }
          ]
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        }
      }

      await vapi.current.start(assistantConfig)
    } catch (err: any) {
      setError(err.message || 'Failed to start call')
    }
  }, [])

  const endCall = useCallback(() => {
    if (vapi.current && isCallActive) {
      vapi.current.stop()
    }
  }, [isCallActive])

  const toggleMute = useCallback(() => {
    if (vapi.current && isCallActive) {
      vapi.current.setMuted(!isMuted)
      setIsMuted(!isMuted)
    }
  }, [isMuted, isCallActive])

  return {
    isConnected,
    isCallActive,
    isMuted,
    volume,
    error,
    callDuration,
    messages,
    startCall,
    endCall,
    toggleMute
  }
}
