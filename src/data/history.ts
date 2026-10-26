export type HistoryMilestone = {
  year: string;
  tag: string;
  title: string;
  text: string;
};

/** Marcos da trajetória do partido exibidos na seção HistoryScroll. */
export const historyMilestones: HistoryMilestone[] = [
  {
    year: "1922",
    tag: "Fundação",
    title: "Nasce o partido da classe operária",
    text: "Em 25 de março, em Niterói, delegados de grupos comunistas de vários estados fundam o Partido Comunista do Brasil, o mais antigo partido político em atividade no país.",
  },
  {
    year: "1945",
    tag: "Legalidade",
    title: "Do povo para o Parlamento",
    text: "Com o fim do Estado Novo, os comunistas conquistam a legalidade e elegem uma bancada para a Assembleia Constituinte — entre eles Luís Carlos Prestes e o escritor Jorge Amado.",
  },
  {
    year: "1962",
    tag: "Reorganização",
    title: "PCdoB: a sigla da continuidade",
    text: "Em fevereiro, militantes que defendiam o caminho revolucionário reorganizam o partido com o nome original e a sigla PCdoB, reafirmando sua tradição de luta.",
  },
  {
    year: "1972",
    tag: "Resistência",
    title: "Contra a ditadura, a Guerrilha do Araguaia",
    text: "Na clandestinidade, o partido organiza a resistência armada no sul do Pará. Muitos militantes deram a vida pela liberdade e pela democracia no Brasil.",
  },
  {
    year: "1985",
    tag: "Redemocratização",
    title: "De volta à legalidade",
    text: "Após décadas de perseguição, o PCdoB conquista o registro legal e participa da Constituinte que dá origem à Constituição Cidadã de 1988.",
  },
  {
    year: "2003",
    tag: "Governo",
    title: "Construindo um novo projeto nacional",
    text: "Aliado de Lula desde a Frente Brasil Popular de 1989, o partido integra o governo e contribui com ministérios, a presidência da Câmara e políticas de desenvolvimento e inclusão.",
  },
  {
    year: "2022",
    tag: "Centenário",
    title: "Cem anos e a vitória da democracia",
    text: "No ano do centenário, o PCdoB forma a Federação Brasil da Esperança e ajuda a eleger Lula, derrotando o projeto autoritário nas urnas.",
  },
];
