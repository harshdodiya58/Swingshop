import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = { title: "Contact Inquiries — Admin", robots: { index: false } };

export default function AdminContactPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Contact Inquiries</h1>
        <p className="mt-1 text-sm text-muted">Messages submitted through the contact and product pages.</p>
      </div>
      <ContactClient />
    </div>
  );
}
