import type { Metadata } from "next";
import { StaticPage } from "@/components/ui/static-page";

export const metadata: Metadata = { title: "Terms & Conditions", robots: { index: false } };

export default function TermsPage() {
  return (
    <StaticPage eyebrow="Legal" title="Terms & Conditions">
      <p>
        By using this website and placing an order, you agree to these terms.
        All products are handcrafted to order in our workshop in India.
      </p>
      <h2 className="font-display text-xl text-ink">Orders & payment</h2>
      <p>
        An order is confirmed only after payment is verified. Prices are shown
        in Indian Rupees (₹) inclusive of applicable taxes unless stated
        otherwise.
      </p>
      <h2 className="font-display text-xl text-ink">Custom orders</h2>
      <p>
        Custom orders are non-cancellable once production begins, as they are
        built to your specification.
      </p>
      <p>
        These terms are placeholder copy and will be finalised with legal
        review before launch.
      </p>
    </StaticPage>
  );
}