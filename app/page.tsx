import Image from "next/image";
import Link from "next/link";
import {
  Hammer, PenTool, Truck, ShieldCheck, BadgeCheck,
  ArrowRight, Play, Star, Leaf,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCategories,
  getFeaturedProducts,
  getBestsellers,
  getBlogPosts,
} from "@/lib/queries";

const trustItems = [
  { icon: Hammer, label: "Handcrafted", sub: "By master artisans" },
  { icon: PenTool, label: "Custom Made", sub: "Your vision, built" },
  { icon: Truck, label: "Free Delivery", sub: "Across India" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "Razorpay verified" },
  { icon: BadgeCheck, label: "5-Year Warranty", sub: "On every frame" },
] as const;

// Stats are DEVELOPMENT PLACEHOLDERS — editable via admin CMS before launch.
const stats = [
  { value: 2500, suffix: "+", label: "Happy Customers" },
  { value: 1200, suffix: "+", label: "Custom Designs" },
  { value: 40, suffix: "+", label: "Expert Artisans" },
  { value: 25, suffix: "yrs", label: "Years of Legacy" },
] as const;

const processSteps = [
  { step: "01", title: "Select Wood", desc: "Seasoned teak, sheesham or mango — hand-picked per piece." },
  { step: "02", title: "Hand Craft", desc: "Carving, mortise-and-tenon joinery, brass hardware." },
  { step: "03", title: "Assemble", desc: "Frame, seat, canopy and hanging kit fitted precisely." },
  { step: "04", title: "Finish", desc: "PU polish or hand-rubbed oil in your chosen tone." },
  { step: "05", title: "Quality Check", desc: "Every joint, hinge and finish inspected before delivery." },
] as const;

export default async function HomePage() {
  const [categories, featured, bestsellers, posts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBestsellers(4),
    getBlogPosts({ take: 3 }),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full bg-wood/10 blur-3xl"
        />
        <Container className="relative grid min-h-[80vh] items-center gap-14 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="flex flex-col items-start gap-6 lg:max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-wood/20 bg-cream px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-wood-deep shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Manufacturer-owned · Jaipur, India
            </span>
            <h1 className="font-display text-display-md text-ink">
              Crafted for Tradition,
              <br />
              <span className="italic text-wood-deep">Made for Modern Living</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted">
              We are a family workshop that designs and builds heirloom swings
              by hand — not a marketplace. Every piece is cut, carved, joined
              and finished under our own roof.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/shop" size="lg">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/craftsmanship" size="lg" variant="outline">
                <Play className="h-4 w-4 fill-current" />
                Play Story
              </ButtonLink>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted">
              <span className="flex text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </span>
              <span>Trusted by families across 25+ Indian states</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-radius-card border border-gold/30" aria-hidden />
            <div className="relative overflow-hidden rounded-radius-card shadow-card">
              <Image
                src="https://images.pexels.com/photos/13208707/pexels-photo-13208707.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Handcrafted wooden swing hanging beneath sunlit trees in a lush garden"
                width={1100}
                height={1300}
                priority
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-sage/30 via-transparent to-transparent"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-radius-card bg-wood-deep px-5 py-4 text-ivory shadow-hover sm:flex">
              <ShieldCheck className="h-7 w-7 text-gold" aria-hidden />
              <div>
                <p className="font-display text-xl leading-tight">5-Year</p>
                <p className="text-xs text-ivory/80">structural warranty</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Trust bar */}
      <section className="border-y border-line bg-cream">
        <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-6 w-6 text-wood" aria-hidden />
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-muted">{sub}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* 3. Stats band (sage) */}
      <section className="bg-sage py-16 text-ivory">
        <Container className="grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
              <p className="font-display text-4xl text-gold sm:text-5xl">
                {s.value.toLocaleString("en-IN")}
                <span className="text-2xl">{s.suffix}</span>
              </p>
              <p className="text-sm tracking-wide text-ivory/75">{s.label}</p>
            </div>
          ))}
        </Container>
        <p className="mt-8 text-center text-xs text-ivory/45">
          Figures shown are placeholders pending real business data.
        </p>
      </section>

      {/* 4. Shop by category */}
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Shop by Category"
            title="Find your perfect jhula"
            description="Six families of swings we design, build and deliver ourselves."
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {categories.map((c) => c.image && (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="group relative overflow-hidden rounded-radius-card shadow-soft transition-shadow hover:shadow-hover"
              >
                <div className="aspect-[1/1.1] w-full overflow-hidden bg-ivory">
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={600}
                    height={660}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-sage/90 to-transparent p-5 text-ivory">
                  <div>
                    <h3 className="font-display text-xl">{c.name}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
            <Link
              href="/shop"
              className="group flex aspect-[1/1.1] flex-col items-center justify-center gap-3 rounded-radius-card border border-line bg-cream text-center transition-colors hover:border-wood hover:bg-cream"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wood/10 text-wood transition-colors group-hover:bg-wood group-hover:text-white">
                <ArrowRight className="h-6 w-6" />
              </span>
              <span className="font-display text-lg text-ink">View all swings</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. Best sellers */}
      <section className="bg-cream py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Best Sellers"
            title="The pieces our customers love"
            align="left"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Craftsmanship */}
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Craftsmanship"
            title="We don't just build swings. We build heirlooms."
            description="Five disciplined stages between a seasoned log and a piece your grandchildren will argue over."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((s, i) => (
              <div
                key={s.step}
                className="surface-cream relative flex flex-col gap-3 rounded-radius-card p-6 shadow-soft"
              >
                <span className="font-display text-3xl text-gold">{s.step}</span>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="text-sm leading-6 text-muted">{s.desc}</p>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gold lg:block" aria-hidden />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <ButtonLink href="/craftsmanship" variant="outline">
              See the full process
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 7. Custom order teaser */}
      <section className="bg-wood-deep py-20 text-ivory">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-gold">Custom Orders</span>
            <h2 className="font-display text-display-sm mt-4 text-ivory">
              Dream it. We build it.
            </h2>
            <p className="mt-4 max-w-lg text-ivory/80">
              Not finding your shape? Tell us your space, your size and your
              story. Our artisans will hand-draw it, quote it, and craft a
              one-of-a-kind swing for your home.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {["Size", "Wood", "Finish", "Color", "Cushion"].map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-ivory/30 px-4 py-1.5 text-sm text-ivory/85"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <ButtonLink href="/custom-order" size="lg" variant="gold" className="mt-8">
              Start Custom Order
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="order-first overflow-hidden rounded-radius-card lg:order-none">
            <Image
              src="https://images.pexels.com/photos/34560141/pexels-photo-34560141.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Rustic handcrafted wooden swing on a hilltop with a clear blue sky"
              width={900}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* 8. Blog preview */}
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="From the Workshop" title="Notes & guides" />
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group surface-cream overflow-hidden rounded-radius-card shadow-soft transition-shadow hover:shadow-hover"
              >
                <div className="aspect-[16/10] overflow-hidden bg-ivory">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={640}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <p className="eyebrow text-[10px] text-wood">{post.category}</p>
                  <h3 className="font-display text-lg leading-snug text-ink group-hover:text-wood-deep">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 9. Feature: featured products strip */}
      <section className="border-t border-line bg-cream py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="Signature Pieces" title="Featured for you" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="flex justify-center">
            <ButtonLink href="/shop" variant="outline">
              Browse the full collection
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Sustainability note */}
      <section className="py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <Leaf className="h-8 w-8 text-wood" aria-hidden />
          <p className="max-w-2xl font-display text-2xl text-ink">
            Responsibly sourced wood. Zero-waste workshop. A piece a day,
            built to outlive trends.
          </p>
        </Container>
      </section>
    </>
  );
}