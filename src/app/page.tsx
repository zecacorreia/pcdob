import { Documents } from "@/components/sections/Documents";
import { Hero } from "@/components/sections/Hero";
import { HistoryScroll } from "@/components/sections/HistoryScroll";
import { Leaderships } from "@/components/sections/Leaderships";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { featuredLeaders } from "@/data/leaders";
import { getFederalDeputies } from "@/lib/camara";
import { getLatestNews } from "@/lib/wordpress";

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
