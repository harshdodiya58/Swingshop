import type { Metadata } from "next";
import { StaticPage } from "@/components/ui/static-page";

export const metadata: Metadata = { title: "Shipping & Delivery", robots: { index: false } };

export default function ShippingPage() {
  return (
    <StaticPage eyebrow="Policy" title="Shipping & Delivery">
      <p>
        We craft every piece to order and ship across India. Orders are typically
        dispatched within 7–14 working days of confirmation, depending on the
        product and finish.
      </p>
      <h2 className="font-display text-xl text-ink">Delivery charges</h2>
      <p>
        Delivery is free on orders over a threshold. A nominal shipping fee
        applies below it and is shown clearly at checkout before you pay.
      </p>
      <h2 className="font-display text-xl text-ink">Packaging & transit</h2>
      <p>
        Swings are professionally crated and delivered by trusted courier
        partners. Damage during transit is covered — inspect your shipment on
        arrival and report any damage within 48 hours.
      </p>
    </StaticPage>
  );
}