import { ReviewerWorkspace } from "./reviewer-workspace";
import { requireProfile } from "@/lib/profile";
import { getPlan } from "@/lib/plans";
import { ReviewerTour } from "@/components/dashboard/tour-steps";

export const metadata = { title: "Revisor jurídico — Peça Pronta" };

export default async function ReviewerPage() {
  const profile = await requireProfile();
  const planDef = getPlan(profile.plan);

  return (
    <div className="space-y-4">
      <ReviewerTour />
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Revisor inteligente</h1>
        <p className="mt-1 text-sm text-ink-700">
          Cole abaixo o trecho ou a peça completa que deseja revisar. Você receberá apontamentos
          gramaticais, técnicos e estruturais.
        </p>
      </div>
      <ReviewerWorkspace
        planLabel={planDef.name}
        juridicalEnabled={planDef.juridicalReviewer}
      />
    </div>
  );
}
