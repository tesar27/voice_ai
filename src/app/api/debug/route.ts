import { NextResponse } from 'next/server'

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY
const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY

export async function GET() {
  const keyStatus = {
    privateKeyConfigured: !!VAPI_PRIVATE_KEY,
    publicKeyConfigured: !!VAPI_PUBLIC_KEY,
    privateKeyPreview: VAPI_PRIVATE_KEY ? `${VAPI_PRIVATE_KEY.slice(0, 8)}...${VAPI_PRIVATE_KEY.slice(-4)}` : 'Not configured',
    publicKeyPreview: VAPI_PUBLIC_KEY ? `${VAPI_PUBLIC_KEY.slice(0, 8)}...${VAPI_PUBLIC_KEY.slice(-4)}` : 'Not configured'
  }

  if (!VAPI_PRIVATE_KEY) {
    return NextResponse.json({
      error: 'VAPI_PRIVATE_KEY not configured',
      keyStatus
    })
  }

  try {
    // Test the Vapi API connection with private key
    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      keyStatus
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      type: 'network_error',
      keyStatus
    })
  }
}
