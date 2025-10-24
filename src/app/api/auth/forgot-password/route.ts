import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = ForgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send password reset email (don't wait for it)
    sendPasswordResetEmail(user.email, user.name || 'User', resetToken)
      .then((result) => {
        if (result.success) {
          console.log('Password reset email sent to:', user.email);
        } else {
          console.error('Failed to send password reset email:', result.error);
        }
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
      });

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
