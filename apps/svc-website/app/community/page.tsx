import type { Metadata } from "next";
import React from "react";

import CommunityFeedClient from "./community-feed-client";

export const metadata: Metadata = {
  title: "WeddingTech — комьюнити и истории пар",
  description:
    "Следите за обновлениями платформы, историями реальных пар и ответами экспертов WeddingTech.",
};

export default function CommunityPage() {
  return <CommunityFeedClient />;
}
