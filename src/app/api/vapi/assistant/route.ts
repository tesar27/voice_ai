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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Vapi API error:', errorText)
      throw new Error(`Vapi API error: ${response.statusText}`)
    }

    const assistant = await response.json()
    return NextResponse.json({ assistantId: assistant.id })
  } catch (error) {
    console.error('Error creating assistant:', error)
    return NextResponse.json(
      { error: 'Failed to create assistant' },
      { status: 500 }
    )
  }
}
