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
  const publicKeyRef = useRef<string | null>(null)

  // Fetch public key from server
  const fetchPublicKey = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/vapi/public-key')
      if (!response.ok) {
        throw new Error('Failed to fetch public key')
      }
      const data = await response.json()
      return data.publicKey
    } catch (error) {
      console.error('Error fetching public key:', error)
      return null
    }
  }, [])

  useEffect(() => {
    // Initialize Vapi with public key
    const initVapi = async () => {
      const key = publicKey || publicKeyRef.current || await fetchPublicKey()
      if (key) {
        publicKeyRef.current = key
        try {
          vapi.current = new Vapi(key)
          
          // Set up event listeners
          vapi.current.on('call-start', () => {
            console.log('Call started')
            setIsCallActive(true)
            setIsConnected(true)
          })
          
          vapi.current.on('call-end', () => {
            console.log('Call ended')
            setIsCallActive(false)
            setIsConnected(false)
            setCallDuration(0)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          })
          
          vapi.current.on('error', (error: any) => {
            console.error('Vapi error:', error)
            setError(error.message || 'Voice chat error occurred')
            setIsCallActive(false)
            setIsConnected(false)
          })
          
          vapi.current.on('volume-level', (level: number) => {
            setVolume(level)
          })
          
        } catch (err: any) {
          console.error('Vapi initialization error:', err.message)
          setError('Failed to initialize voice chat')
        }
      }
    }
    
    initVapi()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (vapi.current) {
        vapi.current.stop()
      }
    }
  }, [publicKey, fetchPublicKey])

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
        console.error('Assistant creation error:', errorData)
        throw new Error(errorData.details || errorData.error || 'Failed to create assistant')
      }

      const data = await response.json()
      if (!data.success || !data.assistantId) {
        throw new Error('Invalid response from assistant creation API')
      }
      
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
    if (!vapi.current) {
      setError('Voice chat not initialized')
      return
    }

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

      // Start the call using Vapi SDK
      await vapi.current.start(useAssistantId)
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

    } catch (err: any) {
      console.error('Voice chat error:', err)
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
