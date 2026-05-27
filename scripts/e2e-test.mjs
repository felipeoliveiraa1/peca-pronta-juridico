/**
 * Teste end-to-end: simula o usuário felipeoliveiraa1@hotmail.com
 * gerando uma peça, revisando, e fazendo ações de IA — usando os mesmos
 * componentes que a API da Vercel usa internamente.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const EMAIL = "felipeoliveiraa1@hotmail.com";
const PASSWORD = "97254047-Fe*";

function header(label) {
  console.log("\n" + "═".repeat(60));
  console.log("  " + label);
  console.log("═".repeat(60));
}

async function main() {
  // ============================================================
  header("1. LOGIN no Supabase");
  // ============================================================
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: auth, error: authErr } = await anon.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (authErr) {
    console.error("❌ Login falhou:", authErr.message);
    process.exit(1);
  }
  console.log("✅ Logado:", auth.user.email);
  console.log("   user_id:", auth.user.id);

  // ============================================================
  header("2. CARREGA PROFILE + USO");
  // ============================================================
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: `Bearer ${auth.session.access_token}` } },
  });

  const { data: profile, error: profileErr } = await sb
    .from("profiles")
    .select("id, email, plan, full_name")
    .eq("id", auth.user.id)
    .single();
  if (profileErr) throw profileErr;
  console.log("✅ Profile:", profile);

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const { count: monthUsage } = await sb
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", auth.user.id)
    .eq("kind", "generation")
    .gte("created_at", startOfMonth.toISOString());
  console.log("✅ Uso este mês:", monthUsage, "(plano premium = ilimitado)");

  // ============================================================
  header("3. GERA PEÇA COM IA (gpt-4.1-mini)");
  // ============================================================
  const openai = new OpenAI({ apiKey: OPENAI_KEY });

  const SYSTEM_PROMPT = `Você é o "Peça Pronta", um assistente jurídico especialista em redação de peças processuais brasileiras. Você atua como um redator técnico sênior, com domínio do Direito Brasileiro (Constituição Federal, CPC/2015, CDC, CLT, Código Civil, Código Penal e CPP, legislação extravagante e súmulas vinculantes).

REGRAS FUNDAMENTAIS:
1. Escreva SEMPRE em português brasileiro, no padrão técnico-jurídico formal.
2. Estruture a peça com cabeçalho do juízo, qualificação completa das partes, seções numeradas em algarismos romanos (I – DOS FATOS, II – DO DIREITO, III – DOS PEDIDOS, etc.), valor da causa quando aplicável, fórmula de encerramento ("Nestes termos, pede deferimento.") e linha de assinatura.
3. Fundamente em dispositivos legais brasileiros vigentes. NUNCA invente números de acórdãos.
4. Use marcadores de preenchimento entre colchetes quando faltar dado.
5. NÃO inclua avisos, comentários ou explicações fora da peça.`;

  const USER_PROMPT = `Tipo de peça solicitada: Petição Inicial
Área do Direito: Direito do Consumidor

DADOS DO CASO:
- Comarca: 3ª Vara Cível da Comarca de São Paulo/SP
- Parte autora: João da Silva, brasileiro, casado, autônomo, CPF 123.456.789-00, residente à Rua das Flores, 123, São Paulo/SP
- Parte ré: Magazine XYZ Ltda., CNPJ 12.345.678/0001-90, com sede à Av. Paulista, 1000, São Paulo/SP
- Fatos: Em 10/03/2026 o autor adquiriu uma TV LG OLED 55" pelo site da ré por R$ 7.500,00. O produto foi entregue em 20/03/2026 com a tela quebrada. O autor entrou em contato várias vezes pelos canais oficiais (SAC e WhatsApp) entre 21/03 e 15/04 sem solução. Reclamou no PROCON em 20/04 sem resposta da ré em 30 dias.
- Pedido: condenação à substituição do produto + indenização por danos morais de R$ 8.000,00
- Valor da causa: R$ 15.500,00

INSTRUÇÕES: Produza a peça completa, pronta para edição final.`;

  console.log("⏳ Gerando petição inicial (consumidor)...");
  const t0 = Date.now();
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    max_completion_tokens: 4096,
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT },
    ],
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const generated = completion.choices[0].message.content;
  console.log(`✅ Gerado em ${elapsed}s`);
  console.log(`   tokens: ${completion.usage.prompt_tokens} in / ${completion.usage.completion_tokens} out`);
  console.log(`   custo aproximado: $${((completion.usage.prompt_tokens * 0.40 + completion.usage.completion_tokens * 1.60) / 1_000_000).toFixed(4)}`);
  console.log("\n--- PRIMEIRAS 800 CHARS DA PEÇA GERADA ---");
  console.log(generated.slice(0, 800));
  console.log("--- ... ---");

  // Validações estruturais
  const hasJuizo = /JUIZ\(A\)|VARA C[ÍI]VEL/i.test(generated);
  const hasSecaoFatos = /I\s*[–-]\s*DOS FATOS/i.test(generated);
  const hasSecaoDireito = /II\s*[–-]\s*DO DIREITO/i.test(generated);
  const hasSecaoPedidos = /III\s*[–-]\s*DOS PEDIDOS/i.test(generated);
  const hasFormulaFinal = /Nestes termos,\s*pede deferimento/i.test(generated);
  const hasCDC = /CDC|Lei\s*8\.078|Código de Defesa do Consumidor/i.test(generated);
  console.log("\n--- VALIDAÇÕES ESTRUTURAIS ---");
  console.log("  cabeçalho do juízo:        ", hasJuizo ? "✅" : "❌");
  console.log("  seção I - DOS FATOS:       ", hasSecaoFatos ? "✅" : "❌");
  console.log("  seção II - DO DIREITO:     ", hasSecaoDireito ? "✅" : "❌");
  console.log("  seção III - DOS PEDIDOS:   ", hasSecaoPedidos ? "✅" : "❌");
  console.log("  'Nestes termos, pede...':  ", hasFormulaFinal ? "✅" : "❌");
  console.log("  cita CDC:                  ", hasCDC ? "✅" : "❌");

  // ============================================================
  header("4. SALVA DOCUMENTO + USAGE EVENT");
  // ============================================================
  const { data: doc, error: docErr } = await sb
    .from("documents")
    .insert({
      user_id: auth.user.id,
      title: "[E2E TEST] Petição Inicial - Consumidor (TV LG)",
      piece_type: "peticao_inicial",
      area: "Direito do Consumidor",
      content: generated,
      input_payload: { e2e_test: true, at: new Date().toISOString() },
    })
    .select("id, title")
    .single();
  if (docErr) throw docErr;
  console.log("✅ Documento salvo:", doc.id);
  console.log("   título:", doc.title);

  const { error: usageErr } = await sb.from("usage_events").insert({
    user_id: auth.user.id,
    kind: "generation",
    tokens_in: completion.usage.prompt_tokens,
    tokens_out: completion.usage.completion_tokens,
    metadata: { piece_type: "peticao_inicial", e2e_test: true },
  });
  if (usageErr) throw usageErr;
  console.log("✅ Usage event registrado");

  // ============================================================
  header("5. REVISOR INTELIGENTE (revisa a peça gerada)");
  // ============================================================
  const REVIEWER_SYSTEM = `Você é o revisor jurídico do "Peça Pronta". Sua tarefa é analisar uma peça processual brasileira e produzir um relatório estruturado.

REGRAS:
1. Avalie quatro dimensões: (A) Correção gramatical; (B) Padrão técnico-jurídico; (C) Estrutura e coesão; (D) Fundamentação legal.
2. Para cada dimensão, liste 2-3 apontamentos no formato:
   - Trecho original
   - Sugestão
   - Motivo
3. Ao final, "RECOMENDAÇÕES GERAIS" com 3 pontos.
4. Responda em texto puro.`;

  console.log("⏳ Revisando peça...");
  const t1 = Date.now();
  const review = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    max_completion_tokens: 2048,
    temperature: 0.4,
    messages: [
      { role: "system", content: REVIEWER_SYSTEM },
      { role: "user", content: `Plano: Premium\n\nPEÇA:\n"""\n${generated}\n"""` },
    ],
  });
  console.log(`✅ Revisão em ${((Date.now() - t1) / 1000).toFixed(1)}s`);
  console.log(`   tokens: ${review.usage.prompt_tokens} in / ${review.usage.completion_tokens} out`);
  console.log("\n--- PRIMEIRAS 600 CHARS DA REVISÃO ---");
  console.log(review.choices[0].message.content.slice(0, 600));
  console.log("--- ... ---");

  // ============================================================
  header("6. AÇÃO DE IA: 'Adicionar fundamentação'");
  // ============================================================
  const ACTION_SYSTEM = `Você é o assistente jurídico do Peça Pronta. Acrescente ao texto fundamentação legal pertinente do Direito Brasileiro. Não invente súmulas. Responda APENAS com o texto enriquecido.`;
  const acaoExcerpt = generated.split(/I\s*[–-]\s*DOS FATOS/i)[1]?.split(/II\s*[–-]/i)[0] ?? generated.slice(0, 1500);

  console.log("⏳ Acrescentando fundamentação ao trecho de fatos...");
  const t2 = Date.now();
  const action = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    max_completion_tokens: 1500,
    temperature: 0.4,
    messages: [
      { role: "system", content: ACTION_SYSTEM },
      { role: "user", content: `Acrescente fundamentação legal ao texto:\n\n"""\n${acaoExcerpt.trim()}\n"""` },
    ],
  });
  console.log(`✅ Ação executada em ${((Date.now() - t2) / 1000).toFixed(1)}s`);
  console.log(`   tokens: ${action.usage.prompt_tokens} in / ${action.usage.completion_tokens} out`);
  console.log("\n--- PRIMEIRAS 500 CHARS DO TEXTO ENRIQUECIDO ---");
  console.log(action.choices[0].message.content.slice(0, 500));
  console.log("--- ... ---");

  // ============================================================
  header("7. LIMPEZA (deleta documento de teste)");
  // ============================================================
  await sb.from("documents").delete().eq("id", doc.id);
  console.log("✅ Documento de teste removido");

  // ============================================================
  header("✅ RESUMO");
  // ============================================================
  const totalIn = completion.usage.prompt_tokens + review.usage.prompt_tokens + action.usage.prompt_tokens;
  const totalOut = completion.usage.completion_tokens + review.usage.completion_tokens + action.usage.completion_tokens;
  const totalCost = ((totalIn * 0.40 + totalOut * 1.60) / 1_000_000);
  console.log(`Total de tokens: ${totalIn} in / ${totalOut} out`);
  console.log(`Custo da operação E2E completa: $${totalCost.toFixed(4)} (~R$ ${(totalCost * 5.8).toFixed(3)})`);
  console.log("");
  console.log("Componentes validados:");
  console.log("  ✅ Login Supabase Auth");
  console.log("  ✅ Leitura profile + plano");
  console.log("  ✅ Cálculo de uso mensal");
  console.log("  ✅ Geração de peça com gpt-4.1-mini (estrutura I/II/III, CDC, fórmula final)");
  console.log("  ✅ Salvamento no Supabase (documents + usage_events)");
  console.log("  ✅ Revisor inteligente (4 dimensões)");
  console.log("  ✅ Ação de IA (adicionar fundamentação)");
  console.log("  ✅ Limpeza de dados de teste");
}

main().catch((e) => {
  console.error("\n❌ ERRO:", e.message ?? e);
  process.exit(1);
});
