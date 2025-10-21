import React from "react";

import Card from "../../ui/Card";
import Container from "../../ui/Container";
import Section from "../../ui/Section";

export interface BlogPostSummary {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly readingMinutes: number;
}

/**
 * Static list of posts used by the marketing blog. Real content will later be
 * sourced from CMS, but for the prelaunch we keep curated entries in code.
 */
export const BLOG_POSTS: ReadonlyArray<BlogPostSummary> = [
  {
    slug: "first",
    title: "Как спланировать свадьбу без стресса",
    excerpt:
      "Разбираем ключевые шаги подготовки и показываем, какие инструменты экономят время молодой пары.",
    readingMinutes: 4,
  },
];

function BlogGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {BLOG_POSTS.map((post) => (
        <Card key={post.slug} title={post.title} className="h-full">
          <p className="text-sm text-[var(--fg)]/80">{post.excerpt}</p>
          <p className="small mt-3">Читать {post.readingMinutes} мин.</p>
          <a
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand)]/80"
          >
            Читать статью
            <span aria-hidden>→</span>
          </a>
        </Card>
      ))}
    </div>
  );
}

/**
 * Блог WeddingTech помогает рассказывать о прогрессе продукта и делиться
 * полезными советами с парами и вендорами.
 */
export default function BlogIndexPage() {
  return (
    <main className="bg-[var(--bg)]">
      <Container className="py-16">
        <Section
          title="Блог WeddingTech"
          description="Актуальные материалы о подготовке, маркетинге и инструментах для вендоров."
        >
          <BlogGrid />
        </Section>
      </Container>
    </main>
  );
}
