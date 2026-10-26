import type { Metadata } from "next";

import { Documents } from "@/components/sections/Documents";
import { Hero } from "@/components/sections/Hero";
import { HistoryScroll } from "@/components/sections/HistoryScroll";
import { Leaderships } from "@/components/sections/Leaderships";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { featuredLeaders } from "@/data/leaders";
import { getFederalDeputies } from "@/lib/camara";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getLatestNews } from "@/lib/wordpress";

const HOME_TITLE = `${SITE.name} — ${SITE.legalName}`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...BASE_OPEN_GRAPH, type: "website", url: "/", title: HOME_TITLE, description: SITE.description },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: SITE.description },
};

/** Home — Server Component: busca os dados e entrega às seções (client). */
export default async function HomePage() {
  const [news, deputies] = await Promise.all([getLatestNews(5), getFederalDeputies()]);

  return (
    <>
      <Hero />
      <NewsGrid items={news} viewAllHref="/noticias" />
      <HistoryScroll />
      <Leaderships featured={featuredLeaders} deputies={deputies} />
      <Documents />
      {/* O <Footer /> fica no layout, compartilhado por todas as páginas. */}
    </>
  );
}
