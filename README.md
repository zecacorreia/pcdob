# PCdoB — novo site

Front-end do site do Partido Comunista do Brasil em **Next.js 15 (App Router) + TypeScript + Tailwind CSS 3 + Framer Motion**, com rolagem suave via **Lenis**. Inspiração visual: tipografia expandida, muito espaço negativo e micro-interações.

O site é **headless**: o conteúdo continua sendo publicado no WordPress atual (`pcdob.org.br`) e é lido pela REST API. Nada muda para quem publica.

## Começando

```bash
npm install
cp .env.example .env.local   # opcional em desenvolvimento
npm run dev                  # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint com as regras do Next (Core Web Vitals + TypeScript) |
| `npm test` / `npm run test:watch` | Testes (Vitest + Testing Library) |
| `npm run check` | Tipos + lint + testes, em sequência (use antes de abrir PR) |
| `npm run icons` | Regera favicon, ícone do iOS e ícones do manifest a partir do símbolo ([`scripts/generate-icons.mjs`](scripts/generate-icons.mjs)) |

> Não rode `npm run build` com o `npm run dev` ligado: os dois usam a pasta `.next` e o servidor de desenvolvimento quebra. Pare o dev, faça o build e ligue de novo.

## Variáveis de ambiente

Todas estão documentadas em [`.env.example`](.env.example).

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://pcdob.org.br` | URLs absolutas: canonical, sitemap, Open Graph, JSON-LD |
| `WORDPRESS_API_URL` | `https://pcdob.org.br/wp-json/wp/v2` | Origem das notícias |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | — | Google Analytics 4. **Vazio = sem analytics e sem banner de cookies** |
| `NEWSLETTER_WEBHOOK_URL` | — | Recebe as inscrições da newsletter. **Obrigatório em produção** (sem ele a inscrição responde 503; em dev é simulada) |
| `NEWSLETTER_WEBHOOK_TOKEN` | — | Opcional, enviado como `Authorization: Bearer` |

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Hero, notícias em destaque, timeline da história, lideranças, documentos |
| `/noticias` | Listagem paginada (`?pagina=N`) |
| `/noticias/[slug]` | Matéria completa, com barra de leitura, compartilhamento e "Leia também" |
| `/o-partido` | Datas do Estatuto, timeline, programa/estatuto/resolução, lideranças |
| `/filie-se` | Campanha de filiação → plataforma oficial **PCdoB Digital** |
| `/privacidade` | Política de privacidade (LGPD) |
| `/api/newsletter` | `POST` de inscrição na newsletter |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image.png` | SEO |

## De onde vêm os dados

| Dado | Fonte | Atualização |
| --- | --- | --- |
| Notícias | REST API do WordPress ([`lib/wordpress.ts`](src/lib/wordpress.ts)) | ISR, 5 min |
| Bancada federal | [Dados Abertos da Câmara](https://dadosabertos.camara.leg.br/) ([`lib/camara.ts`](src/lib/camara.ts)) | ISR, 24 h |
| Direção, timeline, documentos, textos do Filie-se | Arquivos em [`src/data/`](src/data) (curadoria manual) | A cada deploy |

As duas APIs têm **conteúdo de reserva**: se caírem, a home continua no ar. O HTML das matérias é **sanitizado** ([`sanitizeArticleHtml`](src/lib/wordpress-utils.ts)): ficam a formatação editorial e os embeds de YouTube, Vimeo e Spotify; scripts, estilos inline e iframes de outros sites são removidos.

A filiação **não** é feita neste site. Ela acontece no PCdoB Digital, o sistema oficial que registra a filiação na Justiça Eleitoral. Os links ficam em [`lib/navigation.ts`](src/lib/navigation.ts).

## Estrutura

```
src/
├── app/                        # Rotas (App Router)
│   ├── layout.tsx              # fontes, metadata, Navbar, Footer, consentimento, JSON-LD do partido
│   ├── template.tsx            # transição de entrada entre páginas
│   ├── page.tsx                # home
│   ├── noticias/               # listagem + [slug]
│   ├── o-partido/ filie-se/ privacidade/
│   ├── api/newsletter/route.ts
│   ├── sitemap.ts robots.ts manifest.ts
│   ├── icon.svg favicon.ico apple-icon.png opengraph-image.png   # gerados por `npm run icons`
│   └── not-found.tsx error.tsx
├── components/
│   ├── brand/                  # logo, símbolo e lettering em SVG
│   ├── layout/                 # Navbar, Footer, PageHeader
│   ├── sections/               # blocos de página (Hero, NewsGrid, HistoryScroll, Leaderships, Documents, join/…)
│   ├── motion/                 # Reveal, RevealText, ScrollHighlightText
│   ├── privacy/                # banner de cookies e consentimento
│   ├── seo/                    # JsonLd
│   ├── ui/                     # MagneticButton, NewsletterForm, Pagination, ShareLinks…
│   └── providers/              # SmoothScroll (Lenis)
├── data/                       # conteúdo curado (editar aqui, não nos componentes)
├── lib/                        # clientes de API, utilitários, tokens de animação
└── types/
tests/                          # Vitest + Testing Library
scripts/generate-icons.mjs      # gera o conjunto de ícones
public/icons/                   # ícones do manifest (gerados)
```

## Design tokens

Definidos em [`tailwind.config.ts`](tailwind.config.ts):

| Token | Uso |
| --- | --- |
| `vermelho` (50–950, `DEFAULT #D7141A`) | Cor institucional |
| `ouro` (`DEFAULT #FFD400`, `logo #FFFF00`) | CTA principal e acentos; `logo` só no símbolo |
| `verde` | Acento pontual |
| `ink` / `paper` | Neutros (preto quente e off-white) no lugar de preto/branco puros |
| `text-display-*` | Escala fluida das manchetes |
| `ease-out-expo`, `ease-in-out-quart` | Curvas das transições |

As curvas e variantes do Framer Motion ficam em [`lib/motion.ts`](src/lib/motion.ts).

## SEO, metadados e ícones

- **Toda página** monta os metadados com `pageMetadata()` ([`lib/seo.ts`](src/lib/seo.ts)): título, descrição, `canonical`, `og:url`, Open Graph e cartão do X com os mesmos textos e a imagem padrão.
  - O layout **não** define `canonical` de propósito. Se definisse, as páginas sem canônico próprio herdariam o da home e o Google as trataria como cópias dela.
  - O Next substitui o `openGraph` do layout em vez de mesclar. Por isso `pageMetadata` repete `siteName`, `locale` e a imagem padrão.
  - Mantenha as descrições abaixo de ~160 caracteres. Nas matérias, `truncate()` corta o resumo do WordPress.
- Metadados globais no [`layout.tsx`](src/app/layout.tsx): `robots` (com `max-image-preview: large`), palavras-chave, autoria, `applicationName`, `appleWebApp`, `theme-color` e `format-detection`.
- **Ícones** (gerados por `npm run icons`): `icon.svg` (símbolo amarelo sobre quadrado vermelho, legível em abas claras e escuras), `favicon.ico` (16/32/48 px), `apple-icon.png` (180 px) e os ícones do [manifest](src/app/manifest.ts) (192, 512 e *maskable* com área segura para o Android).
- Matérias com Open Graph de artigo (imagem, autor, datas) e JSON-LD `NewsArticle`.
- JSON-LD `PoliticalParty` em todas as páginas, com data de fundação e redes oficiais.
- `sitemap.xml` com as rotas fixas e as 100 matérias mais recentes, regerado junto com as notícias (a cada 5 min).
- `robots.txt` bloqueia apenas `/api/`.
- **Imagem de compartilhamento** ([`opengraph-image.png`](src/app/opengraph-image.png), 1200×630): fundo vermelho, símbolo amarelo e "PCdoB" em branco, gerada por `npm run icons` a partir do logo oficial. Matérias com imagem destacada usam a própria foto.

## Privacidade, cookies e analytics (LGPD)

- O Google Analytics **só carrega depois do consentimento**. Antes disso nenhum cookie de estatística é criado.
- No banner, **Recusar** e **Aceitar** têm o mesmo destaque, e há a opção de **Personalizar** por categoria.
- A escolha fica no `localStorage` (`pcdob-consent`), com data e versão. Ao subir `CONSENT_VERSION` em [`lib/consent.ts`](src/lib/consent.ts), o banner volta a aparecer para todos.
- O rodapé e a página `/privacidade` têm o link **Preferências de cookies**. Ao revogar, o GA é desligado e os cookies `_ga*` são apagados.
- A newsletter exige uma caixa de consentimento e envia a data e hora do consentimento ao provedor.

## Acessibilidade

- Todas as animações respeitam `prefers-reduced-motion`: o Lenis é desligado e o parallax e o scroll horizontal viram layouts estáticos.
- Manchetes divididas em linhas expõem o texto completo via `aria-label`.
- Hover e foco por teclado têm o mesmo efeito, e há o link "Pular para o conteúdo".
- Filtros usam `aria-pressed`, o acordeão usa `aria-expanded`/`region` e as contagens de resultado são anunciadas (`aria-live`).

## Testes

```bash
npm test
```

Os testes cobrem:
- normalização e sanitização do WordPress;
- a rota da newsletter (validação, honeypot, webhook, erros);
- o consentimento de cookies (persistência, versão, carregamento condicional do GA);
- a paginação;
- os componentes interativos: newsletter, filtro e busca de documentos, perguntas frequentes e banner de cookies.

## Pendências antes de publicar

- [ ] **Revisão de conteúdo** pela comunicação: timeline ([`data/history.ts`](src/data/history.ts)), direção em destaque ([`data/leaders.ts`](src/data/leaders.ts)), passos e perguntas do Filie-se ([`data/join.ts`](src/data/join.ts)), lista de documentos ([`data/documents.ts`](src/data/documents.ts)).
- [ ] **Revisão jurídica** da [Política de Privacidade](src/app/privacidade/page.tsx) e das respostas legais do Filie-se. A LGPD (art. 41) pede a identidade e o contato do **encarregado de dados**, que ainda não constam na página.
- [ ] Configurar `NEWSLETTER_WEBHOOK_URL` e, se for usar, `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Vídeo ou foto do Hero (o componente aceita a prop `media`).
- [ ] Versionar o projeto (`git init`) e configurar o deploy.
- [ ] Testar em Safari e iOS (texto em contorno, `svh`, scroll horizontal da timeline) e rodar o Lighthouse.
