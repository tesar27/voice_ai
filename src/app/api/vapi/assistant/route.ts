import { NextRequest, NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function POST() {
  if (!VAPI_API_KEY) {
    return NextResponse.json(
      { error: 'VAPI_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    // Log the API key format for debugging (first 8 chars only)
    console.log('Using Vapi API key:', VAPI_API_KEY.slice(0, 8) + '...')
    
    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "Yerbolat's AI Agent",
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
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM"
        },
        firstMessage: "Hi! I'm Yerbolat's AI agent. I'm here to tell you about his work and expertise in AI development. What would you like to know?"
      }),
    })

    console.log('Vapi assistant API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Vapi assistant API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      // Check for specific error types
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid API key',
            details: 'Please check your Vapi.ai API key configuration',
            status: 401
          },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { 
            error: 'API key not authorized',
            details: 'Your Vapi.ai API key may need to be activated or have insufficient permissions',
            status: 403
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { 
          error: `Vapi API error: ${response.statusText}`,
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const assistant = await response.json()
    console.log('Successfully created assistant:', assistant.id)
    return NextResponse.json({ success: true, assistantId: assistant.id })
  } catch (error: any) {
    console.error('Error creating assistant:', error)
    
    // Handle network errors specifically
    if (error.code === 'ENOTFOUND' || error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error - unable to reach Vapi.ai API' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create assistant', details: error.message },
      { status: 500 }
    )
  }
}
