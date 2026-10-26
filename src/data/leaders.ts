import type { Leader } from "@/types/leader";

/**
 * Direção nacional em destaque — mantida à mão.
 * ⚠ Confirmar cargos com a comunicação do partido a cada mudança de direção.
 */
export const featuredLeaders: Leader[] = [
  {
    id: "luciana-santos",
    name: "Luciana Santos",
    role: "Presidenta nacional do PCdoB",
    href: "https://pcdob.org.br/",
  },
];

const camaraPhoto = (id: number) => `https://www.camara.leg.br/internet/deputado/bandep/${id}.jpg`;
const camaraProfile = (id: number) => `https://www.camara.leg.br/deputados/${id}`;

/**
 * Bancada federal de reserva — usada só se a API da Câmara estiver fora do ar.
 * Fonte: dadosabertos.camara.leg.br, 57ª legislatura (consulta em out/2026).
 */
const FALLBACK_DEPUTIES: [id: number, name: string, uf: string][] = [
  [74057, "Alice Portugal", "BA"],
  [220555, "Daiana Santos", "RS"],
  [74060, "Daniel Almeida", "BA"],
  [230765, "Enfermeira Rejane", "RJ"],
  [204394, "Gervásio Maia", "PB"],
  [74295, "Inácio Arruda", "CE"],
  [74848, "Jandira Feghali", "RJ"],
  [81055, "Márcio Jerry", "MA"],
  [178987, "Orlando Silva", "SP"],
  [160641, "Professora Marcivania", "AP"],
  [73801, "Renildo Calheiros", "PE"],
];

export const fallbackDeputies: Leader[] = FALLBACK_DEPUTIES.map(([id, name, uf]) => toDeputy({ id, name, uf }));

/** Converte um registro da Câmara no formato usado pelos cards. */
export function toDeputy({ id, name, uf, email }: { id: number; name: string; uf: string; email?: string }): Leader {
  return {
    id,
    name,
    uf,
    role: "Câmara dos Deputados",
    image: camaraPhoto(id),
    href: camaraProfile(id),
    email,
  };
}
