import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

import { Container } from "../../../src/ui/Container";
import { LanguageSwitcher } from "../../../src/ui/i18n/LanguageSwitcher";
import type { BreadcrumbItem } from "../../../src/ui/nav/Breadcrumbs";
import { Breadcrumbs } from "../../../src/ui/nav/Breadcrumbs";
import { FeatureHighlights } from "../../../src/ui/marketing/FeatureHighlights";

export const metadata: Metadata = {
  title: "Подход к онбордингу партнеров – WeddingTech",
  description: "Узнайте о нашем подходе к онбордингу и работе с партнерами на платформе WeddingTech",
};

const PARTNERS_CRUMBS: BreadcrumbItem[] = [
  { href: "/", label: "Главная" },
  { href: "/w/partners", label: "Партнерам" },
];

const ONBOARDING_FEATURES = [
  {
    title: "Простая регистрация",
    description: "Зарегистрируйтесь и создайте профиль своего бизнеса за несколько минут",
    icon: "🚀",
  },
  {
    title: "Управление каталогом",
    description: "Добавляйте услуги, цены, фотографии и управляйте доступностью",
    icon: "📋",
  },
  {
    title: "Приём заявок",
    description: "Получайте заявки от потенциальных клиентов напрямую в вашу панель",
    icon: "💬",
  },
  {
    title: "Аналитика",
    description: "Отслеживайте просмотры, заявки и конверсию вашего профиля",
    icon: "📊",
  },
];

export default function PartnersPage() {
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
        <Breadcrumbs items={PARTNERS_CRUMBS} />
        <LanguageSwitcher />
      </div>
      
      <section style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "1rem" }}>
          Станьте партнером WeddingTech
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#475569", marginBottom: "2rem" }}>
          Присоединяйтесь к ведущей платформе свадебных услуг и привлекайте больше клиентов для вашего бизнеса.
        </p>
        
        <div style={{ marginTop: "3rem" }}>
          <FeatureHighlights
            title="Как работает онбординг"
            intro="Мы сделали процесс регистрации максимально простым и прозрачным"
            features={ONBOARDING_FEATURES}
          />
        </div>

        <div style={{ 
          padding: "3rem 2rem", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "1rem",
          marginTop: "4rem"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Готовы начать?
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.9 }}>
            Зарегистрируйтесь прямо сейчас и получите первый месяц бесплатно
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/vendors"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "white",
                color: "#667eea",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem"
              }}
            >
              Зарегистрироваться
            </Link>
            <Link 
              href="/"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                border: "2px solid white"
              }}
            >
              Узнать больше
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "left" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
            Часто задаваемые вопросы
          </h3>
          <div style={{ 
            display: "grid", 
            gap: "1.5rem",
            marginTop: "2rem" 
          }}>
            <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "0.75rem" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#6366f1" }}>
                Сколько стоит размещение?
              </h4>
              <p style={{ color: "#64748b" }}>
                Первый месяц бесплатно. После этого доступны различные тарифные планы в зависимости от ваших потребностей.
              </p>
            </div>
            
            <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "0.75rem" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#6366f1" }}>
                Как быстро я могу начать получать заявки?
              </h4>
              <p style={{ color: "#64748b" }}>
                После заполнения профиля и прохождения модерации (обычно 1-2 дня) вы сразу можете начать получать заявки от клиентов.
              </p>
            </div>
            
            <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "0.75rem" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#6366f1" }}>
                Нужна ли техническая поддержка?
              </h4>
              <p style={{ color: "#64748b" }}>
                Наша команда поддержки доступна 24/7 чтобы помочь вам с любыми вопросами по использованию платформы.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
