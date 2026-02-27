import { NextRequest, NextResponse } from 'next/server'

interface AuthCheckResponse {
  authenticated: boolean
  error?: string
  code?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<AuthCheckResponse>> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { authenticated: false, error: 'Missing authorization header', code: 'MISSING_AUTH_HEADER' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Validate token format
    if (!token || token.length < 10) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token format', code: 'INVALID_TOKEN_FORMAT' },
        { status: 401 }
      )
    }

    // Check token expiration (basic check - in production, verify JWT signature)
    if (token === 'expired') {
      return NextResponse.json(
        { authenticated: false, error: 'Token has expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      )
    }

    // Token is valid
    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        authenticated: false, 
        error: 'Internal server error',
        code: 'AUTH_CHECK_ERROR'
      },
      { status: 500 }
    )
  }
}
