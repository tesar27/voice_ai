import { NextResponse } from 'next/server'

const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY

export async function GET() {
  if (!VAPI_PUBLIC_KEY) {
    return NextResponse.json(
      { error: 'VAPI_PUBLIC_KEY not configured' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    publicKey: VAPI_PUBLIC_KEY
  })
}
