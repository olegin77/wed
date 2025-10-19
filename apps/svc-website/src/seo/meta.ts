export type MetaTag = ["meta", Record<string, string>];

type MetaInput = {
  title: string;
  desc: string;
  url: string;
  image: string;
};

export function og({ title, desc, url, image }: MetaInput): MetaTag[] {
  return [
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: desc }],
    ["meta", { property: "og:url", content: url }],
    ["meta", { property: "og:image", content: image }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: title }],
    ["meta", { name: "twitter:description", content: desc }],
    ["meta", { name: "twitter:image", content: image }],
  ];
}
