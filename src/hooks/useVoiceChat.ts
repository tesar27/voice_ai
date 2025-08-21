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
  const [isLoading, setIsLoading] = useState(false)
  
  const vapi = useRef<Vapi | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentAssistantId = useRef<string | null>(null)

  useEffect(() => {
    // Initialize Vapi with a dummy public key for API route usage
    // We'll use our API routes instead of direct Vapi client calls
    try {
      vapi.current = new Vapi("dummy-key") // We won't use this directly
    } catch (err: any) {
      console.log('Vapi initialization note:', err.message)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (vapi.current) {
        vapi.current.stop()
      }
    }
  }, [])

  const createAssistant = useCallback(async (): Promise<string | null> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/vapi/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create assistant')
      }

      const data = await response.json()
      currentAssistantId.current = data.assistantId
      return data.assistantId
    } catch (err: any) {
      setError(err.message || 'Failed to create assistant')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startCall = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      // First, create an assistant if we don't have one
      let useAssistantId = assistantId || currentAssistantId.current
      
      if (!useAssistantId) {
        useAssistantId = await createAssistant()
        if (!useAssistantId) {
          throw new Error('Failed to create assistant')
        }
      }

      // Start the call using our API route
      const response = await fetch('/api/vapi/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: useAssistantId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start call')
      }

      const callData = await response.json()
      
      // Simulate call active state (in real implementation, you'd use Vapi's web client)
      setIsCallActive(true)
      setIsConnected(true)
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

      // Simulate some voice activity
      setTimeout(() => {
        setVolume(Math.random() * 0.8 + 0.2)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to start call')
    } finally {
      setIsLoading(false)
    }
  }, [assistantId, createAssistant])

  const endCall = useCallback(() => {
    if (vapi.current && isCallActive) {
      try {
        vapi.current.stop()
      } catch (err) {
        console.log('Note: Vapi stop called')
      }
    }
    
    setIsCallActive(false)
    setIsConnected(false)
    setCallDuration(0)
    setVolume(0)
    
    // Clear duration timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isCallActive])

  const toggleMute = useCallback(() => {
    if (vapi.current && isCallActive) {
      try {
        vapi.current.setMuted(!isMuted)
        setIsMuted(!isMuted)
      } catch (err) {
        console.log('Note: Mute toggle called')
        setIsMuted(!isMuted)
      }
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
    isLoading,
    startCall,
    endCall,
    toggleMute
  }
}
