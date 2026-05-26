/**
 * Banco de "dicas do dia" — varia conforme dia do ano para o usuário sempre
 * ver uma dica diferente sem precisar de cron / DB.
 */
export interface DailyTip {
  title: string;
  body: string;
  emoji: string;
  category: "produtividade" | "tecnica" | "novidade" | "atalho";
}

const TIPS: DailyTip[] = [
  {
    emoji: "⚡",
    category: "produtividade",
    title: "Use a busca para encontrar tipos de peça rápido",
    body: "Em 'Gerar peça', digite 'habeas', 'alimentos' ou 'agravo' na busca para chegar direto ao formulário guiado certo.",
  },
  {
    emoji: "📚",
    category: "produtividade",
    title: "Clone um modelo premium em vez de gerar do zero",
    body: "Na biblioteca de modelos, alguns casos rotineiros (cobrança, despejo, alimentos) já vêm 80% prontos. Mais rápido que preencher tudo na IA.",
  },
  {
    emoji: "✅",
    category: "tecnica",
    title: "Sempre revise dispositivos legais citados",
    body: "A IA pode citar um artigo correto mas em parágrafo errado. Antes de protocolar, confirme a redação no site do Planalto.",
  },
  {
    emoji: "📝",
    category: "tecnica",
    title: "Estrutura I-II-III é obrigatória em peças processuais",
    body: "Sempre divida sua peça em 'I - DOS FATOS', 'II - DO DIREITO', 'III - DOS PEDIDOS'. Ajuda o juiz a localizar argumentos rapidamente.",
  },
  {
    emoji: "🔁",
    category: "atalho",
    title: "Pressione Ctrl+S no editor para salvar a versão",
    body: "Cada save cria uma versão no histórico — você nunca perde texto editado por engano.",
  },
  {
    emoji: "🧠",
    category: "tecnica",
    title: "Tutela de urgência exige os dois requisitos",
    body: "Probabilidade do direito (fumus boni iuris) + perigo de dano (periculum in mora). Sem um dos dois, o pedido é negado de plano (art. 300 CPC).",
  },
  {
    emoji: "📅",
    category: "tecnica",
    title: "Prazo recursal: 15 dias úteis a partir da intimação",
    body: "Apelação, embargos infringentes, agravo de instrumento: todos seguem o prazo de 15 dias úteis. Use a calculadora de prazos para não errar.",
  },
  {
    emoji: "🎯",
    category: "produtividade",
    title: "Use o revisor inteligente antes de finalizar",
    body: "Cole sua peça no Revisor e receba sugestões de gramática, técnica jurídica, estrutura e fundamentação em segundos.",
  },
  {
    emoji: "💼",
    category: "produtividade",
    title: "Exporte em DOCX para editar no Word",
    body: "O PJe aceita upload de DOCX e PDF. Use DOCX se ainda for editar; PDF para protocolo final.",
  },
  {
    emoji: "📊",
    category: "tecnica",
    title: "Súmula 297 do STJ é seu amigo no CDC",
    body: "Aplicação do CDC nas instituições financeiras. Útil em ações bancárias e de cartão de crédito.",
  },
  {
    emoji: "⏱",
    category: "atalho",
    title: "Salve no formato final para encontrar depois",
    body: "Marque suas peças como 'Finalizado' quando estiverem prontas — facilita filtrar em 'Meus documentos'.",
  },
  {
    emoji: "🔍",
    category: "tecnica",
    title: "Cuidado com prescrição na ação de cobrança",
    body: "Pretensão de cobrança de dívida líquida: prescreve em 5 anos (CC art. 206, § 5º, I). Sempre verifique antes de redigir.",
  },
  {
    emoji: "✨",
    category: "produtividade",
    title: "Use marcadores [ ] no rascunho",
    body: "Se a IA usar marcadores como [ENDEREÇO] ou [INSERIR DATA], é exatamente onde você precisa completar com dados específicos do caso.",
  },
  {
    emoji: "📌",
    category: "novidade",
    title: "Atualização jurisprudencial em destaque",
    body: "Confira a aba 'Jurisprudência' para precedentes recentes do STF, STJ e tribunais — todos linkados para usar nas suas peças.",
  },
];

export function getTodayTip(): DailyTip {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return TIPS[dayOfYear % TIPS.length];
}
