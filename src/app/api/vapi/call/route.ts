import { NextRequest, NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function POST(request: NextRequest) {
  if (!VAPI_API_KEY) {
    return NextResponse.json(
      { error: 'VAPI_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const { assistantId } = await request.json()

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.vapi.ai/call/web', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId,
        metadata: {
          type: 'web',
          source: 'portfolio',
          timestamp: new Date().toISOString()
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Vapi call API error:', errorText)
      throw new Error(`Vapi API error: ${response.statusText}`)
    }

    const call = await response.json()
    return NextResponse.json(call)
  } catch (error) {
    console.error('Error starting call:', error)
    return NextResponse.json(
      { error: 'Failed to start call' },
      { status: 500 }
    )
  }
}
