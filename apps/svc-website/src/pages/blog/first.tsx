import fs from "node:fs";
import path from "node:path";
import React from "react";

import Card from "../../ui/Card";
import Container from "../../ui/Container";

export interface BlogArticle {
  readonly title: string;
  readonly body: ReadonlyArray<string>;
  readonly readingMinutes: number;
  readonly sourcePath: string;
}

const FALLBACK_ARTICLE: BlogArticle = {
  title: "Как спланировать свадьбу без стресса",
  body: [
    "Подготовка к свадьбе занимает десятки часов и требует постоянной координации с подрядчиками. Мы собрали короткий план, который помогает парам распределить задачи и держать бюджет под контролем.",
    "Определите приоритеты и ключевую дату, чтобы быстрее выбрать площадку, составьте предварительный список гостей и ожидаемый бюджет, а затем используйте инструменты WeddingTech для поиска вендоров и управления платежами.",
    "Главное — не пытаться сделать всё в одиночку. Поручайте задачи, а систему подготовки держите в одном месте.",
  ],
  readingMinutes: 4,
  sourcePath: "",
};

function parseMarkdown(source: string, filePath: string): BlogArticle {
  const [rawTitle, ...chunks] = source.trim().split(/\n\s*\n/);
  const title = rawTitle.replace(/^#\s*/, "").trim();
  const body = chunks.map((chunk) => chunk.replace(/\n+/g, " ").trim()).filter(Boolean);
  const readingMinutes = Math.max(2, Math.round(source.split(/\s+/).length / 180));
  return { title: title || FALLBACK_ARTICLE.title, body, readingMinutes, sourcePath: filePath };
}

let cachedArticle: BlogArticle | null = null;

/**
 * Reads and parses the marketing article from the markdown source. The result
 * is cached in memory to avoid file system work during repeated renders.
 */
export function loadFirstArticle(): BlogArticle {
  if (cachedArticle) {
    return cachedArticle;
  }

  const markdownPath = path.join(process.cwd(), "content", "blog", "first.md");
  try {
    const file = fs.readFileSync(markdownPath, "utf-8");
    cachedArticle = parseMarkdown(file, markdownPath);
  } catch (error) {
    cachedArticle = FALLBACK_ARTICLE;
  }
  return cachedArticle;
}

/**
 * Первая запись блога описывает базовые шаги подготовки и знакомит гостей с
 * продуктом. Контент хранится в markdown, чтобы маркетинг мог обновлять текст
 * без участия разработчиков.
 */
export default function FirstBlogPost() {
  const article = loadFirstArticle();
  return (
    <main className="bg-[var(--bg)]">
      <Container className="py-16">
        <article className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-2">
            <p className="small text-[var(--muted)]">{article.readingMinutes} мин. чтения</p>
            <h1 className="text-4xl font-extrabold text-[var(--fg)]">{article.title}</h1>
          </header>
          <Card>
            <div className="space-y-5 text-base leading-7 text-[var(--fg)]/90">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>
        </article>
      </Container>
    </main>
  );
}
