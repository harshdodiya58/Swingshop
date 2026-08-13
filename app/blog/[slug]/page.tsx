import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries";
import { Container } from "@/components/ui/container";
import { article as structuredArticle } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const schema = structuredArticle(post, `${siteConfig.url}/blog/${post.slug}`);

  return (
    <div className="bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Container className="mx-auto max-w-3xl py-14">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-wood-deep">Home</Link>
          <span className="mx-2" aria-hidden>/</span>
          <Link href="/blog" className="hover:text-wood-deep">Blog</Link>
        </nav>

        <p className="eyebrow text-wood">{post.category}</p>
        <h1 className="font-display text-display-sm mt-3 text-ink">{post.title}</h1>
        <p className="mt-4 flex items-center gap-3 text-sm text-muted">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt?.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </p>

        <div className="my-8 overflow-hidden rounded-radius-card bg-cream shadow-card">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={960}
            height={540}
            className="h-auto w-full object-cover"
          />
        </div>

        <article className="prose prose-ivory max-w-none">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("# ")) {
              return (
                <h2 key={i} className="font-display mt-8 mb-3 text-2xl text-ink">
                  {line.slice(2)}
                </h2>
              );
            }
            if (line.trim() === "") return <div key={i} className="h-4" />;
            return (
              <p key={i} className="mb-4 leading-7 text-ink/85">
                {line}
              </p>
            );
          })}
        </article>
      </Container>
    </div>
  );
}