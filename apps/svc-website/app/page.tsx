import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

import SearchEmpty from "../src/ui/empty/SearchEmpty";
import { LoadingButton } from "../src/ui/LoadingButton";
import { FeatureHighlights } from "../src/ui/marketing/FeatureHighlights";
import type { BreadcrumbItem } from "../src/ui/nav/Breadcrumbs";
import { Breadcrumbs } from "../src/ui/nav/Breadcrumbs";
import { LanguageSwitcher } from "../src/ui/i18n/LanguageSwitcher";
import { MARKETING_FEATURES } from "./marketing-features";

/**
 * The marketing hero keeps the new Next.js surface self-contained
 * while longer term migrations bring existing pages/ routes across.
 */

function HeroArtwork() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "min(100%, 720px)",
        margin: "3rem auto 0",
        aspectRatio: "5 / 3",
        borderRadius: "1.75rem",
        overflow: "hidden",
        background:
          "radial-gradient(120% 120% at 90% 10%, rgba(79, 70, 229, 0.18), transparent 60%), " +
          "radial-gradient(90% 90% at 20% 0%, rgba(14, 165, 233, 0.16), transparent 65%), " +
          "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(226, 232, 240, 0.7))",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 12%, rgba(255, 255, 255, 0.35) 12%, rgba(255, 255, 255, 0.35) 14%)",
          mixBlendMode: "soft-light",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "18% 14%",
          borderRadius: "1.25rem",
          border: "1px solid rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(14px)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(240, 249, 255, 0.55))",
        }}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "WeddingTech – управление каталогом и вендорами",
  description:
    "Платформа помогает маркетплейсу быстро настраивать каталог, работать с заявками и запускать рост",
};

const HERO_CRUMBS: BreadcrumbItem[] = [
  { href: "/", label: "Главная" },
  { href: "/vendors", label: "Каталог" },
  { label: "Панель управления" },
];

export default function HomePage() {
  return (
    <section style={{ textAlign: "center", maxWidth: "48rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Breadcrumbs items={HERO_CRUMBS} />
        <LanguageSwitcher />
      </div>
      <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1" }}>
        Vendor Operations Platform
      </p>
      <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", margin: "1rem 0" }}>
        Launch your marketplace with clarity and confidence
      </h1>
      <p style={{ fontSize: "1.15rem", color: "#475569", marginBottom: "2rem" }}>
        Configure onboarding flows, track partner readiness, and sync catalog updates across all of your channels
        without touching brittle spreadsheets.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
        <form action="/vendors" method="get">
          <LoadingButton type="submit">Открыть каталог</LoadingButton>
        </form>
        <Link
          href="/w/partners"
          className="wt-search-empty__link"
          style={{ textDecoration: "none" }}
        >
          Узнать о подходе к онбордингу
        </Link>
      </div>
      <HeroArtwork />
      <FeatureHighlights
        className="wt-feature-highlights--homepage"
        title="Чем поможет WeddingTech"
        intro="Оцифруйте процессы с первого дня и стройте маркетплейс на данных, а не догадках."
        features={MARKETING_FEATURES}
      />
      <SearchEmpty
        query="банкетный зал, Ташкент"
        suggestion="Попробуйте выбрать более широкие даты или очистите фильтры — наша команда продолжает наполнять каталог."
      >
        <LoadingButton loading spinnerLabel="Синхронизируем каталоги">
          Обновляем результаты…
        </LoadingButton>
        <Link className="wt-search-empty__link" href="/vendors">
          Вернуться в каталог
        </Link>
      </SearchEmpty>
    </section>
  );
}
