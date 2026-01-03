import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { googleId: user.id },
        });

        if (!existingUser) {
          // Check if email already exists
          const emailUser = await prisma.user.findUnique({
            where: { email: user.email || undefined },
          });

          if (emailUser) {
            // Link Google account to existing user
            await prisma.user.update({
              where: { id: emailUser.id },
              data: { googleId: user.id, image: user.image },
            });
          } else {
            // Create new user
            const username = user.email?.split('@')[0] || `user_${Date.now()}`;
            await prisma.user.create({
              data: {
                username,
                email: user.email,
                googleId: user.id,
                image: user.image,
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: token.sub },
              { googleId: token.sub },
              { email: session.user.email || undefined },
            ],
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.username = dbUser.username;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
