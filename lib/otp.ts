import { createHash, randomInt } from "crypto";
import { db } from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between resends
const OTP_LENGTH = 6;

export function hashOtpCode(code: string): string {
  return createHash("sha256").update(`scs:${code}`).digest("hex");
}

export function generateOtpCode(): string {
  // 6-digit numeric code, no leading-zero ambiguity handled by zero-padding.
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export async function createOtpCode(email: string): Promise<{
  code: string;
  resendInMs: number;
}> {
  const normalized = email.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email: normalized } });

  // Cooldown guard: block resends from the same email within 60s.
  const latest = await db.otpCode.findFirst({
    where: { email: normalized, usedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (latest) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      return { code: "", resendInMs: RESEND_COOLDOWN_MS - elapsed };
    }
  }

  const code = generateOtpCode();
  // Invalidate any previously-unused codes for this email.
  await db.otpCode.updateMany({
    where: { email: normalized, usedAt: null },
    data: { usedAt: new Date() },
  });

  await db.otpCode.create({
    data: {
      email: normalized,
      codeHash: hashOtpCode(code),
      userId: user?.id,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  return { code, resendInMs: 0 };
}

export async function verifyOtpCode(
  email: string,
  code: string,
): Promise<{ ok: boolean; userId?: string; error?: string }> {
  const normalized = email.trim().toLowerCase();
  const record = await db.otpCode.findFirst({
    where: { email: normalized, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { ok: false, error: "No active code found. Please request a new code." };
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "This code has expired. Please request a new one." };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Too many failed attempts. Please request a new code." };
  }

  if (record.codeHash !== hashOtpCode(code.trim())) {
    await db.otpCode.update({
      where: { id: record.id },
      data: { attempts: record.attempts + 1 },
    });
    return { ok: false, error: "Incorrect code. Please try again." };
  }

  await db.otpCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  return { ok: true, userId: record.userId ?? undefined };
}
