import { siteConfig } from "@/lib/site";

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.line1,
      addressLocality: siteConfig.contact.address.city,
      postalCode: siteConfig.contact.address.pin,
      addressCountry: "IN",
    },
  };
}

export function localBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.line1,
      addressLocality: siteConfig.contact.address.city,
      postalCode: siteConfig.contact.address.pin,
      addressCountry: "IN",
    },
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function product(
  product: {
    name: string;
    shortDescription: string;
    sku: string;
    images: string[];
    price: number;
    stock: number;
    rating: number;
    reviewCount: number;
    reviews?: { rating: number; user: { name: string | null } | null }[];
  },
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    url,
    image: product.images,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    ...(product.reviews?.length
      ? {
          review: product.reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
            author: { "@type": "Person", name: r.user?.name ?? "Verified buyer" },
          })),
        }
      : {}),
  };
}

export function article(
  post: {
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt: Date | null;
    updatedAt: Date;
    author: string;
  },
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: url,
  };
}