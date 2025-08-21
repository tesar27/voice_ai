import { NextResponse } from 'next/server'

export async function GET() {
  const VAPI_API_KEY = process.env.VAPI_API_KEY

  if (!VAPI_API_KEY) {
    return NextResponse.json({
      error: 'VAPI_API_KEY not configured',
      envCheck: false
    })
  }

  return NextResponse.json({
    message: 'API Key is configured',
    envCheck: true,
    keyLength: VAPI_API_KEY.length,
    keyPreview: `${VAPI_API_KEY.slice(0, 8)}...${VAPI_API_KEY.slice(-4)}`
  })
}
