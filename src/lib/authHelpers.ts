import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * Middleware helper to require authentication for API routes
 * Usage:
 * 
 * export async function GET(request: NextRequest) {
 *   const session = await requireAuth(request);
 *   if (session instanceof NextResponse) return session; // Error response
 *   
 *   // session is valid, continue with your logic
 *   const userId = session.user.id;
 * }
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'You must be signed in to access this resource',
      },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Get the current session (returns null if not authenticated)
 */
export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Check if user owns a resource
 */
export async function requireResourceOwnership(
  request: NextRequest,
  resourceUserId: string
) {
  const session = await requireAuth(request);
  
  if (session instanceof NextResponse) {
    return session; // Return the error response
  }

  if (session.user.id !== resourceUserId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      },
      { status: 403 }
    );
  }

  return session;
}
