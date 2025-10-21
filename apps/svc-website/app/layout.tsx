import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WeddingTech – Celebrate without the busywork",
  description:
    "Plan, promote, and launch unforgettable vendor experiences with a modern Next.js front door.",
};

interface RootLayoutProps {
  /**
   * Children represent the active route segment rendered by Next.js.
   * Wrapping them in semantic HTML keeps hydration predictable across pages.
   */
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
