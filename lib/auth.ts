import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "@/lib/prisma";
import { verifyOtpCode } from "@/lib/otp";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        if (!email) return null;

        // OTP login path
        if (credentials?.mode === "otp") {
          const code = (credentials?.code as string | undefined)?.trim();
          if (!code) return null;
          const result = await verifyOtpCode(email, code);
          if (!result.ok) return null;

          let user = await db.user.findUnique({ where: { email } });
          if (!user) {
            const name =
              email.split("@")[0]
                .split(/[._-]/)
                .filter(Boolean)
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(" ") || email;
            user = await db.user.create({
              data: { email, name, emailVerified: new Date() },
            });
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // Password login path
        const password = credentials?.password as string | undefined;
        if (!password) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? "";
        token.role = (user as { role?: Role }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? "";
        session.user.role = (token.role as Role | undefined) ?? "CUSTOMER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}