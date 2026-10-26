import "server-only";

import { fallbackDeputies, toDeputy } from "@/data/leaders";
import type { Leader } from "@/types/leader";

/**
 * Bancada federal lida da API de Dados Abertos da Câmara — fonte oficial,
 * atualiza sozinha a cada nova legislatura.
 */
const CAMARA_API_URL = "https://dadosabertos.camara.leg.br/api/v2";

/** A composição da bancada muda raramente: revalida uma vez por dia. */
const DEPUTIES_REVALIDATE = 60 * 60 * 24;

type CamaraDeputy = {
  id: number;
  nome: string;
  siglaUf: string;
  email?: string | null;
};

export async function getFederalDeputies(party = "PCdoB"): Promise<Leader[]> {
  const params = new URLSearchParams({ siglaPartido: party, ordem: "ASC", ordenarPor: "nome" });

  try {
    const res = await fetch(`${CAMARA_API_URL}/deputados?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: DEPUTIES_REVALIDATE, tags: ["deputies"] },
    });
    if (!res.ok) throw new Error(`Câmara respondeu ${res.status}`);

    const { dados } = (await res.json()) as { dados: CamaraDeputy[] };
    if (dados.length === 0) throw new Error("Lista de deputados vazia");

    return dados.map((deputy) =>
      toDeputy({ id: deputy.id, name: deputy.nome, uf: deputy.siglaUf, email: deputy.email ?? undefined }),
    );
  } catch (error) {
    console.error("[camara] Falha ao buscar deputados, usando fallback:", error);
    return fallbackDeputies;
  }
}
