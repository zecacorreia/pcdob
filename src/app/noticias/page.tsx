import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { Pagination } from "@/components/ui/Pagination";
import { getNewsPage } from "@/lib/wordpress";
import { parsePageParam } from "@/lib/wordpress-utils";

type NewsListProps = {
  searchParams: Promise<{ pagina?: string | string[] }>;
};

const hrefFor = (page: number) => (page === 1 ? "/noticias" : `/noticias?pagina=${page}`);

export async function generateMetadata({ searchParams }: NewsListProps): Promise<Metadata> {
  const page = parsePageParam((await searchParams).pagina);
  return {
    title: page > 1 ? `Notícias — página ${page}` : "Notícias",
    description: "As últimas notícias, artigos e posicionamentos do Partido Comunista do Brasil.",
    alternates: { canonical: hrefFor(page) },
  };
}

export default async function NewsListPage({ searchParams }: NewsListProps) {
  const page = parsePageParam((await searchParams).pagina);
  const result = await getNewsPage(page);
  if (!result || result.items.length === 0) notFound();

  return (
    <>
      <PageHeader
        tone="paper"
        eyebrow={page > 1 ? `Notícias · página ${page}` : "Notícias"}
        title={["Notícias", "da luta"]}
        description="Análises, artigos e posicionamentos do partido sobre o Brasil e o mundo."
      />
      <NewsGrid items={result.items} showHeader={false} sectionId="lista-noticias" />
      <div className="bg-paper text-ink">
        <Pagination page={result.page} totalPages={result.totalPages} hrefFor={hrefFor} />
      </div>
    </>
  );
}
