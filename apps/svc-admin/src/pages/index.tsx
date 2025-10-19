import React from "react";

const sections = [
  {
    id: "media",
    title: "Модерация медиа",
    description: "Проверка загруженных изображений и видео перед публикацией.",
  },
  {
    id: "vendors",
    title: "Проверка документов поставщиков",
    description: "Подтверждение юридических документов и статуса вендоров.",
  },
  {
    id: "logs",
    title: "Журналы событий",
    description: "Аудит действий администраторов и автоматических процессов.",
  },
];

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-slate-500">Админ-панель</p>
        <h1 className="mt-2 text-3xl font-bold">Центр управления WeddingTech</h1>
        <p className="mt-3 text-base text-slate-600">
          Выберите раздел чтобы перейти к модерации контента, проверке поставщиков или аудитам журнала событий.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <article
            key={section.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{section.description}</p>
            <a
              href={`#${section.id}`}
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Перейти →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
