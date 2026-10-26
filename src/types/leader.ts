/** Liderança ou parlamentar exibido na seção Leaderships. */
export type Leader = {
  id: number | string;
  name: string;
  /** Cargo ou casa legislativa (ex.: "Câmara dos Deputados"). */
  role: string;
  /** Sigla do estado, quando houver mandato estadual/federal. */
  uf?: string;
  image?: string;
  /** Página de perfil (oficial ou do partido). */
  href?: string;
  email?: string;
};
