export type PieceTypeId =
  // Cíveis / Processo Civil
  | "peticao_inicial"
  | "contestacao"
  | "replica"
  | "apelacao"
  | "agravo_instrumento"
  | "embargos_declaracao"
  | "manifestacao"
  | "cumprimento_sentenca"
  | "embargos_execucao"
  | "acao_monitoria"
  | "tutela_urgencia"
  // Família
  | "acao_alimentos"
  | "divorcio_consensual"
  | "guarda_compartilhada"
  // Penal
  | "habeas_corpus"
  | "resposta_acusacao"
  | "alegacoes_finais"
  // Administrativo / Constitucional
  | "mandado_seguranca"
  | "defesa_processo_administrativo"
  // Consumidor
  | "reclamacao_procon"
  | "acao_consumidor_juizado"
  // Trabalho
  | "reclamacao_trabalhista"
  | "defesa_trabalhista"
  // Documentos extraprocessuais
  | "parecer"
  | "notificacao_extrajudicial"
  | "procuracao"
  | "contrato_servicos"
  | "contrato_locacao"
  | "contrato_nda";

export type AreaId =
  | "civel"
  | "processual"
  | "consumidor"
  | "trabalho"
  | "penal"
  | "familia"
  | "administrativo"
  | "extrajudicial";

export interface AreaMeta {
  id: AreaId;
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const AREAS: Record<AreaId, AreaMeta> = {
  civel: {
    id: "civel",
    label: "Direito Civil",
    color: "bg-brand-100 text-brand-700 border-brand-200",
    icon: "⚖️",
    description: "Indenizações, contratos, responsabilidade civil, cobranças e direitos reais.",
  },
  processual: {
    id: "processual",
    label: "Processual Civil",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    icon: "📑",
    description: "Recursos, cumprimento de sentença, embargos, tutela de urgência e CPC.",
  },
  consumidor: {
    id: "consumidor",
    label: "Direito do Consumidor",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "🛒",
    description: "Relações de consumo, CDC, PROCON, Juizados Especiais Cíveis.",
  },
  trabalho: {
    id: "trabalho",
    label: "Direito do Trabalho",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "👷",
    description: "Reclamações, defesas, verbas rescisórias e CLT.",
  },
  penal: {
    id: "penal",
    label: "Direito Penal",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: "⚔️",
    description: "Habeas corpus, defesa, alegações finais, recursos criminais.",
  },
  familia: {
    id: "familia",
    label: "Direito de Família",
    color: "bg-pink-100 text-pink-700 border-pink-200",
    icon: "👨‍👩‍👧",
    description: "Divórcio, alimentos, guarda, inventário e regime de bens.",
  },
  administrativo: {
    id: "administrativo",
    label: "Direito Administrativo",
    color: "bg-sky-100 text-sky-700 border-sky-200",
    icon: "🏛️",
    description: "Mandado de segurança, defesa administrativa, atos da administração.",
  },
  extrajudicial: {
    id: "extrajudicial",
    label: "Extrajudicial",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: "📜",
    description: "Contratos, procurações, notificações e pareceres.",
  },
};

export interface PieceField {
  id: string;
  label: string;
  helper?: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface PieceType {
  id: PieceTypeId;
  label: string;
  area: AreaId;
  areaLabel: string;
  description: string;
  icon: string;
  /** Tempo médio de geração + edição estimado, em minutos. */
  estimatedMinutes: number;
  /** Frequência de uso (0-100) — alimenta a ordenação "mais usadas". */
  popularity: number;
  /** Marcação visual: "Mais usado", "Novo", "Popular". */
  badge?: "popular" | "new" | "trending";
  fields: PieceField[];
}

// =============================================================
// Campos reutilizáveis
// =============================================================
const baseParties: PieceField[] = [
  {
    id: "autor",
    label: "Parte autora / Requerente — qualificação COMPLETA",
    helper:
      "Inclua: nome completo, nacionalidade, estado civil, profissão, RG, CPF/CNPJ, endereço completo com CEP, e-mail. Pode deixar [INSERIR] em dados que não tiver — a IA usa marcadores.",
    placeholder:
      "Ex.: João da Silva, brasileiro, casado, autônomo, portador do RG nº 12.345.678 SSP/SP, CPF nº 123.456.789-00, residente e domiciliado à Rua das Flores, nº 123, apto 401, Bairro Centro, São Paulo/SP, CEP 01000-000",
    type: "textarea",
    required: true,
  },
  {
    id: "reu",
    label: "Parte ré / Requerida — qualificação COMPLETA",
    helper:
      "PF: nome, estado civil, profissão, CPF, endereço. PJ: razão social, CNPJ, endereço, representante legal se souber. Use [INSERIR] em dados ausentes.",
    placeholder:
      "Ex.: Magazine XYZ Ltda., pessoa jurídica de direito privado, inscrita no CNPJ sob nº 12.345.678/0001-90, com sede à Av. Paulista, nº 1.000, conjunto 50, São Paulo/SP, CEP 01310-100, representada por seu sócio-administrador [INSERIR]",
    type: "textarea",
    required: true,
  },
];

const baseFacts: PieceField = {
  id: "fatos",
  label: "Fatos relevantes — narrativa completa",
  helper:
    "Descreva em ordem cronológica TUDO que importa: datas (com mês/ano), valores, tentativas de solução, documentos disponíveis, prejuízos sofridos. Quanto mais detalhe, mais robusta a peça.",
  placeholder:
    "Ex.: Em 10/03/2026 o autor adquiriu, pelo site da ré, uma TV LG OLED 55 polegadas, modelo OLED55C2PSA, pelo valor de R$ 7.500,00, pago via cartão de crédito em 10x. O produto foi entregue em 20/03/2026 com a tela quebrada, conforme fotos e nota fiscal anexas. Entre 21/03 e 15/04 o autor entrou em contato 5 vezes pelo SAC e pelo WhatsApp oficial, sem resposta efetiva. Em 20/04/2026 protocolou reclamação no PROCON sob nº ___, e a ré não se manifestou no prazo legal de 30 dias.",
  type: "textarea",
  required: true,
};

const baseRequest: PieceField = {
  id: "pedido",
  label: "Pedido principal — o que se busca",
  helper:
    "Detalhe a obrigação pretendida (fazer/não-fazer/dar coisa), valores específicos e parâmetros. A IA também adiciona automaticamente os pedidos clássicos (citação, custas, honorários, gratuidade se for o caso).",
  placeholder:
    "Ex.: a) Condenação da ré à OBRIGAÇÃO DE FAZER consistente na substituição imediata do produto por outro idêntico em perfeitas condições, no prazo de 15 dias; OU subsidiariamente a restituição integral do valor pago de R$ 7.500,00, monetariamente atualizado pelo IPCA e acrescido de juros legais; b) Indenização por danos morais no valor de R$ 8.000,00.",
  type: "textarea",
  required: true,
};

const baseFundamentos: PieceField = {
  id: "fundamentos",
  label: "Fundamentos legais a destacar (opcional)",
  helper:
    "Quer enfatizar algum dispositivo ou súmula específica? A IA já inclui os principais aplicáveis à área. Aqui você adiciona prioritários do seu caso.",
  placeholder:
    "Ex.: art. 14 e art. 18 do CDC; Súmula 297 do STJ; CF art. 5º, XXXII; Lei 9.656/98 se for plano de saúde; Lei 8.245/91 se for locação",
  type: "textarea",
  required: false,
};

const baseValor: PieceField = {
  id: "valor_causa",
  label: "Valor da causa",
  helper: "Informe um valor estimado em R$.",
  placeholder: "Ex.: 15.000,00",
  type: "text",
  required: false,
};

const baseComarca: PieceField = {
  id: "comarca",
  label: "Comarca / Juízo",
  helper: "Comarca e vara competentes.",
  placeholder: "Ex.: 3ª Vara Cível da Comarca de São Paulo/SP",
  type: "text",
  required: true,
};

const numeroProcesso: PieceField = {
  id: "numero_processo",
  label: "Número do processo",
  type: "text",
  required: true,
  placeholder: "Ex.: 1001234-56.2026.8.26.0100",
};

// =============================================================
// Definição completa dos tipos
// =============================================================
export const PIECE_TYPES: Record<PieceTypeId, PieceType> = {
  // -------- Cíveis / Processo Civil --------
  peticao_inicial: {
    id: "peticao_inicial",
    label: "Petição Inicial",
    area: "civel",
    areaLabel: "Direito Civil",
    description: "Peça que inaugura o processo, com qualificação, fatos, fundamentos e pedidos.",
    icon: "📝",
    estimatedMinutes: 12,
    popularity: 95,
    badge: "popular",
    fields: [
      baseComarca,
      {
        id: "area_direito",
        label: "Área do Direito",
        type: "select",
        required: true,
        options: [
          { value: "Direito Civil", label: "Direito Civil" },
          { value: "Direito do Consumidor", label: "Direito do Consumidor" },
          { value: "Direito do Trabalho", label: "Direito do Trabalho" },
          { value: "Direito de Família", label: "Direito de Família" },
          { value: "Direito Tributário", label: "Direito Tributário" },
          { value: "Direito Previdenciário", label: "Direito Previdenciário" },
        ],
      },
      ...baseParties,
      baseFacts,
      baseRequest,
      baseFundamentos,
      baseValor,
    ],
  },
  contestacao: {
    id: "contestacao",
    label: "Contestação",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Resposta do réu, com preliminares e mérito, conforme art. 335 e ss. do CPC.",
    icon: "🛡️",
    estimatedMinutes: 10,
    popularity: 88,
    badge: "popular",
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "alegacoes_autor", label: "Resumo das alegações da inicial", type: "textarea", required: true, helper: "Apresente o que a parte autora alegou para que a IA refute ponto a ponto." },
      { id: "preliminares", label: "Preliminares pretendidas", type: "textarea", required: false, helper: "Ex.: ilegitimidade passiva, prescrição, inépcia, etc." },
      { id: "tese_defesa", label: "Tese de defesa (mérito)", type: "textarea", required: true, helper: "Descreva os argumentos centrais da defesa." },
      baseFundamentos,
    ],
  },
  replica: {
    id: "replica",
    label: "Réplica",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Manifestação da parte autora sobre a contestação, impugnando seus argumentos.",
    icon: "↩️",
    estimatedMinutes: 8,
    popularity: 60,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "pontos_contestacao", label: "Pontos da contestação a impugnar", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  apelacao: {
    id: "apelacao",
    label: "Recurso de Apelação",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Razões de apelação contra sentença, com pedido de reforma ou anulação.",
    icon: "🎯",
    estimatedMinutes: 14,
    popularity: 70,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "sintese_sentenca", label: "Síntese da sentença recorrida", type: "textarea", required: true },
      { id: "razoes_reforma", label: "Razões de reforma / pontos atacados", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  agravo_instrumento: {
    id: "agravo_instrumento",
    label: "Agravo de Instrumento",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Recurso contra decisão interlocutória, conforme art. 1.015 do CPC.",
    icon: "⚡",
    estimatedMinutes: 11,
    popularity: 55,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "decisao_atacada", label: "Decisão atacada (transcrição)", type: "textarea", required: true },
      { id: "razoes_recurso", label: "Razões do recurso", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  embargos_declaracao: {
    id: "embargos_declaracao",
    label: "Embargos de Declaração",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Embargos para sanar omissão, contradição, obscuridade ou erro material.",
    icon: "🔍",
    estimatedMinutes: 6,
    popularity: 50,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "vicio", label: "Vício apontado (omissão/contradição/obscuridade/erro)", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  manifestacao: {
    id: "manifestacao",
    label: "Manifestação",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Manifestação genérica sobre decisão, juntada, prova ou despacho judicial.",
    icon: "💬",
    estimatedMinutes: 5,
    popularity: 65,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "objeto_manifestacao", label: "Objeto da manifestação", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  cumprimento_sentenca: {
    id: "cumprimento_sentenca",
    label: "Cumprimento de Sentença",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Petição de cumprimento de sentença, com memória de cálculo (art. 523 CPC).",
    icon: "🧾",
    estimatedMinutes: 10,
    popularity: 58,
    badge: "new",
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "objeto_titulo", label: "Objeto do título executivo", type: "textarea", required: true, helper: "Sentença/acordão que se executa, valor, prazo, etc." },
      { id: "memoria_calculo", label: "Memória de cálculo atualizada", type: "textarea", required: true, helper: "Valor principal + correção + juros + honorários." },
    ],
  },
  embargos_execucao: {
    id: "embargos_execucao",
    label: "Embargos à Execução",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Defesa do executado contra execução fundada em título extrajudicial.",
    icon: "⛔",
    estimatedMinutes: 11,
    popularity: 40,
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "titulo_executivo", label: "Título executivo questionado", type: "textarea", required: true },
      { id: "teses_defesa", label: "Teses defensivas", type: "textarea", required: true, helper: "Ex.: excesso de execução, nulidade do título, pagamento, prescrição." },
      baseFundamentos,
    ],
  },
  acao_monitoria: {
    id: "acao_monitoria",
    label: "Ação Monitória",
    area: "civel",
    areaLabel: "Direito Civil",
    description: "Para cobrar dívida com prova escrita sem força executiva (art. 700 CPC).",
    icon: "💰",
    estimatedMinutes: 9,
    popularity: 45,
    badge: "new",
    fields: [
      baseComarca,
      ...baseParties,
      { id: "prova_escrita", label: "Prova escrita da dívida", type: "textarea", required: true, helper: "Cheque, contrato, e-mail, recibo, etc." },
      { id: "valor_divida", label: "Valor da dívida (R$)", type: "text", required: true },
      baseFundamentos,
    ],
  },
  tutela_urgencia: {
    id: "tutela_urgencia",
    label: "Tutela de Urgência",
    area: "processual",
    areaLabel: "Processual Civil",
    description: "Pedido liminar com probabilidade do direito e perigo de dano (art. 300 CPC).",
    icon: "🚨",
    estimatedMinutes: 8,
    popularity: 72,
    badge: "trending",
    fields: [
      baseComarca,
      numeroProcesso,
      ...baseParties,
      { id: "probabilidade_direito", label: "Probabilidade do direito (fumus boni iuris)", type: "textarea", required: true },
      { id: "perigo_dano", label: "Perigo de dano (periculum in mora)", type: "textarea", required: true },
      { id: "pedido_liminar", label: "Providência liminar requerida", type: "textarea", required: true },
    ],
  },

  // -------- Família --------
  acao_alimentos: {
    id: "acao_alimentos",
    label: "Ação de Alimentos",
    area: "familia",
    areaLabel: "Direito de Família",
    description: "Ação para fixação ou revisão de pensão alimentícia.",
    icon: "🍼",
    estimatedMinutes: 10,
    popularity: 75,
    badge: "popular",
    fields: [
      baseComarca,
      { id: "alimentante", label: "Alimentante (quem paga)", type: "textarea", required: true },
      { id: "alimentado", label: "Alimentado (quem recebe)", type: "textarea", required: true },
      { id: "necessidades", label: "Necessidades do alimentado", type: "textarea", required: true, helper: "Despesas mensais detalhadas: alimentação, educação, saúde, vestuário." },
      { id: "possibilidades", label: "Possibilidades do alimentante", type: "textarea", required: true, helper: "Renda, profissão, patrimônio." },
      { id: "valor_pedido", label: "Valor pleiteado (R$ ou % do salário)", type: "text", required: true },
    ],
  },
  divorcio_consensual: {
    id: "divorcio_consensual",
    label: "Divórcio Consensual",
    area: "familia",
    areaLabel: "Direito de Família",
    description: "Petição de divórcio consensual, com partilha e guarda quando aplicável.",
    icon: "💔",
    estimatedMinutes: 10,
    popularity: 60,
    fields: [
      baseComarca,
      { id: "conjuge_a", label: "Cônjuge A", type: "textarea", required: true },
      { id: "conjuge_b", label: "Cônjuge B", type: "textarea", required: true },
      { id: "regime_bens", label: "Regime de bens", type: "text", required: true, placeholder: "Comunhão parcial / total / separação / participação final" },
      { id: "filhos", label: "Filhos (se houver)", type: "textarea", required: false, helper: "Nome, idade, regime de guarda, visitação e alimentos." },
      { id: "partilha", label: "Partilha de bens", type: "textarea", required: false },
    ],
  },
  guarda_compartilhada: {
    id: "guarda_compartilhada",
    label: "Guarda Compartilhada",
    area: "familia",
    areaLabel: "Direito de Família",
    description: "Ação para regulamentação ou alteração da guarda dos filhos.",
    icon: "🧒",
    estimatedMinutes: 10,
    popularity: 50,
    fields: [
      baseComarca,
      { id: "pais", label: "Genitores (qualificação)", type: "textarea", required: true },
      { id: "filhos", label: "Filhos (nome, idade)", type: "textarea", required: true },
      { id: "situacao_atual", label: "Situação atual da convivência", type: "textarea", required: true },
      { id: "proposta", label: "Proposta de regulamentação", type: "textarea", required: true },
    ],
  },

  // -------- Penal --------
  habeas_corpus: {
    id: "habeas_corpus",
    label: "Habeas Corpus",
    area: "penal",
    areaLabel: "Direito Penal",
    description: "Habeas corpus liberatório ou preventivo (art. 5º, LXVIII, CF).",
    icon: "⚖️",
    estimatedMinutes: 9,
    popularity: 78,
    badge: "popular",
    fields: [
      { id: "tribunal", label: "Tribunal / Órgão coator", type: "text", required: true, helper: "Ex.: TJSP – 5ª Câmara Criminal" },
      { id: "paciente", label: "Paciente", type: "textarea", required: true, helper: "Qualificação do paciente." },
      { id: "autoridade_coatora", label: "Autoridade coatora", type: "text", required: true },
      { id: "fatos", label: "Fatos / ato coator", type: "textarea", required: true },
      { id: "pedido_liminar", label: "Pedido liminar pretendido?", type: "textarea", required: false },
      baseFundamentos,
    ],
  },
  resposta_acusacao: {
    id: "resposta_acusacao",
    label: "Resposta à Acusação",
    area: "penal",
    areaLabel: "Direito Penal",
    description: "Defesa preliminar no rito comum (art. 396-A CPP).",
    icon: "📩",
    estimatedMinutes: 9,
    popularity: 55,
    fields: [
      baseComarca,
      numeroProcesso,
      { id: "acusado", label: "Acusado(a)", type: "textarea", required: true },
      { id: "imputacao", label: "Imputação penal", type: "textarea", required: true, helper: "Síntese da denúncia recebida." },
      { id: "teses_preliminares", label: "Teses preliminares", type: "textarea", required: false, helper: "Inépcia, ausência de justa causa, prescrição..." },
      { id: "teses_mérito", label: "Teses de mérito", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  alegacoes_finais: {
    id: "alegacoes_finais",
    label: "Alegações Finais (Memoriais)",
    area: "penal",
    areaLabel: "Direito Penal",
    description: "Memoriais defensivos após instrução penal (art. 403 CPP).",
    icon: "🏛️",
    estimatedMinutes: 14,
    popularity: 48,
    fields: [
      baseComarca,
      numeroProcesso,
      { id: "acusado", label: "Acusado(a)", type: "textarea", required: true },
      { id: "sintese_acusacao", label: "Síntese da acusação e instrução", type: "textarea", required: true },
      { id: "provas_relevantes", label: "Provas relevantes produzidas", type: "textarea", required: true },
      { id: "tese_absolutoria", label: "Tese absolutória / mitigadora", type: "textarea", required: true },
    ],
  },

  // -------- Administrativo / Constitucional --------
  mandado_seguranca: {
    id: "mandado_seguranca",
    label: "Mandado de Segurança",
    area: "administrativo",
    areaLabel: "Direito Administrativo",
    description: "MS contra ato de autoridade que viole direito líquido e certo (Lei 12.016/09).",
    icon: "🛡️",
    estimatedMinutes: 11,
    popularity: 65,
    badge: "trending",
    fields: [
      { id: "vara_competente", label: "Vara / Tribunal competente", type: "text", required: true },
      { id: "impetrante", label: "Impetrante", type: "textarea", required: true },
      { id: "autoridade_coatora", label: "Autoridade coatora", type: "text", required: true },
      { id: "ato_coator", label: "Ato coator (descrição)", type: "textarea", required: true },
      { id: "direito_liquido_certo", label: "Direito líquido e certo violado", type: "textarea", required: true },
      { id: "pedido_liminar", label: "Pedido liminar?", type: "textarea", required: false },
      baseFundamentos,
    ],
  },
  defesa_processo_administrativo: {
    id: "defesa_processo_administrativo",
    label: "Defesa em Processo Administrativo",
    area: "administrativo",
    areaLabel: "Direito Administrativo",
    description: "Defesa em PAD, processo do PROCON, multas de trânsito, ANATEL, etc.",
    icon: "📋",
    estimatedMinutes: 8,
    popularity: 42,
    fields: [
      { id: "orgao", label: "Órgão / autoridade", type: "text", required: true },
      { id: "processo_administrativo", label: "Nº do processo administrativo", type: "text", required: false },
      { id: "interessado", label: "Interessado / autuado", type: "textarea", required: true },
      { id: "infracao_imputada", label: "Infração imputada", type: "textarea", required: true },
      { id: "tese_defensiva", label: "Tese defensiva", type: "textarea", required: true },
      baseFundamentos,
    ],
  },

  // -------- Consumidor --------
  reclamacao_procon: {
    id: "reclamacao_procon",
    label: "Reclamação ao PROCON",
    area: "consumidor",
    areaLabel: "Direito do Consumidor",
    description: "Reclamação formal contra fornecedor com fundamento no CDC.",
    icon: "📣",
    estimatedMinutes: 5,
    popularity: 70,
    badge: "new",
    fields: [
      { id: "consumidor", label: "Consumidor (qualificação)", type: "textarea", required: true },
      { id: "fornecedor", label: "Fornecedor (razão social, CNPJ, endereço)", type: "textarea", required: true },
      { id: "produto_servico", label: "Produto ou serviço", type: "text", required: true },
      { id: "fatos", label: "Histórico do problema", type: "textarea", required: true },
      { id: "providencias_tentadas", label: "Providências já tentadas", type: "textarea", required: false },
      { id: "pedido", label: "Pedido ao PROCON", type: "textarea", required: true },
    ],
  },
  acao_consumidor_juizado: {
    id: "acao_consumidor_juizado",
    label: "Ação de Consumidor — Juizado Especial",
    area: "consumidor",
    areaLabel: "Direito do Consumidor",
    description: "Inicial para o JEC (Lei 9.099/95) em causas até 40 SM.",
    icon: "🧑‍⚖️",
    estimatedMinutes: 8,
    popularity: 68,
    fields: [
      { id: "juizado", label: "Juizado Especial", type: "text", required: true, placeholder: "Ex.: 1º JEC Central — Foro de São Paulo/SP" },
      { id: "autor", label: "Autor (consumidor)", type: "textarea", required: true },
      { id: "reu", label: "Réu (fornecedor)", type: "textarea", required: true },
      { id: "fatos", label: "Fatos", type: "textarea", required: true },
      { id: "pedido", label: "Pedidos", type: "textarea", required: true, helper: "Indenização material, danos morais, obrigação de fazer." },
      { id: "valor_causa", label: "Valor da causa (até 40 SM)", type: "text", required: true },
    ],
  },

  // -------- Trabalho --------
  reclamacao_trabalhista: {
    id: "reclamacao_trabalhista",
    label: "Reclamação Trabalhista",
    area: "trabalho",
    areaLabel: "Direito do Trabalho",
    description: "Inicial trabalhista pleiteando verbas rescisórias e demais direitos.",
    icon: "👷",
    estimatedMinutes: 10,
    popularity: 80,
    badge: "popular",
    fields: [
      { id: "vara_trabalho", label: "Vara do Trabalho", type: "text", required: true, placeholder: "Ex.: 3ª Vara do Trabalho de São Paulo/SP" },
      { id: "reclamante", label: "Reclamante", type: "textarea", required: true },
      { id: "reclamada", label: "Reclamada", type: "textarea", required: true },
      { id: "contrato_trabalho", label: "Contrato de trabalho", type: "textarea", required: true, helper: "Admissão, função, salário, jornada, demissão." },
      { id: "verbas_pleiteadas", label: "Verbas pleiteadas", type: "textarea", required: true, helper: "Aviso prévio, FGTS, multa, horas extras, etc." },
      { id: "valor_causa", label: "Valor da causa", type: "text", required: false },
    ],
  },
  defesa_trabalhista: {
    id: "defesa_trabalhista",
    label: "Defesa Trabalhista",
    area: "trabalho",
    areaLabel: "Direito do Trabalho",
    description: "Contestação trabalhista, com preliminares e impugnação ponto a ponto.",
    icon: "🛡️",
    estimatedMinutes: 11,
    popularity: 52,
    fields: [
      { id: "vara_trabalho", label: "Vara do Trabalho", type: "text", required: true },
      numeroProcesso,
      { id: "reclamante", label: "Reclamante", type: "textarea", required: true },
      { id: "reclamada", label: "Reclamada", type: "textarea", required: true },
      { id: "pedidos_inicial", label: "Pedidos da inicial", type: "textarea", required: true },
      { id: "tese_defesa", label: "Tese defensiva", type: "textarea", required: true },
    ],
  },

  // -------- Documentos extraprocessuais --------
  parecer: {
    id: "parecer",
    label: "Parecer Jurídico",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Parecer técnico sobre questão jurídica determinada.",
    icon: "📊",
    estimatedMinutes: 12,
    popularity: 45,
    fields: [
      { id: "tema", label: "Tema / consulta", type: "textarea", required: true },
      { id: "contexto", label: "Contexto fático", type: "textarea", required: true },
      baseFundamentos,
    ],
  },
  notificacao_extrajudicial: {
    id: "notificacao_extrajudicial",
    label: "Notificação Extrajudicial",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Notificação para constituição em mora, rescisão, cobrança ou cessação.",
    icon: "📨",
    estimatedMinutes: 5,
    popularity: 62,
    badge: "new",
    fields: [
      { id: "notificante", label: "Notificante", type: "textarea", required: true },
      { id: "notificado", label: "Notificado", type: "textarea", required: true },
      { id: "objeto", label: "Objeto da notificação", type: "textarea", required: true },
      { id: "prazo_resposta", label: "Prazo para resposta", type: "text", required: false, placeholder: "Ex.: 10 dias úteis" },
    ],
  },
  procuracao: {
    id: "procuracao",
    label: "Procuração Ad Judicia",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Procuração para atuação judicial e extrajudicial.",
    icon: "✍️",
    estimatedMinutes: 3,
    popularity: 55,
    fields: [
      { id: "outorgante", label: "Outorgante (constituinte)", type: "textarea", required: true },
      { id: "outorgado", label: "Outorgado (advogado/escritório)", type: "textarea", required: true },
      { id: "poderes", label: "Poderes específicos (opcional)", type: "textarea", required: false, helper: "Ex.: dar quitação, transigir, receber, etc." },
    ],
  },
  contrato_servicos: {
    id: "contrato_servicos",
    label: "Contrato de Prestação de Serviços",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Minuta padrão de contrato de prestação de serviços.",
    icon: "🤝",
    estimatedMinutes: 8,
    popularity: 58,
    fields: [
      { id: "contratante", label: "Contratante", type: "textarea", required: true },
      { id: "contratada", label: "Contratada", type: "textarea", required: true },
      { id: "objeto", label: "Objeto e escopo", type: "textarea", required: true },
      { id: "valor_prazo", label: "Valor e prazo de pagamento", type: "textarea", required: true },
      { id: "vigencia", label: "Vigência", type: "text", required: true },
      { id: "clausulas_especificas", label: "Cláusulas específicas (opcional)", type: "textarea", required: false },
    ],
  },
  contrato_locacao: {
    id: "contrato_locacao",
    label: "Contrato de Locação Residencial",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Minuta de locação residencial (Lei 8.245/91).",
    icon: "🏠",
    estimatedMinutes: 9,
    popularity: 50,
    fields: [
      { id: "locador", label: "Locador", type: "textarea", required: true },
      { id: "locatario", label: "Locatário", type: "textarea", required: true },
      { id: "imovel", label: "Imóvel (endereço completo)", type: "textarea", required: true },
      { id: "aluguel", label: "Valor do aluguel", type: "text", required: true },
      { id: "prazo", label: "Prazo de locação", type: "text", required: true, placeholder: "Ex.: 30 meses" },
      { id: "garantia", label: "Garantia (caução / fiador / seguro)", type: "text", required: false },
    ],
  },
  contrato_nda: {
    id: "contrato_nda",
    label: "Acordo de Confidencialidade (NDA)",
    area: "extrajudicial",
    areaLabel: "Extrajudicial",
    description: "Termo de confidencialidade unilateral ou bilateral.",
    icon: "🔒",
    estimatedMinutes: 6,
    popularity: 38,
    badge: "new",
    fields: [
      { id: "parte_a", label: "Parte A", type: "textarea", required: true },
      { id: "parte_b", label: "Parte B", type: "textarea", required: true },
      { id: "objeto_confidencial", label: "Informações confidenciais", type: "textarea", required: true },
      { id: "prazo_confidencialidade", label: "Prazo de confidencialidade", type: "text", required: true, placeholder: "Ex.: 5 anos" },
      { id: "bilateral", label: "Tipo", type: "select", required: true, options: [
        { value: "bilateral", label: "Bilateral (ambas as partes)" },
        { value: "unilateral", label: "Unilateral (uma parte revela)" },
      ] },
    ],
  },
};

export const PIECE_TYPE_OPTIONS = Object.values(PIECE_TYPES).map((p) => ({
  value: p.id,
  label: p.label,
}));

export const PIECES_BY_AREA: Record<AreaId, PieceType[]> = Object.values(PIECE_TYPES).reduce(
  (acc, p) => {
    acc[p.area] = acc[p.area] ?? [];
    acc[p.area].push(p);
    return acc;
  },
  {} as Record<AreaId, PieceType[]>,
);

export function popularPieces(limit = 6): PieceType[] {
  return Object.values(PIECE_TYPES)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}
