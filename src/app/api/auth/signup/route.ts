import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import type { Prisma } from '@prisma/client';

// Validation schema for user registration
const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = SignUpSchema.parse(body);

    // Check if user already exists by email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingUserByUsername = await prisma.user.findFirst({
      where: { username: validatedData.username.toLowerCase() }
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Generate initials
    const initials = validatedData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username.toLowerCase(),
        password: hashedPassword,
        initials,
        isVerified: false, // User must verify email
        verificationToken,
        verificationTokenExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        initials: true,
        createdAt: true,
      }
    });

    // Send verification email (don't wait for it to avoid delays)
    sendVerificationEmail(user.email, user.name || 'User', verificationToken)
      .then((result) => {
        if (result.success) {
          console.log('Verification email sent to:', user.email);
        } else {
          console.error('Failed to send verification email:', result.error);
        }
      })
      .catch((error) => {
        console.error('Error sending verification email:', error);
      });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Account created successfully! Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create account',
      },
      { status: 500 }
    );
  }
}
