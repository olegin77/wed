import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

import { Container } from "../../src/ui/Container";
import { LanguageSwitcher } from "../../src/ui/i18n/LanguageSwitcher";
import type { BreadcrumbItem } from "../../src/ui/nav/Breadcrumbs";
import { Breadcrumbs } from "../../src/ui/nav/Breadcrumbs";

export const metadata: Metadata = {
  title: "Каталог вендоров – WeddingTech",
  description: "Полный каталог свадебных поставщиков и площадок для вашего идеального торжества",
};

const VENDOR_CRUMBS: BreadcrumbItem[] = [
  { href: "/", label: "Главная" },
  { label: "Каталог" },
];

export default function VendorsPage() {
  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <Breadcrumbs items={VENDOR_CRUMBS} />
        <LanguageSwitcher />
      </div>
      
      <section style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "1rem" }}>
          Каталог вендоров
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#475569", marginBottom: "2rem" }}>
          Здесь будет отображаться полный каталог свадебных поставщиков и площадок.
          Вы сможете фильтровать по городам, категориям и просматривать подробную информацию о каждом вендоре.
        </p>
        
        <div style={{ 
          padding: "2rem", 
          background: "#f8fafc", 
          borderRadius: "1rem",
          marginTop: "3rem"
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            🚧 Страница в разработке
          </h2>
          <p style={{ color: "#64748b" }}>
            Каталог вендоров скоро будет доступен. Здесь вы сможете найти:
          </p>
          <ul style={{ 
            textAlign: "left", 
            maxWidth: "400px", 
            margin: "1.5rem auto",
            color: "#475569"
          }}>
            <li>✨ Свадебные площадки и банкетные залы</li>
            <li>📸 Фотографов и видеографов</li>
            <li>🎵 Музыкантов и диджеев</li>
            <li>🎂 Кондитеров и кейтеринг</li>
            <li>💐 Флористов и декораторов</li>
            <li>👗 Свадебные салоны</li>
          </ul>
          
          <Link 
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "#6366f1",
              color: "white",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "500",
              marginTop: "1rem"
            }}
          >
            Вернуться на главную
          </Link>
        </div>
      </section>
    </Container>
  );
}
