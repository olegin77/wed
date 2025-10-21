export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: ReadonlyArray<string>;
  contactPoint: ReadonlyArray<{
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: ReadonlyArray<string>;
  }>;
}

export interface FaqJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: ReadonlyArray<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

/**
 * JSON-LD definition describing the WeddingTech organization for search engines.
 */
export function buildOrganizationJsonLd(): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WeddingTech UZ",
    url: "https://weddingtech.uz",
    logo: "https://weddingtech.uz/logo.png",
    sameAs: [
      "https://t.me/weddingtech",
      "https://www.instagram.com/weddingtech.uz",
      "https://www.facebook.com/weddingtech.uz",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+998 71 000 00 00",
        contactType: "customer support",
        areaServed: "UZ",
        availableLanguage: ["ru", "uz"],
      },
    ],
  };
}

/**
 * JSON-LD FAQ definition based on the public marketing questions.
 */
export function buildFaqJsonLd(entries: ReadonlyArray<{ question: string; answer: string }>): FaqJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
