import { NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function GET() {
  if (!VAPI_API_KEY) {
    return NextResponse.json({
      error: 'VAPI_API_KEY not configured',
      envCheck: false
    })
  }

  try {
    // Test the Vapi API connection
    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      keyPreview: `${VAPI_API_KEY.slice(0, 8)}...${VAPI_API_KEY.slice(-4)}`
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      type: 'network_error'
    })
  }
}
