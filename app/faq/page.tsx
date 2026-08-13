import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "FAQ",
  robots: { index: false },
};

const faqs = [
  {
    q: "How long does a swing take to build and deliver?",
    a: "Every swing is crafted to order. Delivery across India typically takes 7–14 working days after confirmation, plus a few days for courier transit.",
  },
  {
    q: "Do you deliver pan-India?",
    a: "Yes. Free delivery applies to orders above a threshold within India. A nominal shipping fee applies below it.",
  },
  {
    q: "Can you build a custom size?",
    a: "Yes — custom dimensions, wood, finish and cushion choices are our speciality. Start a custom order and we'll send a sketch and quote.",
  },
  {
    q: "What is the warranty?",
    a: "A 5-year structural warranty covers the wooden frame. Terms are shown at checkout and on the product page.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes, COD is available on many products subject to order value limits.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Help</span>
          <h1 className="font-display text-display-sm text-ink">Frequently asked questions</h1>
        </Container>
      </header>
      <Container className="mx-auto max-w-3xl py-14">
        <div className="flex flex-col gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="surface-cream rounded-radius-card p-6 shadow-soft">
              <summary className="cursor-pointer font-medium text-ink">{f.q}</summary>
              <p className="mt-3 text-sm leading-7 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </div>
  );
}