/**
 * Server-Side Rendering (SSR) utilities
 * Provides functions for rendering React components on the server
 */

import React from 'react';
import { renderToString as reactRenderToString } from 'react-dom/server';

export interface SSRConfig {
  template: string;
  app: string;
  styles?: string;
  scripts?: string[];
  meta?: Record<string, string>;
  data?: any;
}

export interface SSROptions {
  doctype?: string;
  charset?: string;
  viewport?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

/**
 * Render a React component to HTML string
 */
export function renderToString(component: React.ReactElement): string {
  return reactRenderToString(component);
}

/**
 * Generate HTML document with SSR content
 */
export function generateHTML(
  content: string,
  config: SSRConfig,
  options: SSROptions = {}
): string {
  const {
    doctype = '<!DOCTYPE html>',
    charset = 'utf-8',
    viewport = 'width=device-width, initial-scale=1',
    title = 'WeddingTech',
    description = 'Your perfect wedding planning platform',
    keywords = 'wedding, planning, vendors, guests',
    ogImage = '/og-image.jpg',
    ogUrl = '',
    twitterCard = 'summary_large_image',
  } = options;

  const metaTags = [
    `<meta charset="${charset}">`,
    `<meta name="viewport" content="${viewport}">`,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="keywords" content="${keywords}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:url" content="${ogUrl}">`,
    `<meta property="og:type" content="website">`,
    `<meta name="twitter:card" content="${twitterCard}">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    ...Object.entries(config.meta || {}).map(([key, value]) => 
      `<meta name="${key}" content="${value}">`
    ),
  ].join('\n    ');

  const styles = config.styles ? `<style>${config.styles}</style>` : '';
  const scripts = config.scripts?.map(script => 
    `<script src="${script}"></script>`
  ).join('\n    ') || '';

  const dataScript = config.data ? 
    `<script>window.__INITIAL_DATA__ = ${JSON.stringify(config.data)};</script>` : '';

  return `${doctype}
<html lang="en">
<head>
    ${metaTags}
    ${styles}
</head>
<body>
    <div id="${config.app}">${content}</div>
    ${dataScript}
    ${scripts}
</body>
</html>`;
}

/**
 * Extract critical CSS for above-the-fold content
 */
export function extractCriticalCSS(html: string): string {
  // This is a simplified implementation
  // In production, you'd use tools like critical or penthouse
  const criticalSelectors = [
    'body', 'html', 'h1', 'h2', 'h3', 'p', 'a', 'button',
    '.header', '.hero', '.navigation', '.cta'
  ];
  
  // This would extract CSS for critical selectors
  // For now, return a placeholder
  return `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .header { background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
  `;
}

/**
 * Preload critical resources
 */
export function generatePreloadLinks(resources: Array<{
  href: string;
  as: 'script' | 'style' | 'font' | 'image';
  type?: string;
  crossorigin?: boolean;
}>): string {
  return resources.map(resource => {
    const attrs = [
      `href="${resource.href}"`,
      `as="${resource.as}"`,
      resource.type ? `type="${resource.type}"` : '',
      resource.crossorigin ? 'crossorigin' : '',
    ].filter(Boolean).join(' ');

    return `<link rel="preload" ${attrs}>`;
  }).join('\n    ');
}

/**
 * Generate sitemap XML
 */
export function generateSitemap(pages: Array<{
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>): string {
  const urls = pages.map(page => {
    const lastmod = page.lastmod || new Date().toISOString().split('T')[0];
    const changefreq = page.changefreq || 'monthly';
    const priority = page.priority || 0.5;

    return `    <url>
        <loc>${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(
  sitemapUrl: string,
  disallowPaths: string[] = ['/admin', '/api', '/_next']
): string {
  const disallowRules = disallowPaths.map(path => `Disallow: ${path}`).join('\n');
  
  return `User-agent: *
${disallowRules}

Sitemap: ${sitemapUrl}`;
}

/**
 * Hydrate client-side React app
 */
export function hydrateApp(component: React.ReactElement, containerId: string = 'app'): void {
  if (typeof window !== 'undefined') {
    const { hydrateRoot } = require('react-dom/client');
    const container = document.getElementById(containerId);
    
    if (container) {
      hydrateRoot(container, component);
    }
  }
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if running on client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get initial data from server
 */
export function getInitialData(): any {
  if (isClient() && (window as any).__INITIAL_DATA__) {
    return (window as any).__INITIAL_DATA__;
  }
  return null;
}