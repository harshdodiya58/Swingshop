import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

/**
 * MEDIA NOTE:
 * Imagery uses real wooden-swing photography served from the Pexels CDN
 * (images.pexels.com, hotlinking allowed, commercially usable). Photo IDs map
 * to verified Pexels photos; per-category pools rotate across product images.
 * Business claims (years, counts, warranty phrasing) are DEVELOPMENT
 * PLACEHOLDERS controlled via admin CMS.
 */

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

// Curated real wooden-swing photography per category (verified working).
const PHOTOS: Record<string, number[]> = {
  "wooden-swings": [
    13208707, 16522205, 13698509, 33005556, 18140887, 32112327, 14011555,
    12837676, 10205756, 14011552, 28458290,
  ],
  "outdoor-swings": [
    19897415, 12837676, 10205756, 16360836, 16522205, 18140887, 14011552,
    33005556, 13698509, 33749440, 14011555,
  ],
  "indoor-swings": [
    29052539, 28458290, 13208707, 16522205, 32112327, 18140887, 13698509,
    16360836,
  ],
  "metal-swings": [283934, 10205756, 14011552, 28458290, 16522205],
  "garden-swings": [
    34560141, 12837676, 19897415, 18140887, 33005556, 14011555, 33749440,
    32112327,
  ],
  "hanging-chairs": [32112327, 29052539, 13698509, 14011555, 10205756, 16522205],
};

const categories = [
  {
    slug: "wooden-swings",
    name: "Wooden Swings",
    description:
      "Handcrafted swings in sheesham, teak and mango wood with carved pillars and caned seats.",
    image: px(13208707, 900),
    sortOrder: 1,
  },
  {
    slug: "outdoor-swings",
    name: "Outdoor Swings",
    description:
      "Weather-resistant garden and veranda swings built for Indian summers and monsoons.",
    image: px(16360836, 900),
    sortOrder: 2,
  },
  {
    slug: "indoor-swings",
    name: "Indoor Swings",
    description:
      "Compact and elegant swings for living rooms, balconies and reading nooks.",
    image: px(29052539, 900),
    sortOrder: 3,
  },
  {
    slug: "metal-swings",
    name: "Metal Swings",
    description:
      "Wrought-iron and powder-coated metal swings with adjustable chains.",
    image: px(283934, 900),
    sortOrder: 4,
  },
  {
    slug: "garden-swings",
    name: "Garden Swings",
    description:
      "Jhula as a landscape piece — large garden swings, cottages and loungers.",
    image: px(34560141, 900),
    sortOrder: 5,
  },
  {
    slug: "hanging-chairs",
    name: "Hanging Chairs",
    description:
      "Suspended chairs and macramé pedestal chairs for corners that need an accent.",
    image: px(14011555, 900),
    sortOrder: 6,
  },
] as const;

function product(
  c: (typeof categories)[number]["slug"],
  i: number,
  overrides: Partial<{
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription: string;
    price: number;
    size: string;
    colors: string[];
    finishes: string[];
    material: string;
    dimensions: object;
    weightKg: number;
    featured: boolean;
    bestseller: boolean;
  }> = {},
) {
  const sizes = ["3 Seater", "4 Seater", "5 Seater"];
  const pool = PHOTOS[c] ?? [];
  const primary = pool[(i - 1) % pool.length] ?? 13208707;
  const second = pool[(i + 1) % pool.length] ?? 12837676;
  const third = pool[(i + 2) % pool.length] ?? 16522205;
  return {
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    price: 25000,
    material: "Sheesham Wood",
    sizes,
    colors: ["Natural", "Walnut", "Espresso"],
    finishes: ["Satin Matte", "PU Polish", "Hand-Rubbed Oil"],
    images: [px(primary, 1200), px(second, 1200), px(third, 900)],
    shippingInfo:
      "Delivered across India within 7-14 working days. Crafted after order.",
    warranty: "5 year structural warranty on the wooden frame.",
    weightKg: 42,
    dimensions: {
      w: 193,
      d: 91,
      h: 198,
    },
    stock: 4,
    ...overrides,
  };
}

const productSeed: Record<string, ReturnType<typeof product>[]> = {
  "wooden-swings": [
    product("wooden-swings", 1, {
      name: "Royal Teak Wooden Swing",
      slug: "royal-teak-wooden-swing",
      sku: "SCS-WS-001",
      price: 48500,
      material: "Burma Teak",
      shortDescription:
        "Solid teak frame with carved pillars, brass accents and a hand-caned seat.",
      description:
        "Our signature heirloom piece. The frame is carved from seasoned Burma teak, joined with mortise-and-tenon construction and finished with a hand-rubbed PU polish. Brass hardware, hand-caned seat, and a deep seat depth designed for hours of easy rocking.",
      bestseller: true,
      featured: true,
    }),
    product("wooden-swings", 2, {
      name: "Sheesham Carved Jhula",
      slug: "sheesham-carved-jhula",
      sku: "SCS-WS-002",
      price: 39800,
      material: "Sheesham Wood",
      shortDescription:
        "Classic Rajasthani jhula with hand-carved peacock backrest and caned seat.",
      bestseller: true,
    }),
    product("wooden-swings", 3, {
      name: "Minimal Kota Oak Swing",
      slug: "minimal-kota-oak-swing",
      sku: "SCS-WS-003",
      price: 32900,
      material: "Oak",
      shortDescription:
        "Clean linear form for contemporary homes. Oiled finish, no carving.",
      featured: true,
    }),
    product("wooden-swings", 4, {
      name: "Double Seater Canopy Swing",
      slug: "double-seater-canopy-swing",
      sku: "SCS-WS-004",
      price: 56500,
      material: "Teak",
      shortDescription:
        "Full canopy with carved lintel — a statement piece for courtyards and verandas.",
    }),
    product("wooden-swings", 5, {
      name: "Baby Wooden Jhoola",
      slug: "baby-wooden-jhoola",
      sku: "SCS-WS-005",
      price: 12800,
      size: "Single Seater",
      material: "Mango Wood",
      shortDescription:
        "Compact cradle-style newborn jhoola with rounded edges and cotton padding.",
    }),
  ],
  "outdoor-swings": [
    product("outdoor-swings", 1, {
      name: "Weatherguard Garden Swing",
      slug: "weatherguard-garden-swing",
      sku: "SCS-OS-001",
      price: 52400,
      material: "UV-Treated Teak",
      shortDescription:
        "Outdoor-treated frame, waterproof cushion and recessed canopy.",
      bestseller: true,
    }),
    product("outdoor-swings", 2, {
      name: "Veranda Three Seater Swing",
      slug: "veranda-three-seater-swing",
      sku: "SCS-OS-002",
      price: 47300,
      material: "Sheesham Wood",
      shortDescription:
        "Deep three-seater with a galvanised chain kit and cast-iron hangers.",
      featured: true,
    }),
    product("outdoor-swings", 3, {
      name: "Balcony Compact Swing",
      slug: "balcony-compact-swing",
      sku: "SCS-OS-003",
      price: 21900,
      material: "Engineered Wood",
      shortDescription:
        "Space-saver swing sized for urban balconies without compromising comfort.",
    }),
    product("outdoor-swings", 4, {
      name: "Rooftop Lounger Swing",
      slug: "rooftop-lounger-swing",
      sku: "SCS-OS-004",
      price: 61800,
      material: "Teak + Synthetic Rattan",
      shortDescription:
        "Wide lounger with reclining backrest — built for rooftop seasons.",
    }),
  ],
  "indoor-swings": [
    product("indoor-swings", 1, {
      name: "Ivory Room Swing",
      slug: "ivory-room-swing",
      sku: "SCS-IS-001",
      price: 29500,
      material: "Light Oak",
      shortDescription:
        "Bright two-seater for interiors, with a cushion in ivory linen.",
      bestseller: true,
    }),
    product("indoor-swings", 2, {
      name: "Reading Nook Hanging Swing",
      slug: "reading-nook-hanging-swing",
      sku: "SCS-IS-002",
      price: 22800,
      material: "Mango Wood",
      shortDescription:
        "Single-seat swing with a side shelf for books and chai.",
      featured: true,
    }),
    product("indoor-swings", 3, {
      name: "Compact Apartment Swing",
      slug: "compact-apartment-swing",
      sku: "SCS-IS-003",
      price: 18900,
      material: "Engineered Wood",
      shortDescription:
        "Narrow profile fit for doorways and small living rooms.",
    }),
  ],
  "metal-swings": [
    product("metal-swings", 1, {
      name: "Wrought Iron Classic Swing",
      slug: "wrought-iron-classic-swing",
      sku: "SCS-MS-001",
      price: 36900,
      material: "Wrought Iron",
      shortDescription:
        "Hand-forged iron frame with powder coating and adjustable chain height.",
      featured: true,
    }),
    product("metal-swings", 2, {
      name: "Black Metal With Teak Slat Swing",
      slug: "black-metal-teak-slat-swing",
      sku: "SCS-MS-002",
      price: 41200,
      material: "Iron + Teak Slats",
      shortDescription:
        "Industrial-craft hybrid — matte black iron with warm teak slat seating.",
      bestseller: true,
    }),
  ],
  "garden-swings": [
    product("garden-swings", 1, {
      name: "Maharaja Garden Cradle",
      slug: "maharaja-garden-cradle",
      sku: "SCS-GS-001",
      price: 74500,
      material: "Teak",
      shortDescription:
        "Full-length relaxer with canopy, footrest and folding side table.",
      featured: true,
    }),
    product("garden-swings", 2, {
      name: "Courtyard Duo Swing",
      slug: "courtyard-duo-swing",
      sku: "SCS-GS-002",
      price: 48700,
      material: "Sheesham Wood",
      shortDescription:
        "Two-person swing on a freestanding steel frame for courtyard gardens.",
    }),
    product("garden-swings", 3, {
      name: "Pergola Swing Pod",
      slug: "pergola-swing-pod",
      sku: "SCS-GS-003",
      price: 66800,
      material: "Teak + Rattan",
      shortDescription:
        "Egg-shaped lounger intended to hang from a pergola beam.",
    }),
  ],
  "hanging-chairs": [
    product("hanging-chairs", 1, {
      name: "Macramé Hanging Chair",
      slug: "macrame-hanging-chair",
      sku: "SCS-HC-001",
      price: 16900,
      size: "Single Seater",
      material: "Cotton Rope + Wood",
      shortDescription:
        "Hand-knotted macramé chair with a solid wood seat and cushion.",
      bestseller: true,
    }),
    product("hanging-chairs", 2, {
      name: "Rattan Dome Hanging Chair",
      slug: "rattan-dome-hanging-chair",
      sku: "SCS-HC-002",
      price: 24800,
      size: "Single Seater",
      material: "Natural Rattan",
      shortDescription:
        "Round rattan dome with a padded cushion — boho accent for any room.",
    }),
  ],
};

const blogPosts = [
  {
    title: "How to Choose the Perfect Swing for Your Home",
    slug: "how-to-choose-perfect-swing",
    excerpt:
      "Size, wood, placement and load — a practical guide to picking a swing your family will use for years.",
    author: "Chamunda Craft Team",
    category: "Buying Guide",
    tags: ["swings", "buying-guide", "wood"],
    coverImage: px(18140887, 1400),
    published: true,
    publishedAt: new Date("2026-01-18"),
    content: `# How to choose the perfect swing\n\n\nChoosing a swing starts with the space, not the catalogue. Measure the length of the installation beam or frame, decide how many people will use it daily, and only then shortlist woods.\n\n## Measure before you dream\n\nA three-seater swing needs roughly 193 cm of beam width. A compact balcony swing can work in half that. Always leave 15-20 cm clearance on the swing arc.\n\n## Wood matters\n\nTeak wins on weather resistance. Sheesham on density and carving detail. Mango wood is the value pick for indoor pieces.\n\n## Our recommendation\n\nIf you are torn, start with a sheesham swing with a caned seat — it is the most forgiving choice across Indian homes.`,
  },
  {
    title: "Teak vs Sheesham: A Craftsman's Honest Answer",
    slug: "teak-vs-sheesham",
    excerpt:
      "We work in both woods daily. Here is when each genuinely earns its place in your home.",
    author: "Chamunda Craft Team",
    category: "Wood & Materials",
    tags: ["teak", "sheesham", "material"],
    coverImage: px(33005556, 1400),
    published: true,
    publishedAt: new Date("2026-02-04"),
    content: `# Teak vs Sheesham\n\n\nBoth are dense, oily hardwoods and both live for decades. The difference shows up in use.\n\n## Teak\n\nLower maintenance outdoors, naturally resistant to termites, and a calm golden tone.\n\n## Sheesham\n\nHarder density, richer grain, superb carving behaviour — our artisans prefer it for ornate work — but it behaves best under a roof.\n\n## The honest answer\n\nIndoors, sheesham. Outdoors, teak. If budget is the constraint, teak-look mango wood indoors is a fine fallback.`,
  },
  {
    title: "Caring for Wooden Swings Across Indian Seasons",
    slug: "caring-for-wooden-swings",
    excerpt:
      "Heat, humidity and dust are harder on furniture than people are. A short maintenance routine for each season.",
    author: "Chamunda Craft Team",
    category: "Care & Maintenance",
    tags: ["care", "maintenance", "season"],
    coverImage: px(29052539, 1400),
    published: true,
    publishedAt: new Date("2026-03-12"),
    content: `# Caring for your swing\n\n\nA lightly maintained swing outlasts generations.\n\n## Monsoon\n\nWipe the frame dry after rain. For outdoor pieces, apply a thin coat of Danish oil once before the season starts.\n\n## Summer\n\nKeep polished pieces away from direct glare for long hours. Oiled finishes breathe with humidity swings — that is normal.\n\n## All year\n\nDust with a dry cotton cloth; clean caned seats with a soft brush. Tighten hanging hardware every six months.`,
  },
] as const;

const galleryImages = [
  { title: "Teak swing in a Jaipur courtyard", category: "Customer Homes", image: px(34560141) },
  { title: "Carving block — artisan at work", category: "Wooden", image: px(16360836) },
  { title: "Outdoor weatherguard on a lawn", category: "Outdoor", image: px(19897415) },
  { title: "Rattan dome in a reading corner", category: "Indoor", image: px(29052539) },
  { title: "Wrought iron classic on a veranda", category: "Metal", image: px(283934) },
  { title: "Custom royal cradle for a wedding order", category: "Custom Orders", image: px(12837676) },
] as const;

async function main() {
  console.log("Seeding Shree Chamunda Swings…");

  // Categories
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image, sortOrder: c.sortOrder },
      create: { ...c },
    });
  }

  // Products
  let productCount = 0;
  for (const [catSlug, prods] of Object.entries(productSeed)) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: catSlug } });
    for (const p of prods) {
      const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
      if (exists) {
        await prisma.product.update({
          where: { slug: p.slug },
          data: {
            name: p.name, sku: p.sku, description: p.description,
            shortDescription: p.shortDescription, price: p.price,
            material: p.material, images: p.images, categoryId: category.id,
            sizes: p.sizes, colors: p.colors, finishes: p.finishes,
            shippingInfo: p.shippingInfo, warranty: p.warranty,
            weightKg: p.weightKg, dimensions: p.dimensions as object | undefined,
            stock: p.stock, isFeatured: p.featured, isBestseller: p.bestseller,
          },
        });
        continue;
      }
      await prisma.product.create({
        data: {
          name: p.name, slug: p.slug, sku: p.sku, description: p.description,
          shortDescription: p.shortDescription, price: p.price,
          material: p.material, dimensions: p.dimensions as object | undefined,
          weightKg: p.weightKg, sizes: p.sizes, colors: p.colors, finishes: p.finishes,
          images: p.images, shippingInfo: p.shippingInfo, warranty: p.warranty,
          stock: p.stock, isFeatured: p.featured, isBestseller: p.bestseller,
          categoryId: category.id,
        },
      });
      productCount++;
    }
  }

  // Blog posts
  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: { title: b.title, excerpt: b.excerpt, content: b.content, author: b.author, category: b.category, tags: [...b.tags], coverImage: b.coverImage, published: b.published, publishedAt: b.publishedAt },
      create: { ...b, tags: [...b.tags] },
    });
  }

  // Gallery (upsert keeps titles, refreshes image/alt)
  for (const [i, g] of galleryImages.entries()) {
    const existing = await prisma.galleryImage.findFirst({
      where: { title: g.title },
    });
    if (existing) {
      await prisma.galleryImage.update({
        where: { id: existing.id },
        data: { category: g.category, image: g.image, alt: g.title },
      });
      continue;
    }
    await prisma.galleryImage.create({
      data: { ...g, alt: g.title, sortOrder: i + 1, featured: i === 0 },
    });
  }

  // Admin account (DEVELOPMENT PLACEHOLDER credentials — change before launch)
  const admin = await prisma.user.upsert({
    where: { email: "admin@shreechamundaswings.com" },
    update: {
      role: "ADMIN",
      // bcrypt hash of "changeme-admin" — matches Credentials provider compare in lib/auth.ts
      passwordHash: await hash("changeme-admin", 10),
    },
    create: {
      name: "Site Administrator",
      email: "admin@shreechamundaswings.com",
      // bcrypt hash of "changeme-admin" — matches Credentials provider compare in lib/auth.ts
      passwordHash: await hash("changeme-admin", 10),
      role: "ADMIN",
      phone: "9000000000",
    },
  });

  console.log(`Seeded: ${categories.length} categories, ${productCount} products, ${blogPosts.length} posts, ${galleryImages.length} gallery images, admin ${admin.email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });