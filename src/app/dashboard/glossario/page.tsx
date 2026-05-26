import { GLOSSARY, GLOSSARY_AREAS } from "@/lib/glossario";
import { GlossaryView } from "./glossary-view";
import { BookOpen } from "lucide-react";

export const metadata = { title: "Glossário Jurídico — Peça Pronta" };

export default function GlossarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Glossário Jurídico</h1>
          <p className="mt-1 text-sm text-ink-700">
            {GLOSSARY.length} termos explicados em linguagem direta, com referência aos dispositivos
            legais.
          </p>
        </div>
      </div>

      <GlossaryView terms={GLOSSARY} areas={GLOSSARY_AREAS} />
    </div>
  );
}
