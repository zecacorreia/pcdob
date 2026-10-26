import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { getSitemapEntries } from "@/lib/wordpress";

/**
 * Inclui as 100 matérias mais recentes. Na prática é regerado a cada 5 min:
 * o Next usa o menor intervalo entre a rota e as buscas ao WordPress.
 */
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "hourly" },
  { path: "/noticias", priority: 0.9, changeFrequency: "hourly" },
  { path: "/o-partido", priority: 0.8, changeFrequency: "monthly" },
  { path: "/filie-se", priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapEntries(100);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/noticias/${post.slug}`),
      lastModified: new Date(post.modified),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
