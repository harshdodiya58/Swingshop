import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach the Shree Chamunda Swings workshop by call, WhatsApp, email or visit us in Jaipur.",
};

export default function ContactPage() {
  const channels = [
    {
      icon: Phone,
      label: "Call us",
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
      sub: "Mon–Sat · 9am – 7pm IST",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: siteConfig.contact.phone,
      href: siteConfig.contact.whatsappHref,
      sub: "Fastest reply · usually < 2 hrs",
    },
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: siteConfig.contact.emailHref,
      sub: "For quotes, orders & care",
    },
    {
      icon: MapPin,
      label: "Workshop",
      value: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.city}`,
      href: "#map",
      sub: `${siteConfig.contact.address.pin}, ${siteConfig.contact.address.country}`,
    },
  ] as const;

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Contact</span>
          <h1 className="font-display text-display-sm text-ink">Talk to the workshop</h1>
          <p className="max-w-xl text-muted">
            Questions about a piece, a custom build, or availability? We answer
            every message ourselves.
          </p>
        </Container>
      </header>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Channels */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {channels.map(({ icon: Icon, label, value, href, sub }) => (
              <a
                key={label}
                href={href}
                className="surface-cream flex items-start gap-4 rounded-radius-card p-5 shadow-soft transition-shadow hover:shadow-hover"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wood/10 text-wood">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="eyebrow text-[10px] text-wood">{label}</p>
                  <p className="mt-1 font-medium text-ink">{value}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="surface-cream rounded-radius-card p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-2xl text-ink">Send us a message</h2>
            <p className="mt-1 text-sm text-muted">
              We usually reply within one working day.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Map placeholder */}
        <div
          id="map"
          className="mt-12 flex h-72 items-center justify-center rounded-radius-card border border-dashed border-line bg-cream"
        >
          <p className="text-sm text-muted">
            Embedded Google Map — add your real workshop coordinates here.
          </p>
        </div>
      </Container>
    </div>
  );
}