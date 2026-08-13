import type { Metadata } from "next";
import { StaticPage } from "@/components/ui/static-page";

export const metadata: Metadata = { title: "Returns & Refunds", robots: { index: false } };

export default function ReturnsPage() {
  return (
    <StaticPage eyebrow="Policy" title="Returns & Refunds">
      <p>
        Because every swing is handcrafted to order, returns are limited. We
        want you to love your piece through and through.
      </p>
      <h2 className="font-display text-xl text-ink">What is covered</h2>
      <p>
        Wrong item delivered, damaged-in-transit, or a clear manufacturing
        defect — report within 48 hours of delivery and we will arrange
        resolution or a replacement as appropriate.
      </p>
      <h2 className="font-display text-xl text-ink">Custom orders</h2>
      <p>
        Custom pieces built to your specification cannot be returned once
        production begins, as they are made to order for your space.
      </p>
      <h2 className="font-display text-xl text-ink">Refunds</h2>
      <p>
        Approved refunds are processed to the original payment method within
        7 working days.
      </p>
    </StaticPage>
  );
}