import type { Metadata } from "next";
import { StaticPage } from "@/components/ui/static-page";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <StaticPage eyebrow="Legal" title="Privacy Policy">
      <p>
        We collect only what we need to process your order and respond to your
        enquiries: name, contact details, and order information. Payment details
        are handled by Razorpay — we never store your card number.
      </p>
      <h2 className="font-display text-xl text-ink">What we do with your data</h2>
      <p>
        Your information is used for order fulfilment, customer support and,
        if you opt in, occasional product updates. We do not sell personal data.
      </p>
      <h2 className="font-display text-xl text-ink">Your rights</h2>
      <p>
        You may request a copy, correction, or deletion of your personal data
        at any time by contacting us. This policy is placeholder copy pending
        final legal review.
      </p>
    </StaticPage>
  );
}