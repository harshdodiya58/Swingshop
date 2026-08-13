export const siteConfig = {
  name: "Shree Chamunda Swings",
  shortName: "Shree Chamunda",
  tagline: "Crafted for Tradition, Made for Modern Living",
  description:
    "Premium handcrafted wooden swings, manufactured in-house by our master artisans. Custom orders, pan-India delivery and a 5-year warranty on every piece.",
  url: "https://shreechamundaswings.com",
  locale: "en_IN",
  currency: "INR",

  contact: {
    phone: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    whatsapp: "+919876543210",
    whatsappHref: "https://wa.me/919876543210",
    email: "hello@shreechamundaswings.com",
    emailHref: "mailto:hello@shreechamundaswings.com",
    address: {
      line1: "Khasra No. 14, Jodhpur Road",
      city: "Jaipur, Rajasthan",
      pin: "302012",
      country: "India",
    },
  },

  nav: {
    primary: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Custom Order", href: "/custom-order" },
      { label: "Gallery", href: "/gallery" },
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },

  announcement: [
    "Handcrafted with Precision",
    "Free Delivery Across India",
    "5 Year Warranty",
  ],
} as const;

export const categoryNav = [
  { label: "Wooden Swings", slug: "wooden-swings", href: "/shop/wooden-swings" },
  { label: "Outdoor Swings", slug: "outdoor-swings", href: "/shop/outdoor-swings" },
  { label: "Indoor Swings", slug: "indoor-swings", href: "/shop/indoor-swings" },
  { label: "Metal Swings", slug: "metal-swings", href: "/shop/metal-swings" },
  { label: "Garden Swings", slug: "garden-swings", href: "/shop/garden-swings" },
  { label: "Hanging Chairs", slug: "hanging-chairs", href: "/shop/hanging-chairs" },
] as const;