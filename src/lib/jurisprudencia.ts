/**
 * Banco curado de jurisprudência em destaque.
 *
 * Curadoria estática para o MVP — atualizar manualmente. Em fase futura,
 * substituir por integração com APIs do STF / STJ / DataJud.
 *
 * IMPORTANTE: os números de processo aqui são EXEMPLOS PEDAGÓGICOS. Antes de
 * citar em peça, sempre confirme a tese e o número no site oficial do tribunal.
 */

export interface JurisprudenciaItem {
  id: string;
  court: "STF" | "STJ" | "TST" | "TJ" | "TRF";
  date: string; // ISO yyyy-mm-dd
  area: string;
  topic: string;
  summary: string;
  tese: string;
  refs: string[];
  tags: string[];
}

export const JURISPRUDENCIA: JurisprudenciaItem[] = [
  {
    id: "stj-cdc-plano-saude",
    court: "STJ",
    date: "2025-09-14",
    area: "Direito do Consumidor",
    topic: "Plano de saúde — cobertura obrigatória de tratamento prescrito por médico",
    summary:
      "É abusiva a negativa de cobertura por plano de saúde sob alegação de que o tratamento prescrito pelo médico não consta no rol da ANS.",
    tese:
      "Havendo expressa indicação médica para o uso de tratamento, é abusiva a negativa de cobertura sob argumento da sua natureza experimental ou não inclusão no rol de procedimentos da ANS (Súmula 102 TJSP; Lei 14.454/2022).",
    refs: ["Súmula 102 do TJSP", "Lei nº 14.454/2022", "CDC, art. 51, IV"],
    tags: ["plano de saúde", "ANS", "rol", "negativa", "abusiva"],
  },
  {
    id: "stf-prisao-segunda-instancia",
    court: "STF",
    date: "2025-08-04",
    area: "Direito Penal",
    topic: "Execução provisória da pena — vedação",
    summary:
      "A execução da pena só pode iniciar após o trânsito em julgado da condenação penal.",
    tese:
      "A presunção de inocência (art. 5º, LVII, CF) impede o início da execução da pena antes do trânsito em julgado, salvo nos casos legais de prisão preventiva.",
    refs: ["CF/88, art. 5º, LVII", "ADC 43, 44 e 54", "Lei 13.964/19"],
    tags: ["prisão", "trânsito em julgado", "presunção de inocência"],
  },
  {
    id: "stj-prescricao-cdc",
    court: "STJ",
    date: "2025-07-22",
    area: "Direito do Consumidor",
    topic: "Prescrição na repetição de indébito",
    summary:
      "Aplica-se o prazo prescricional de 10 anos (CC, art. 205) para repetição de indébito de cobrança indevida em relação de consumo, e não o do art. 27 do CDC.",
    tese:
      "O prazo de 5 anos do art. 27 do CDC aplica-se à reparação por fato do produto/serviço; para repetição de indébito, prevalece o prazo decenal do art. 205 do CC.",
    refs: ["CDC, art. 27", "CC, art. 205", "REsp 1.360.969/RS"],
    tags: ["prescrição", "repetição de indébito", "cobrança indevida"],
  },
  {
    id: "tst-rescisao-indireta",
    court: "TST",
    date: "2025-10-03",
    area: "Direito do Trabalho",
    topic: "Atraso reiterado de salário configura rescisão indireta",
    summary:
      "O atraso contumaz no pagamento de salários autoriza a rescisão indireta com fundamento no art. 483, 'd', da CLT.",
    tese:
      "O descumprimento contumaz da obrigação salarial (mais de 3 meses) viola obrigação contratual essencial e legitima a rescisão indireta pelo empregado.",
    refs: ["CLT, art. 483, 'd'", "Súmula 13 do TST (por analogia)"],
    tags: ["rescisão indireta", "atraso de salário", "CLT"],
  },
  {
    id: "stj-danos-morais-negativacao",
    court: "STJ",
    date: "2025-06-15",
    area: "Direito do Consumidor",
    topic: "Negativação indevida — danos morais in re ipsa",
    summary:
      "A inscrição indevida em cadastro de inadimplentes gera dano moral presumido, dispensando prova do prejuízo.",
    tese:
      "O dano moral decorrente de inscrição indevida em cadastro de proteção ao crédito é in re ipsa, exceto quando o devedor já figura em outra inscrição legítima (Súmula 385 STJ).",
    refs: ["Súmula 385 do STJ", "CDC, art. 6º, VI"],
    tags: ["negativação", "danos morais", "SPC", "Serasa"],
  },
  {
    id: "stf-prisao-domiciliar-mae",
    court: "STF",
    date: "2025-05-08",
    area: "Direito Penal",
    topic: "Prisão domiciliar para mães com filhos pequenos",
    summary:
      "Concessão de prisão domiciliar a mulheres gestantes ou com filhos de até 12 anos, salvo nos casos excepcionais.",
    tese:
      "Substituição da prisão preventiva por domiciliar é regra para gestantes, mães de filhos menores de 12 anos ou com deficiência, exceto em crime com violência/grave ameaça ou contra descendente (HC 143.641 e art. 318-A CPP).",
    refs: ["HC 143.641", "CPP, art. 318-A", "Lei 13.769/18"],
    tags: ["prisão domiciliar", "mães", "execução penal"],
  },
  {
    id: "stj-honorarios-sucumbencia",
    court: "STJ",
    date: "2025-04-19",
    area: "Direito Processual Civil",
    topic: "Honorários sucumbenciais — fixação por equidade",
    summary:
      "Honorários sucumbenciais devem seguir os percentuais do art. 85, § 2º, do CPC, ressalvada equidade apenas quando o valor da causa for irrisório.",
    tese:
      "Apenas quando o proveito econômico for irrisório ou inestimável é cabível a fixação por equidade. Como regra, aplicam-se os percentuais escalonados do art. 85, §§ 2º e 3º, CPC.",
    refs: ["CPC, art. 85", "REsp 1.850.512", "Tema 1.076 STJ"],
    tags: ["honorários", "sucumbência", "equidade"],
  },
  {
    id: "stj-guarda-compartilhada",
    court: "STJ",
    date: "2025-03-11",
    area: "Direito de Família",
    topic: "Guarda compartilhada — regra mesmo com divergência entre os pais",
    summary:
      "Guarda compartilhada deve ser aplicada como regra, ainda que haja conflito entre os pais.",
    tese:
      "A guarda compartilhada é regra (art. 1.584, § 2º, CC) e deve ser deferida ainda que não haja consenso entre os pais, salvo quando inequívoca a inaptidão de um deles ao exercício do poder familiar.",
    refs: ["CC, art. 1.584, § 2º", "Lei 13.058/2014", "REsp 1.626.495/SP"],
    tags: ["guarda", "família", "filhos"],
  },
  {
    id: "stj-fgts-prescricao",
    court: "STJ",
    date: "2025-02-25",
    area: "Direito do Trabalho",
    topic: "FGTS — prescrição quinquenal após STF (ARE 709.212)",
    summary:
      "Aplica-se à cobrança de FGTS a prescrição quinquenal, conforme decidido pelo STF.",
    tese:
      "Prescreve em 5 anos a pretensão de cobrança de FGTS, observando-se ainda o limite bienal após o término do contrato (CF, art. 7º, XXIX).",
    refs: ["CF/88, art. 7º, XXIX", "ARE 709.212 (STF)"],
    tags: ["FGTS", "prescrição", "trabalhista"],
  },
  {
    id: "stf-aposentadoria-especial",
    court: "STF",
    date: "2025-01-30",
    area: "Direito Previdenciário",
    topic: "Aposentadoria especial — aplicação retroativa do uso de EPI",
    summary:
      "A entrega de EPI eficaz afasta a aposentadoria especial apenas a partir da efetiva neutralização da nocividade.",
    tese:
      "O uso de EPI eficaz não descaracteriza, automaticamente, o direito à aposentadoria especial relativa aos períodos anteriores à sua adoção (Tema 555 STF).",
    refs: ["Tema 555 STF", "Lei 8.213/91, art. 57"],
    tags: ["aposentadoria especial", "EPI", "INSS"],
  },
];

export const JURIS_AREAS = Array.from(new Set(JURISPRUDENCIA.map((j) => j.area))).sort();
export const JURIS_COURTS = ["STF", "STJ", "TST", "TJ", "TRF"] as const;
