import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "From raw timber to heirloom: the ten-stage process behind every Shree Chamunda swing.",
};

const stages = [
  "Raw Material", "Design", "Cutting", "Carving", "Welding",
  "Polishing", "Assembly", "Quality Check", "Packaging", "Delivery",
] as const;

export default function CraftsmanshipPage() {
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">The Process</span>
          <h1 className="font-display text-display-sm text-ink">
            Ten stages between a log and an heirloom
          </h1>
          <p className="max-w-xl text-muted">
            A walk through the workshop floor. Every stage is overseen by an
            artisan who signs off before the next begins.
          </p>
        </Container>
      </header>

      <Container className="py-14">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage, i) => (
            <li
              key={stage}
              className="surface-cream flex flex-col gap-3 rounded-radius-card p-6 shadow-soft"
            >
              <span className="font-display text-4xl text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg text-ink">{stage}</h3>
              <div className="mt-auto h-40 overflow-hidden rounded-lg bg-ivory">
                {/* Real photo/video slots for each stage */}
              </div>
              <p className="text-xs text-muted">
                [Placeholder media — add workshop photo/video here.]
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}