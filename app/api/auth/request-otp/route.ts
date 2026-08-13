import { NextResponse } from "next/server";
import { z } from "zod";
import { createOtpCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid email" },
      { status: 400 },
    );
  }
  const email = parsed.data.email.toLowerCase();

  try {
    const { code, resendInMs } = await createOtpCode(email);
    if (resendInMs > 0) {
      return NextResponse.json(
        { error: `Please wait ${Math.ceil(resendInMs / 1000)}s before requesting a new code`, resendInMs },
        { status: 429 },
      );
    }
    const sent = await sendOtpEmail({ to: email, code });

    // In development without SMTP the code is logged to the server console.
    // Surface it to the UI so the flow is testable before SMTP is configured.
    const devCode =
      !sent.delivered && process.env.NODE_ENV !== "production" ? code : undefined;

    return NextResponse.json({ ok: true, devCode, mode: sent.mode });
  } catch (e) {
    console.error("request-otp", e);
    return NextResponse.json(
      { error: "Could not send the code. Please try again." },
      { status: 500 },
    );
  }
}
