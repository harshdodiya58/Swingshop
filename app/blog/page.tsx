import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/queries";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Blog — Notes from the Workshop",
  description:
    "Buying guides, wood & material explainers, and care advice from the Shree Chamunda Swings workshop.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">The Workshop Notebook</span>
          <h1 className="font-display text-display-sm text-ink">Notes & guides</h1>
        </Container>
      </header>

      <Container className="py-14">
        {posts.length === 0 ? (
          <p className="text-center text-muted">Stories are being written. Check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group surface-cream overflow-hidden rounded-radius-card shadow-soft transition-shadow hover:shadow-hover"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden bg-ivory">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={640}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="eyebrow text-[10px] text-wood">{post.category}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {post.publishedAt?.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <h2 className="font-display text-xl leading-snug text-ink group-hover:text-wood-deep">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-6 text-muted line-clamp-3">{post.excerpt}</p>
                    <span className="mt-2 text-sm font-medium text-wood-deep">Read more</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}