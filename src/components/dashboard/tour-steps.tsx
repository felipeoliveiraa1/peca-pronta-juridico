"use client";

import {
  Rocket,
  Sparkles,
  Library,
  FileText,
  ClipboardCheck,
  Calculator,
  Gavel,
  BookOpen,
  Settings,
  MessageCircle,
  Save,
  Wand2,
} from "lucide-react";
import { PageTour, type TourStep } from "./page-tour";

// ============================================================
// DASHBOARD HOME
// ============================================================
const DASHBOARD_STEPS: TourStep[] = [
  {
    icon: Rocket,
    emoji: "👋",
    title: "Bem-vindo(a) ao Peça Pronta!",
    body:
      "Em menos de 1 minuto você vai conhecer o app inteiro. Pode pular a qualquer momento — vamos mostrar tutoriais específicos em cada tela conforme você for explorando.",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Gere peças com IA em segundos",
    body:
      "Escolha o tipo de peça (30 disponíveis), preencha um formulário guiado com os dados do caso, e a IA entrega o rascunho técnico-jurídico em menos de 30 segundos.",
    cta: { label: "Ir para Gerar peça", href: "/dashboard/documents/new" },
  },
  {
    icon: MessageCircle,
    emoji: "💬",
    title: "Chat IA jurídico no canto da tela",
    body:
      "Tem um botão flutuante azul no canto inferior direito (atalho '/'). Use pra tirar dúvidas rápidas sobre Direito Brasileiro — prazos, conceitos, jurisprudência. Funciona em todas as telas.",
  },
  {
    icon: Library,
    emoji: "📚",
    title: "Tudo a um clique no menu",
    body:
      "À esquerda (ou no menu hamburguer ☰ no celular) você acessa: Gerar peça, Documentos, Modelos, Revisor, Calculadoras, Jurisprudência e Glossário.",
  },
];
export const DashboardTour = () => (
  <PageTour tourKey="dashboard" steps={DASHBOARD_STEPS} />
);

// ============================================================
// GERAR PEÇA
// ============================================================
const GENERATE_STEPS: TourStep[] = [
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Como gerar uma peça em 3 passos",
    body:
      "1. Escolha o tipo de peça no grid (filtros por área).\n2. Preencha os campos guiados (quanto mais detalhado, melhor).\n3. Clique em 'Gerar com IA' e em ~30s tem o rascunho pronto pra editar.",
  },
  {
    icon: FileText,
    emoji: "📝",
    title: "Dica: use linguagem técnica nos campos",
    body:
      "A IA performa muito melhor quando você usa termos jurídicos corretos (ex: 'inadimplemento contratual' em vez de 'não pagou'). Sem stress se não souber — descreva os fatos em ordem cronológica e a IA traduz pra peça.",
  },
  {
    icon: MessageCircle,
    emoji: "💡",
    title: "Travou? Pergunte ao Chat IA",
    body:
      "Se tiver dúvida sobre estrutura, fundamentação ou qual peça usar, clica no botão de chat (canto inferior direito) e pergunte. Ele te orienta antes da geração.",
  },
];
export const GenerateTour = () => (
  <PageTour tourKey="generate" steps={GENERATE_STEPS} />
);

// ============================================================
// EDITOR DE DOCUMENTO
// ============================================================
const EDITOR_STEPS: TourStep[] = [
  {
    icon: Wand2,
    emoji: "✏️",
    title: "Editor com IA integrada",
    body:
      "À direita você tem 5 ações de IA: Continuar texto, Adicionar fundamentação, Tom mais técnico, Encurtar, Resumir. Cada uma gera uma sugestão que você decide aceitar, substituir ou descartar.",
  },
  {
    icon: ClipboardCheck,
    emoji: "🔍",
    title: "Revisor inteligente + Apply Review",
    body:
      "Clica em 'Revisar agora' pra a IA analisar a peça em 4 dimensões (gramática, técnica, estrutura, fundamentação). Depois clica em '✨ Aplicar revisão completa' pra IA reescrever incorporando TODAS as sugestões — você revisa antes de salvar.",
  },
  {
    icon: Save,
    emoji: "💾",
    title: "Auto-save + Ctrl+S",
    body:
      "Suas alterações salvam automaticamente a cada 30s. Use Ctrl+S (ou Cmd+S no Mac) pra salvar na hora. As badges no topo mostram: ✓ Salvo / ⚠ Não salvo / Salvando…",
  },
  {
    icon: FileText,
    emoji: "📤",
    title: "Exporte em PDF, DOCX ou TXT",
    body:
      "Clica em 'Exportar' no topo direito. DOCX abre no Word pra edição final. PDF é só pra protocolo. TXT é versão simples pra arquivar.",
  },
];
export const EditorTour = () => (
  <PageTour tourKey="editor" steps={EDITOR_STEPS} />
);

// ============================================================
// TEMPLATES (Biblioteca)
// ============================================================
const TEMPLATES_STEPS: TourStep[] = [
  {
    icon: Library,
    emoji: "📚",
    title: "Biblioteca de 27 modelos revisados",
    body:
      "Modelos prontos divididos por área (Civil, Trabalho, Penal, Família, Consumidor, Adm, Extrajudicial). Filtra por área ou busca por palavra-chave.",
  },
  {
    icon: FileText,
    emoji: "✂️",
    title: "Clone e edite como quiser",
    body:
      "Clica no modelo → 'Usar este modelo' → ele vira um documento seu pra editar livremente. Não modifica o modelo original.",
  },
  {
    icon: Sparkles,
    emoji: "💎",
    title: "Modelos premium",
    body:
      "Os modelos marcados com 👑 são exclusivos dos planos Premium/Profissional. No plano gratuito você tem acesso aos básicos.",
  },
];
export const TemplatesTour = () => (
  <PageTour tourKey="templates" steps={TEMPLATES_STEPS} />
);

// ============================================================
// REVISOR
// ============================================================
const REVIEWER_STEPS: TourStep[] = [
  {
    icon: ClipboardCheck,
    emoji: "🔍",
    title: "Análise em 4 dimensões",
    body:
      "(A) Gramática · (B) Padrão técnico-jurídico · (C) Estrutura e coesão · (D) Fundamentação legal. Cole qualquer peça (ou trecho) e receba apontamentos pontuais com sugestões.",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Quer aplicar tudo de uma vez?",
    body:
      "Use o Revisor diretamente dentro do editor de um documento aberto — lá tem o botão 'Aplicar revisão completa' que reescreve a peça inteira incorporando as sugestões.",
    cta: { label: "Meus documentos", href: "/dashboard/documents" },
  },
];
export const ReviewerTour = () => (
  <PageTour tourKey="reviewer" steps={REVIEWER_STEPS} />
);

// ============================================================
// CALCULADORAS
// ============================================================
const CALCULATORS_STEPS: TourStep[] = [
  {
    icon: Calculator,
    emoji: "🧮",
    title: "4 calculadoras pro dia a dia",
    body:
      "1️⃣ Prazo processual em dias úteis (CPC art. 219)\n2️⃣ Atualização de valor (juros + correção IPCA)\n3️⃣ Custas processuais estimadas\n4️⃣ Multa diária / astreintes",
  },
  {
    icon: Calculator,
    emoji: "⚡",
    title: "Use rápido durante uma audiência",
    body:
      "Tudo client-side — funciona offline. Resultado em tempo real conforme digita. Sempre confira a tabela oficial do seu tribunal antes de protocolar (custas variam por TJ/TRT/TRF).",
  },
];
export const CalculatorsTour = () => (
  <PageTour tourKey="calculators" steps={CALCULATORS_STEPS} />
);

// ============================================================
// JURISPRUDÊNCIA
// ============================================================
const JURISPRUDENCE_STEPS: TourStep[] = [
  {
    icon: Gavel,
    emoji: "⚖️",
    title: "Precedentes selecionados a dedo",
    body:
      "Decisões importantes do STF, STJ, TST e tribunais — atualizados periodicamente. Filtra por área e tribunal.",
  },
  {
    icon: FileText,
    emoji: "📋",
    title: "Copiar tese pronta",
    body:
      "Cada precedente tem o botão 'Copiar tese' — copia o trecho formatado com fonte pra colar direto na sua peça em rascunho.",
  },
];
export const JurisprudenceTour = () => (
  <PageTour tourKey="jurisprudence" steps={JURISPRUDENCE_STEPS} />
);

// ============================================================
// GLOSSÁRIO
// ============================================================
const GLOSSARY_STEPS: TourStep[] = [
  {
    icon: BookOpen,
    emoji: "📖",
    title: "57 termos jurídicos explicados",
    body:
      "Termos do CPC, CC, CDC, CLT, etc. — cada um com explicação em linguagem direta e referência ao artigo correspondente. Organizado A-Z.",
  },
  {
    icon: BookOpen,
    emoji: "🔎",
    title: "Filtra por área ou busca direto",
    body:
      "Use os chips no topo pra filtrar por área (Processual, Civil, Penal, etc.) ou digite na busca pra achar instantâneo.",
  },
];
export const GlossaryTour = () => (
  <PageTour tourKey="glossary" steps={GLOSSARY_STEPS} />
);

// ============================================================
// SETTINGS
// ============================================================
const SETTINGS_STEPS: TourStep[] = [
  {
    icon: Settings,
    emoji: "⚙️",
    title: "Gerencie seu plano",
    body:
      "Aqui vc vê seu uso do mês, faz upgrade/downgrade e gerencia método de pagamento. Cancelamento é direto na área do cliente da Kiwify — sem multa, sem fidelidade.",
  },
];
export const SettingsTour = () => (
  <PageTour tourKey="settings" steps={SETTINGS_STEPS} />
);
