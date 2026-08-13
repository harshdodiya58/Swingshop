import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shree Chamunda Swings is a family-owned workshop in Jaipur manufacturing handcrafted wooden swings for over two decades.",
};

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Our Story</span>
          <h1 className="font-display text-display-sm text-ink">
            A family workshop that refuses to rush
          </h1>
        </Container>
      </header>

      <Container className="py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-radius-card bg-cream shadow-card">
            <Image
              src="https://picsum.photos/seed/about-workshop/900/700"
              alt="Woodworking workshop interior with tools and timber (placeholder)"
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-lg leading-8 text-ink/85">
              Shree Chamunda Swings began as a single workbench where the
              founder&apos;s father shaped his first jhula. Today the same family
              operates the shop — cutting, carving, welding and finishing
              every swing under one roof.
            </p>
            <p className="leading-7 text-muted">
              We haven&apos;t outsourced a single piece. That is what lets us
              promise a structural warranty on every frame, build to your
              dimensions, and keep a record of each order in our books —
              because we are the ones who made it.
            </p>
            <p className="leading-7 text-muted">
              Our workshop details, team size, and years of operation will be
              updated here with real figures before we launch.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "One roof", desc: "From raw log to finished piece, under our own supervision." },
            { title: "Hand joinery", desc: "Mortise-and-tenon construction; no shortcuts with screws." },
            { title: "Responsible wood", desc: "Sourced from verified, legal timber channels." },
            { title: "Direct to you", desc: "We're the manufacturer — no middlemen between you and the bench." },
          ].map((v) => (
            <div key={v.title} className="surface-cream rounded-radius-card p-6 shadow-soft">
              <h3 className="font-display text-lg text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}