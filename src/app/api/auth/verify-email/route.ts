import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired verification token. Please request a new one.' 
        },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email already verified. You can sign in now.' 
        },
        { status: 200 }
      );
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.name || 'User')
      .then((result) => {
        if (result.success) {
          console.log('Welcome email sent to:', user.email);
        } else {
          console.error('Failed to send welcome email:', result.error);
        }
      })
      .catch((error) => {
        console.error('Error sending welcome email:', error);
      });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully! You can now sign in.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
