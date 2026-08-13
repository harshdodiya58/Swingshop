import Link from "next/link";
import {
  Phone, Mail, MapPin,
  Hammer, Palette, Truck, ShieldCheck, BadgeCheck,
} from "lucide-react";
import { siteConfig, categoryNav } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "./newsletter-form";

const trustItems = [
  { icon: Hammer, label: "Handcrafted" },
  { icon: Palette, label: "Custom Made" },
  { icon: Truck, label: "Free Delivery" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: BadgeCheck, label: "5-Year Warranty" },
] as const;

const shopLinks = [
  { label: "All Swings", href: "/shop" },
  ...categoryNav.map((c) => ({ label: c.label, href: c.href })),
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Custom Order", href: "/custom-order" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Warranty", href: "/warranty" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-sage text-ivory">
      {/* Newsletter band */}
      <div className="border-b border-ivory/15">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-2xl text-ivory sm:text-3xl">
              Heirloom stories, straight to your inbox
            </h2>
            <p className="mt-2 text-sm text-ivory/70">
              New collections, workshop updates and care guides. No noise.
            </p>
          </div>
          <NewsletterForm />
        </Container>
      </div>

      {/* Trust strip */}
      <div className="border-b border-ivory/15">
        <Container className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-gold" aria-hidden />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Logo tone="light" />
          <p className="max-w-sm text-sm leading-6 text-ivory/75">
            We don&apos;t just build swings. We build heirlooms — manufactured
            in-house by master artisans, delivered across India.
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: "Facebook", href: "#", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { label: "Instagram", href: "#", path: "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm-4 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM17.5 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" },
              { label: "YouTube", href: "#", path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48L15.5 11.5z" },
            ].map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-ivory/20 p-2 transition-colors hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <FooterCol title="Shop" links={shopLinks} />
        <FooterCol title="Company" links={companyLinks} />
        <FooterCol title="Support" links={supportLinks} />
      </Container>

      {/* Contact row */}
      <div className="border-t border-ivory/15">
        <Container className="grid gap-4 py-10 text-sm text-ivory/75 sm:grid-cols-3">
          <a href={siteConfig.contact.phoneHref} className="flex items-center gap-3 hover:text-gold">
            <Phone className="h-4 w-4 text-gold" aria-hidden />
            {siteConfig.contact.phone}
          </a>
          <a href={siteConfig.contact.emailHref} className="flex items-center gap-3 hover:text-gold">
            <Mail className="h-4 w-4 text-gold" aria-hidden />
            {siteConfig.contact.email}
          </a>
          <span className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gold" aria-hidden />
            {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}
          </span>
        </Container>
      </div>

      {/* Legal */}
      <div className="border-t border-ivory/15">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-ivory/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>
            Shop openings, stock and figures shown are placeholders pending real
            business data.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="eyebrow mb-5 text-gold">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ivory/75 transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}