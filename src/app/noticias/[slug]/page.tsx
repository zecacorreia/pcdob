import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { formatDate } from "@/lib/format";
import { SITE, absoluteUrl } from "@/lib/site";
import { getLatestNews, getNewsBySlug } from "@/lib/wordpress";

type ArticleProps = {
  params: Promise<{ slug: string }>;
};

// generateMetadata e a página pedem a mesma matéria: uma busca só por request.
const getArticle = cache(getNewsBySlug);

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return { title: "Notícia não encontrada" };

  const path = `/noticias/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.excerpt || undefined,
      publishedTime: article.date,
      modifiedTime: article.modified,
      authors: article.author ? [article.author] : undefined,
      section: article.category,
      images: article.image ? [{ url: article.image.src, alt: article.image.alt }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  const [article, latest] = await Promise.all([getArticle(slug), getLatestNews(6)]);
  if (!article) notFound();

  const url = absoluteUrl(`/noticias/${article.slug}`);
  const related = latest.filter((item) => item.slug !== article.slug).slice(0, 5);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt || undefined,
          datePublished: article.date,
          dateModified: article.modified,
          mainEntityOfPage: url,
          image: article.image ? [article.image.src] : undefined,
          author: article.author ? { "@type": "Person", name: article.author } : { "@type": "Organization", name: SITE.legalName },
          publisher: {
            "@type": "Organization",
            name: SITE.legalName,
            logo: { "@type": "ImageObject", url: absoluteUrl("/brand/favicon.svg") },
          },
        }}
      />

      <article>
        {/* ---------- Cabeçalho ---------- */}
        <header className="bg-ink pb-14 pt-32 text-paper md:pb-20 md:pt-44">
          <div className="container max-w-5xl">
            <Reveal>
              <nav aria-label="Trilha de navegação" className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-paper/60">
                <Link href="/noticias" className="transition-colors hover:text-ouro">
                  ← Notícias
                </Link>
              </nav>
              <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <span className="rounded-full bg-vermelho px-3 py-1.5">{article.category}</span>
                <time dateTime={article.date} className="text-paper/70">
                  {formatDate(article.date, "long")}
                </time>
                {article.author && <span className="text-paper/70">· Por {article.author}</span>}
              </div>
              <h1 className="font-display text-display-md font-black uppercase leading-[0.95] [font-stretch:110%] md:text-display-lg">
                {article.title}
              </h1>
            </Reveal>
          </div>
        </header>

        {article.image && (
          <div className="bg-gradient-to-b from-ink from-50% to-paper to-50%">
            <div className="container max-w-6xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------- Corpo ---------- */}
        <div className="bg-paper py-14 text-ink md:py-20">
          <div className="container max-w-3xl">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

            <footer className="mt-14 flex flex-col gap-6 border-t border-ink/15 pt-8">
              <ShareLinks url={url} title={article.title} />
              <p className="text-xs text-ink/50">
                Publicado originalmente em{" "}
                <a href={article.sourceUrl} className="underline underline-offset-4 hover:text-vermelho">
                  pcdob.org.br
                </a>
                .
              </p>
            </footer>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <NewsGrid items={related} eyebrow="Mais notícias" title={["Leia", "também"]} viewAllHref="/noticias" sectionId="relacionadas" />
      )}
    </>
  );
}
