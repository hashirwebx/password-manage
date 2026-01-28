import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDb from './db';
import User from './userModel';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        console.log('[Auth] Attempting login for:', credentials.email);
        
        await connectDb();
        const normalizedEmail = credentials.email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        console.log('[Auth] User found:', !!user);
        
        if (!user || !user?.passwordHash) {
          console.log('[Auth] User not found or no password hash');
          throw new Error("Invalid credentials");
        }

        console.log('[Auth] Comparing password...');
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        console.log('[Auth] Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        console.log('[Auth] Login successful for:', user.email);
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          organizationId: user.organizationId?.toString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
