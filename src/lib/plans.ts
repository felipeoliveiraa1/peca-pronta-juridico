export type PlanId = "free" | "basic" | "premium" | "professional";

export interface Plan {
  id: PlanId;
  name: string;
  audience: string;
  priceBRL: number;
  /** Monthly generation cap. null = unlimited. */
  monthlyGenerationLimit: number | null;
  /** Monthly chat IA cap. null = unlimited. */
  chatMessageLimit: number | null;
  /** Whether the plan unlocks premium models in the library. */
  premiumTemplates: boolean;
  /** Whether the plan unlocks the juridical reviewer (vs grammar-only). */
  juridicalReviewer: boolean;
  /** Whether the plan unlocks document organizer / versions. */
  documentOrganizer: boolean;
  /** Whether the plan unlocks PJe/e-SAJ exports + collaboration. */
  professionalIntegrations: boolean;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Acesso Gratuito",
    audience: "Conheça a ferramenta",
    priceBRL: 0,
    monthlyGenerationLimit: 1,
    chatMessageLimit: 3,
    premiumTemplates: false,
    juridicalReviewer: false,
    documentOrganizer: false,
    professionalIntegrations: false,
    features: [
      "1 peça gerada por mês",
      "3 mensagens no Chat IA",
      "Modelos básicos da biblioteca",
    ],
  },
  basic: {
    id: "basic",
    name: "Estudante",
    audience: "Para estudantes de Direito",
    priceBRL: 19.9,
    monthlyGenerationLimit: 3,
    chatMessageLimit: 30,
    premiumTemplates: false,
    juridicalReviewer: false,
    documentOrganizer: false,
    professionalIntegrations: false,
    features: [
      "Até 3 peças geradas por mês",
      "30 mensagens no Chat IA",
      "Biblioteca de modelos básicos",
      "Revisor gramatical",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium (Estagiário/Jovem Advogado)",
    audience: "Para estagiários e jovens advogados",
    priceBRL: 59.9,
    monthlyGenerationLimit: null,
    chatMessageLimit: 200,
    premiumTemplates: true,
    juridicalReviewer: true,
    documentOrganizer: true,
    professionalIntegrations: false,
    features: [
      "Geração ilimitada de peças",
      "200 mensagens no Chat IA",
      "Biblioteca de modelos premium",
      "Atualização jurisprudencial",
      "Revisor jurídico inteligente",
      "Organizador de documentos",
    ],
  },
  professional: {
    id: "professional",
    name: "Profissional (Escritórios)",
    audience: "Para escritórios e equipes",
    priceBRL: 99.9,
    monthlyGenerationLimit: null,
    chatMessageLimit: null,
    premiumTemplates: true,
    juridicalReviewer: true,
    documentOrganizer: true,
    professionalIntegrations: true,
    features: [
      "Tudo do Premium",
      "Chat IA ilimitado",
      "Integração com PJe / e-SAJ",
      "Suporte prioritário",
      "Funcionalidades colaborativas",
    ],
  },
};

export const PAID_PLANS: PlanId[] = ["basic", "premium", "professional"];

export function getPlan(id: PlanId | string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}
