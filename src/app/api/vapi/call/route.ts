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

    console.log('Starting call with assistant:', assistantId)

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

    console.log('Vapi call API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Vapi call API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      // Check for specific error types
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Invalid API key for call',
            details: 'Please check your Vapi.ai API key configuration',
            status: 401
          },
          { status: 401 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Assistant not found',
            details: 'The assistant ID may be invalid or deleted',
            status: 404
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          error: `Vapi call API error: ${response.statusText}`,
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const call = await response.json()
    console.log('Successfully started call:', call.id || 'call-id-not-available')
    return NextResponse.json({ success: true, ...call })
  } catch (error: any) {
    console.error('Error starting call:', error)
    
    // Handle network errors specifically
    if (error.code === 'ENOTFOUND' || error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error - unable to reach Vapi.ai API' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to start call', details: error.message },
      { status: 500 }
    )
  }
}
