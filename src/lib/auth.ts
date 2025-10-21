import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          // Find user by email or username
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { username: credentials.identifier }
              ]
            }
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          if (!user.password) {
            throw new Error("Please sign in with Google or set a password");
          }

          // Verify password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            email: user.email!,
            name: user.name,
            image: user.image,
            username: user.username,
            isVerified: user.isVerified,
            initials: user.initials,
            sub: user.sub || user.id,
          };
        } catch (error: any) {
          console.error("Error in credentials authorize:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        if (account?.provider === "google") {
          token.sub = profile?.sub;

          try {
            // Find or create user for Google OAuth
            let existingUser = await prisma.user.findUnique({
              where: { sub: token.sub }
            });

            if (!existingUser) {
              // Generate unique username
              const baseUsername = user.name?.toLowerCase().replace(/\s+/g, "_") || "user";
              let uniqueUsername = baseUsername;
              let suffix = 0;

              // Ensure username is unique
              while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
                suffix += 1;
                const randomSuffix = Math.floor(Math.random() * 1000);
                uniqueUsername = `${baseUsername}_${suffix}_${randomSuffix}`;
              }

              // Generate initials
              const initials = user.name?.split(" ").map(word => word[0]).join("").toUpperCase() || "U";

              // Create new user
              existingUser = await prisma.user.create({
                data: {
                  sub: token.sub,
                  username: uniqueUsername.toLowerCase(),
                  name: user.name,
                  email: user.email!,
                  isVerified: true,
                  emailVerified: new Date(),
                  image: user.image,
                  initials: initials,
                }
              });
            }

            token.id = existingUser.id;
            token.isVerified = existingUser.isVerified;
            token.username = existingUser.username;
            token.image = existingUser.image;
            token.initials = existingUser.initials;
          } catch (error) {
            console.error("Error creating/finding Google user:", error);
          }
        } else if (account?.provider === "credentials") {
          // Credentials login
          token.id = user.id;
          token.isVerified = user.isVerified;
          token.username = user.username;
          token.image = user.image;
          token.initials = user.initials;
        }
      }

      // Refresh user data on each request (optional - for updated avatar)
      if (token.id) {
        try {
          const updatedUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { image: true, name: true, initials: true }
          });

          if (updatedUser) {
            token.image = updatedUser.image;
            token.name = updatedUser.name;
            token.initials = updatedUser.initials;
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.username = token.username as string;
        session.user.sub = token.sub as string;
        session.user.image = token.image as string;
        session.user.initials = token.initials as string;
      }

      return session;
    },
    async signIn({ user, account }) {
      // Allow sign in
      return true;
    }
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
};
