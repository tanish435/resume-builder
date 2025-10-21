import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';
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

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username.toLowerCase(),
        password: hashedPassword,
        initials,
        isVerified: false, // Set to true if you don't have email verification
        // isVerified: true, // Uncomment this if you don't need email verification
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

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Account created successfully',
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
