import type { Metadata } from "next";
import { StaticPage } from "@/components/ui/static-page";

export const metadata: Metadata = { title: "Warranty", robots: { index: false } };

export default function WarrantyPage() {
  return (
    <StaticPage eyebrow="Promise" title="Our Warranty">
      <p>
        Every Shree Chamunda swing carries a structural warranty on its wooden
        frame. As the manufacturer, we stand behind the joinery, carving and
        finish that leave our workshop.
      </p>
      <h2 className="font-display text-xl text-ink">What is covered</h2>
      <p>
        Structural defects in the frame, joints or fittings under normal
        domestic use for the warranty period stated on the product page.
      </p>
      <h2 className="font-display text-xl text-ink">What is not covered</h2>
      <p>
        Wear from heavy outdoor exposure, misuse, accidental damage, or
        alterations made after delivery.
      </p>
      <p>
        Warranty terms shown here are placeholder copy and will be finalised
        with legal review before launch.
      </p>
    </StaticPage>
  );
}