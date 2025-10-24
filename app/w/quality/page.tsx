import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

import { Container } from "../../../src/ui/Container";
import { LanguageSwitcher } from "../../../src/ui/i18n/LanguageSwitcher";
import type { BreadcrumbItem } from "../../../src/ui/nav/Breadcrumbs";
import { Breadcrumbs } from "../../../src/ui/nav/Breadcrumbs";

export const metadata: Metadata = {
  title: "Стандарты качества – WeddingTech",
  description: "Узнайте о наших стандартах качества и требованиях к партнерам на платформе WeddingTech",
};

const QUALITY_CRUMBS: BreadcrumbItem[] = [
  { href: "/", label: "Главная" },
  { href: "/w/quality", label: "Качество" },
];

export default function QualityPage() {
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
        <Breadcrumbs items={QUALITY_CRUMBS} />
        <LanguageSwitcher />
      </div>
      
      <section style={{ maxWidth: "48rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "1rem" }}>
            Наши стандарты качества
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#475569" }}>
            Мы тщательно проверяем каждого партнера, чтобы гарантировать высокое качество услуг для наших клиентов.
          </p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", color: "#1e293b" }}>
            📋 Критерии отбора партнеров
          </h2>
          
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ 
              padding: "1.5rem", 
              background: "#f8fafc", 
              borderRadius: "0.75rem",
              borderLeft: "4px solid #6366f1"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#6366f1" }}>
                1. Профессиональный опыт
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Минимум 2 года опыта в свадебной индустрии и портфолио выполненных проектов.
              </p>
            </div>

            <div style={{ 
              padding: "1.5rem", 
              background: "#f8fafc", 
              borderRadius: "0.75rem",
              borderLeft: "4px solid #8b5cf6"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#8b5cf6" }}>
                2. Документы и лицензии
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Наличие всех необходимых документов, лицензий и разрешений для ведения деятельности.
              </p>
            </div>

            <div style={{ 
              padding: "1.5rem", 
              background: "#f8fafc", 
              borderRadius: "0.75rem",
              borderLeft: "4px solid #ec4899"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#ec4899" }}>
                3. Отзывы клиентов
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Положительные рекомендации от предыдущих клиентов и высокий рейтинг удовлетворенности.
              </p>
            </div>

            <div style={{ 
              padding: "1.5rem", 
              background: "#f8fafc", 
              borderRadius: "0.75rem",
              borderLeft: "4px solid #10b981"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#10b981" }}>
                4. Качество обслуживания
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Быстрые ответы на заявки (в течение 24 часов) и профессиональное общение с клиентами.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: "2rem", 
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          borderRadius: "1rem",
          marginBottom: "3rem"
        }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem", color: "#1e293b" }}>
            🎯 Система рейтинга качества
          </h2>
          <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "1rem" }}>
            Каждый партнер получает оценку качества на основе:
          </p>
          <ul style={{ color: "#64748b", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
            <li><strong>Скорости ответа</strong> – среднее время реакции на заявки клиентов</li>
            <li><strong>Рейтинга отзывов</strong> – средняя оценка от клиентов</li>
            <li><strong>Процента завершенных сделок</strong> – соотношение заявок к реальным заказам</li>
            <li><strong>Активности профиля</strong> – регулярность обновления информации и фотографий</li>
          </ul>
        </div>

        <div style={{ 
          padding: "2rem", 
          background: "#fef3c7",
          borderRadius: "1rem",
          marginBottom: "3rem"
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#92400e" }}>
            ⚠️ Мониторинг и контроль качества
          </h2>
          <p style={{ color: "#78350f", lineHeight: "1.6" }}>
            Мы постоянно отслеживаем качество услуг наших партнеров. При получении негативных отзывов или жалоб 
            мы проводим внутреннее расследование и при необходимости можем приостановить или прекратить сотрудничество 
            с партнером.
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
            Хотите стать партнером?
          </h2>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            Если ваш бизнес соответствует нашим стандартам качества, мы будем рады видеть вас на платформе.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/w/partners"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "#6366f1",
                color: "white",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Узнать об онбординге
            </Link>
            <Link 
              href="/"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "white",
                color: "#6366f1",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600",
                border: "2px solid #6366f1"
              }}
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}
