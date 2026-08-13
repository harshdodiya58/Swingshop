import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CustomOrderForm } from "./custom-order-form";

export const metadata: Metadata = {
  title: "Custom Order",
  description:
    "Dream it, we build it. Share your space, size and story — our artisans will craft a one-of-a-kind swing for your home.",
};

export default function CustomOrderPage() {
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Custom Orders</span>
          <h1 className="font-display text-display-sm text-ink">Dream it. We build it.</h1>
          <p className="max-w-xl text-muted">
            Not finding your shape in the collection? Tell us about your space
            and your story. Our artisan team reviews every request personally
            and sends a hand-drawn proposal and quote.
          </p>
        </Container>
      </header>

      <Container className="py-14">
        <CustomOrderForm />
      </Container>
    </div>
  );
}