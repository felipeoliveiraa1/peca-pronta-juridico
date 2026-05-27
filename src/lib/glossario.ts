export interface GlossaryTerm {
  term: string;
  area: string;
  definition: string;
  example?: string;
  differentFrom?: string;
  relatedTerms?: string[];
  relatedArt?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Ação",
    area: "Processual Civil",
    definition:
      "Direito público subjetivo de invocar a prestação jurisdicional do Estado para resolver uma pretensão. Toda ação tem três elementos: partes, causa de pedir (fatos + fundamentos) e pedido.",
    example:
      "João propõe ação de cobrança contra Pedro pleiteando o pagamento de uma dívida — partes (João/Pedro), causa de pedir (contrato inadimplido) e pedido (condenação ao valor).",
    differentFrom:
      "Pretensão (direito material que se exerce pela ação) e processo (instrumento pelo qual a ação se exercita).",
    relatedTerms: ["Pretensão", "Petição inicial", "Pedido"],
    relatedArt: "arts. 17 e 319 CPC",
  },
  {
    term: "Acórdão",
    area: "Processual Civil",
    definition:
      "Decisão proferida por órgão colegiado de tribunal (câmara, turma, seção, plenário). Diferentemente da sentença (singular), o acórdão resulta de julgamento por vários magistrados.",
    example:
      "Após interposta apelação, a 5ª Câmara Cível do TJSP julga o recurso e profere acórdão por maioria.",
    differentFrom: "Sentença (decisão monocrática de juiz singular).",
    relatedTerms: ["Sentença", "Apelação"],
    relatedArt: "art. 204 CPC",
  },
  {
    term: "Ad cautelam",
    area: "Processual Civil",
    definition:
      'Expressão latina que significa "por cautela". Usada quando se pratica ato processual em caráter precavido, sem reconhecimento de obrigação, apenas para evitar prejuízo.',
    example:
      'A parte deposita o valor "ad cautelam" para evitar protesto, sem reconhecer a dívida.',
  },
  {
    term: "Agravo de Instrumento",
    area: "Recursos",
    definition:
      "Recurso cabível contra decisões interlocutórias que versem sobre as hipóteses do art. 1.015 do CPC (tutelas, mérito parcial, rejeição de gratuidade, exclusão de litisconsorte, etc.). Tem efeito devolutivo e, excepcionalmente, suspensivo.",
    example:
      "Juiz indefere tutela de urgência; o autor interpõe agravo de instrumento no prazo de 15 dias úteis.",
    differentFrom:
      "Agravo interno (contra decisão monocrática do relator) e agravo em recurso especial/extraordinário (destrancamento do recurso).",
    relatedTerms: ["Decisão interlocutória", "Tutela de urgência", "Agravo interno"],
    relatedArt: "art. 1.015 CPC",
  },
  {
    term: "Agravo Interno",
    area: "Recursos",
    definition:
      "Recurso interno cabível contra decisão monocrática de relator em tribunal (ex.: nega seguimento, julga monocraticamente). Devolve a matéria ao órgão colegiado. Prazo: 15 dias úteis.",
    relatedArt: "art. 1.021 CPC",
  },
  {
    term: "Alegações Finais",
    area: "Processo Penal",
    definition:
      "Manifestação oral ou escrita das partes após o encerramento da instrução criminal, em que fixam suas teses para a sentença. No procedimento comum, são orais em audiência (20 min para cada parte); excepcionalmente, em memoriais escritos.",
    example:
      "Após oitiva de testemunhas e interrogatório, defesa e acusação apresentam alegações finais por memoriais no prazo de 5 dias.",
    relatedTerms: ["Memoriais", "Tribunal do Júri"],
    relatedArt: "art. 403 CPP",
  },
  {
    term: "Alimentos",
    area: "Família",
    definition:
      "Valores devidos por quem tem possibilidade a quem tem necessidade, em razão de parentesco, casamento ou união estável. Compreendem o necessário para sustento, vestuário, habitação, saúde e educação. Podem ser provisórios, definitivos, gravídicos ou compensatórios.",
    example:
      "Filho menor pleiteia 30% dos rendimentos do pai a título de alimentos, com fundamento na necessidade do alimentando e possibilidade do alimentante.",
    differentFrom:
      "Pensão alimentícia (gênero, abrange alimentos para qualquer beneficiário); alimentos transitórios (devidos por tempo limitado, p. ex. ex-cônjuge).",
    relatedTerms: ["Pensão alimentícia", "Poder familiar", "Binômio necessidade-possibilidade"],
    relatedArt: "art. 1.694 CC + Lei 5.478/68",
  },
  {
    term: "Apelação",
    area: "Recursos",
    definition:
      "Recurso cabível contra sentença, devolvendo a matéria ao tribunal de 2º grau. Tem efeito devolutivo e, em regra, suspensivo. Prazo: 15 dias úteis. Cabe contrarrazões pela parte contrária.",
    example:
      "Sentença julga improcedente a ação; o autor interpõe apelação ao TJSP postulando a reforma do julgado.",
    differentFrom:
      "Agravo de instrumento (contra decisão interlocutória) e recurso especial/extraordinário (contra acórdãos).",
    relatedTerms: ["Sentença", "Agravo de Instrumento", "Recurso Especial"],
    relatedArt: "arts. 1.009 a 1.014 CPC",
  },
  {
    term: "Arbitragem",
    area: "Processual Civil",
    definition:
      "Método extrajudicial de resolução de conflitos, em que as partes escolhem árbitros para decidir. Aplica-se a direitos patrimoniais disponíveis. A sentença arbitral tem a mesma eficácia da sentença judicial.",
    relatedTerms: ["Mediação", "Conciliação"],
    relatedArt: "Lei 9.307/96",
  },
  {
    term: "Assistência Judiciária Gratuita",
    area: "Processual Civil",
    definition:
      "Benefício concedido a quem comprova insuficiência de recursos para arcar com custas, despesas processuais e honorários. Abrange isenção de custas, peritos e oficiais de justiça. A presunção é relativa: o juiz pode exigir comprovação documental.",
    example:
      'O autor declara hipossuficiência e junta CTPS sem registros; o juiz defere a gratuidade.',
    differentFrom:
      "Defensoria Pública (representação processual gratuita); justiça gratuita (isenção de custas — gênero).",
    relatedTerms: ["Hipossuficiência", "Custas processuais"],
    relatedArt: "art. 98 CPC + Lei 1.060/50",
  },
  {
    term: "Astreintes",
    area: "Processual Civil",
    definition:
      "Multa coercitiva, em geral diária, imposta para compelir o cumprimento de obrigação de fazer, não fazer ou entregar coisa. Não tem caráter indenizatório; visa à pressão psicológica sobre o devedor.",
    example:
      'Juiz fixa multa de R$ 500/dia para que a operadora autorize cirurgia ao usuário do plano.',
    differentFrom:
      "Multa por descumprimento contratual (indenizatória); multa do art. 523 §1º (incide sobre o valor da execução em cumprimento de sentença).",
    relatedTerms: ["Obrigação de fazer", "Tutela de urgência"],
    relatedArt: "art. 537 CPC",
  },
  {
    term: "Ato administrativo",
    area: "Administrativo",
    definition:
      "Manifestação unilateral da Administração Pública que produz efeitos jurídicos. Tem atributos como presunção de legitimidade, imperatividade, autoexecutoriedade e tipicidade. Pode ser anulado (vício de legalidade) ou revogado (mérito).",
    example:
      "Auto de infração lavrado por fiscal; portaria que designa servidor; ato de remoção.",
    differentFrom:
      "Ato administrativo discricionário (juízo de conveniência e oportunidade) x ato vinculado (sem margem de escolha).",
    relatedTerms: ["Discricionariedade", "Princípio da legalidade"],
  },
  {
    term: "Audiência de instrução e julgamento",
    area: "Processual Civil",
    definition:
      "Audiência em que se colhem as provas orais (depoimentos pessoais e testemunhal), o juiz tenta novamente a conciliação e, ao final, profere ou anuncia a sentença.",
    relatedArt: "art. 358 CPC",
  },
  {
    term: "Audiência de conciliação ou mediação",
    area: "Processual Civil",
    definition:
      "Audiência designada após o recebimento da inicial, tendo por objetivo a solução consensual do litígio. Conduzida por conciliador (atua mais ativamente) ou mediador (facilita o diálogo). O não comparecimento injustificado é ato atentatório à dignidade da justiça.",
    relatedArt: "art. 334 CPC",
  },
  {
    term: "Aviso prévio",
    area: "Trabalho",
    definition:
      "Comunicação prévia da rescisão do contrato de trabalho sem justa causa, com duração mínima de 30 dias + 3 dias por ano trabalhado, até 90 dias. Pode ser trabalhado ou indenizado. Integra o tempo de serviço para todos os efeitos.",
    example:
      "Empregado com 5 anos de empresa demitido sem justa causa: 30 + 15 dias = 45 dias de aviso prévio.",
    relatedArt: "art. 487 CLT + Lei 12.506/11",
  },
  {
    term: "Bem de família",
    area: "Civil",
    definition:
      "Imóvel residencial impenhorável (bem de família legal — Lei 8.009/90) ou constituído voluntariamente (bem de família convencional — arts. 1.711-1.722 CC). Protege a entidade familiar contra constrição em razão de dívidas, salvo exceções legais.",
    example:
      "Casa onde reside o casal é impenhorável em execução de dívida civil comum, ainda que não registrada como bem de família.",
    differentFrom:
      "Bem de família legal (proteção automática por lei) x bem de família convencional (constituído por escritura e registro).",
    relatedTerms: ["Impenhorabilidade"],
    relatedArt: "Lei 8.009/90",
  },
  {
    term: "Binômio necessidade-possibilidade",
    area: "Família",
    definition:
      "Critério para fixação do valor dos alimentos. Considera, de um lado, a necessidade do alimentando (quanto precisa para sobreviver com dignidade) e, de outro, a possibilidade do alimentante (quanto pode pagar sem comprometer o próprio sustento).",
    relatedTerms: ["Alimentos"],
    relatedArt: "art. 1.694 §1º CC",
  },
  {
    term: "Boa-fé objetiva",
    area: "Civil",
    definition:
      "Padrão de conduta leal, honesta e proba esperada das partes em qualquer relação jurídica. Desdobra-se em deveres anexos (informação, lealdade, cooperação) e funciona como fonte de direitos e deveres não expressos no contrato.",
    example:
      "Banco que não esclarece taxa abusiva fere a boa-fé objetiva; contrato pode ser revisto.",
    differentFrom:
      "Boa-fé subjetiva (estado psicológico de quem ignora vício; ex.: posse de boa-fé).",
    relatedArt: "arts. 113, 187 e 422 CC",
  },
  {
    term: "Capacidade postulatória",
    area: "Processual Civil",
    definition:
      "Aptidão para atuar em juízo postulando em nome próprio ou de terceiros. Em regra, é exclusiva de advogados regularmente inscritos na OAB. Exceções: Juizados Especiais até 20 SM, habeas corpus, justiça do trabalho até 1ª instância.",
    differentFrom:
      "Capacidade de ser parte (qualquer pessoa); capacidade processual (de exercer atos sozinho ou por representante).",
    relatedTerms: ["Procuração ad judicia", "Defensoria Pública"],
    relatedArt: "art. 103 CPC",
  },
  {
    term: "Carga horária",
    area: "Trabalho",
    definition:
      "Duração da jornada de trabalho. Limite constitucional: 8 horas diárias e 44 semanais. Pode ser reduzida por convenção, acordo coletivo ou contrato. Excedentes são horas extras com adicional de 50% (mínimo).",
    relatedArt: "art. 7º, XIII, CF + art. 58 CLT",
  },
  {
    term: "Causa de pedir",
    area: "Processual Civil",
    definition:
      "Conjunto dos fatos (causa próxima) e fundamentos jurídicos (causa remota) que justificam o pedido. É a razão pela qual o autor pleiteia a tutela jurisdicional. Sem causa de pedir, a inicial é inepta.",
    example:
      'Em ação de cobrança: fatos = "réu emitiu cheque sem fundos em 10/01/2024"; fundamento jurídico = "art. 389 CC, mora do devedor".',
    differentFrom:
      "Pedido (providência que se quer) e parte (quem propõe / em face de quem).",
    relatedTerms: ["Petição inicial", "Inépcia da inicial", "Pedido"],
    relatedArt: "art. 319, III, CPC",
  },
  {
    term: "Citação",
    area: "Processual Civil",
    definition:
      "Ato pelo qual se chama o réu ao processo para que se defenda. Pode ser por correio (regra), oficial de justiça, edital, hora certa ou eletrônica. Tem importantes efeitos: induz litispendência, torna litigiosa a coisa, constitui o devedor em mora.",
    differentFrom:
      "Intimação (cientifica das partes sobre atos processuais subsequentes); notificação extrajudicial (extraprocessual).",
    relatedTerms: ["Intimação", "Revelia"],
    relatedArt: "art. 238 CPC",
  },
  {
    term: "Coisa julgada",
    area: "Processual Civil",
    definition:
      "Imutabilidade da decisão de mérito após esgotados os recursos cabíveis. Pode ser formal (preclusão dentro do processo) ou material (extensão para fora, impedindo nova discussão entre as mesmas partes sobre a mesma causa).",
    example:
      "Sentença que reconhece a dívida transitou em julgado: o réu não pode ajuizar nova ação para discutir a mesma dívida.",
    differentFrom: "Trânsito em julgado (momento) x coisa julgada (efeito).",
    relatedTerms: ["Trânsito em julgado", "Litispendência"],
    relatedArt: "art. 502 CPC",
  },
  {
    term: "Compensação",
    area: "Civil",
    definition:
      "Modo de extinção de obrigações em que duas pessoas, sendo reciprocamente credora e devedora, têm suas dívidas extintas até a quantia em que se equivalem. Exige dívidas líquidas, vencidas e de coisas fungíveis.",
    example:
      "Se A deve R$ 1.000 a B, e B deve R$ 700 a A, ambas as dívidas se compensam até R$ 700; resta A devendo R$ 300.",
    relatedArt: "art. 368 CC",
  },
  {
    term: "Competência",
    area: "Processual Civil",
    definition:
      "Limitação do exercício da jurisdição. Pode ser absoluta (em razão da matéria, função ou pessoa — inderrogável) ou relativa (territorial, em regra — pode ser modificada por foro de eleição ou inércia das partes).",
    example:
      "Causa cível até 40 SM: Juizado Especial (competência absoluta material); ação imobiliária: foro da situação do imóvel (relativa).",
    differentFrom:
      "Jurisdição (poder de julgar — uno) x competência (medida do poder atribuído a cada juiz).",
    relatedTerms: ["Foro", "Juizado Especial"],
    relatedArt: "art. 42 CPC",
  },
  {
    term: "Concurso de credores",
    area: "Empresarial",
    definition:
      "Procedimento de habilitação e ordenação de créditos em falência ou recuperação judicial. Os créditos são pagos segundo a ordem legal (trabalhistas até 150 SM, garantia real, tributários, quirografários etc.).",
    relatedArt: "Lei 11.101/05",
  },
  {
    term: "Confissão",
    area: "Processual Civil",
    definition:
      "Reconhecimento expresso ou tácito de fato contrário ao interesse do confidente e favorável à parte adversa. Pode ser judicial (em depoimento, contestação ou petição) ou extrajudicial. Tem força de prova plena.",
    differentFrom:
      "Reconhecimento jurídico do pedido (admissão integral do mérito, gera sentença de procedência) x confissão (apenas dos fatos).",
    relatedArt: "art. 389 CPP / art. 389 CPC",
  },
  {
    term: "Contestação",
    area: "Processual Civil",
    definition:
      "Resposta do réu à pretensão do autor, em peça única, com preliminares (vícios processuais — incompetência, ilegitimidade, etc.) e impugnação ao mérito. Prazo: 15 dias úteis a contar da audiência de conciliação infrutífera ou da juntada da resposta da última parte (em casos especiais).",
    example:
      "Réu apresenta contestação alegando, em preliminar, prescrição, e, no mérito, que pagou a dívida.",
    differentFrom: "Reconvenção (pretensão autônoma do réu contra o autor).",
    relatedTerms: ["Reconvenção", "Réplica", "Revelia"],
    relatedArt: "arts. 335 e 336 CPC",
  },
  {
    term: "Contraditório",
    area: "Constitucional",
    definition:
      "Garantia constitucional de bilateralidade do processo. Toda parte tem direito de ser informada e de se manifestar antes da decisão. Compreende também o direito de influenciar a decisão do juiz.",
    relatedTerms: ["Ampla defesa", "Devido processo legal"],
    relatedArt: "art. 5º, LV, CF",
  },
  {
    term: "Crime continuado",
    area: "Penal",
    definition:
      "Pluralidade de crimes da mesma espécie, em condições de tempo, lugar e modo semelhantes, em que os subsequentes são considerados continuação do primeiro. Aplica-se a pena de um deles, aumentada de 1/6 a 2/3.",
    example:
      "Caixa de banco que desvia R$ 1.000 por mês durante 1 ano: 12 furtos em continuidade delitiva.",
    differentFrom:
      "Concurso material (crimes autônomos sem nexo) e concurso formal (uma só conduta, vários crimes).",
    relatedArt: "art. 71 CP",
  },
  {
    term: "Culpa",
    area: "Penal",
    definition:
      "Modalidade de elemento subjetivo do crime em que o agente não quer o resultado, mas o produz por imprudência, negligência ou imperícia. Crimes culposos só existem se a lei expressamente prever.",
    differentFrom:
      "Dolo (vontade consciente de produzir o resultado ou assumir o risco).",
    relatedArt: "art. 18, II, CP",
  },
  {
    term: "Cumprimento de sentença",
    area: "Processual Civil",
    definition:
      "Fase executiva para satisfazer título executivo judicial (sentença, acórdão, etc.). Inicia-se a requerimento, intimando-se o devedor a pagar em 15 dias, sob pena de multa de 10% e honorários de 10%, mais a possibilidade de penhora.",
    differentFrom:
      "Execução de título extrajudicial (cheque, nota promissória, contrato — processo autônomo).",
    relatedTerms: ["Título executivo", "Penhora"],
    relatedArt: "arts. 523 a 527 CPC",
  },
  {
    term: "Custas processuais",
    area: "Processual Civil",
    definition:
      "Despesas para movimentar o processo: taxa judiciária, despesas de oficial de justiça, perito, citação, etc. São de responsabilidade do vencido, salvo gratuidade. Recolhidas em geral pela parte que dá causa ou no preparo recursal.",
    relatedTerms: ["Assistência Judiciária Gratuita", "Preparo"],
    relatedArt: "art. 82 CPC",
  },
  {
    term: "Dano emergente",
    area: "Civil",
    definition:
      "Aquilo que efetivamente se perdeu — diminuição patrimonial concreta resultante do ato ilícito. Integra, junto com lucros cessantes, a indenização por perdas e danos.",
    example:
      "Carro batido: custo do conserto = dano emergente. Faturamento perdido enquanto sem o veículo = lucros cessantes.",
    differentFrom: "Lucros cessantes (o que razoavelmente deixou de ganhar).",
    relatedTerms: ["Lucros cessantes", "Dano moral"],
    relatedArt: "art. 402 CC",
  },
  {
    term: "Dano moral",
    area: "Civil",
    definition:
      "Lesão à esfera extrapatrimonial — dignidade, honra, imagem, intimidade. Indenização em pecúnia, fixada pelo juiz com base em razoabilidade, gravidade do ato e capacidade do ofensor. Não exige prova do prejuízo psicológico em si (in re ipsa, em muitos casos).",
    example:
      "Inscrição indevida no SPC, mesmo após o consumidor pagar, gera dano moral in re ipsa (Súmula 385 STJ a contrario sensu).",
    differentFrom:
      "Dano material (atinge o patrimônio); dano estético (modalidade autônoma, em alguns precedentes).",
    relatedTerms: ["Dano material", "Indenização"],
    relatedArt: "art. 5º, V e X, CF + art. 186 CC",
  },
  {
    term: "Decadência",
    area: "Civil",
    definition:
      "Perda do próprio direito potestativo pelo decurso do tempo. Não se suspende nem se interrompe (em regra). Os prazos decadenciais são fixados em lei e podem ser conhecidos de ofício.",
    example:
      "Anulação de casamento por erro essencial: 3 anos (CC, art. 1.560, III) — prazo decadencial.",
    differentFrom:
      "Prescrição (perda da pretensão — direito subjetivo a uma prestação).",
    relatedTerms: ["Prescrição"],
    relatedArt: "art. 207 CC",
  },
  {
    term: "Decisão interlocutória",
    area: "Processual Civil",
    definition:
      "Decisão judicial que resolve questão incidente durante o processo, sem pôr fim à fase de conhecimento. Em regra, é impugnável por agravo de instrumento (nas hipóteses do art. 1.015) ou em preliminar de apelação.",
    example:
      "Decisão que defere ou indefere tutela de urgência; rejeita preliminar de incompetência; concede a inversão do ônus da prova.",
    differentFrom:
      "Sentença (resolve o mérito ou põe fim à fase); despacho (mero impulso processual, sem decisão).",
    relatedArt: "art. 203 §2º CPC",
  },
  {
    term: "Defesa Pública",
    area: "Constitucional",
    definition:
      "Instituição permanente, essencial à função jurisdicional, com a missão de prestar orientação jurídica integral e gratuita aos necessitados (CF, art. 134). Atua na assistência judicial e extrajudicial.",
    relatedArt: "art. 134 CF + LC 80/94",
  },
  {
    term: "Defensoria Dativa",
    area: "Penal",
    definition:
      "Advogado nomeado pelo juiz para defender o réu em processo penal quando este não tem advogado e não há Defensoria Pública na localidade. Tem direito a honorários pagos pelo Estado.",
  },
  {
    term: "Denúncia",
    area: "Processo Penal",
    definition:
      "Peça acusatória do Ministério Público que dá início à ação penal pública. Deve conter exposição do fato, com circunstâncias, qualificação do acusado, classificação do crime e rol de testemunhas (até 8). Recebida, gera a condição de réu.",
    differentFrom:
      "Queixa-crime (peça acusatória do particular, em crimes de ação privada).",
    relatedArt: "art. 41 CPP",
  },
  {
    term: "Despejo",
    area: "Imobiliário",
    definition:
      "Ação cabível para retomada de imóvel locado urbano. Pode fundar-se em falta de pagamento, denúncia vazia (locação por prazo indeterminado), denúncia cheia (com motivo — uso próprio, reforma, etc.) ou infração contratual.",
    example:
      "Inquilino deixa de pagar aluguel por 3 meses; locador ajuíza despejo por falta de pagamento cumulado com cobrança.",
    relatedTerms: ["Locação", "Caução"],
    relatedArt: "Lei 8.245/91",
  },
  {
    term: "Devido processo legal",
    area: "Constitucional",
    definition:
      "Princípio fundamental segundo o qual ninguém será privado de liberdade ou bens sem o processo previsto em lei, com contraditório, ampla defesa, juiz natural, etc. É a matriz das garantias processuais.",
    relatedTerms: ["Contraditório", "Ampla defesa", "Juiz natural"],
    relatedArt: "art. 5º, LIV, CF",
  },
  {
    term: "Discricionariedade",
    area: "Administrativo",
    definition:
      "Margem de escolha conferida pela lei ao administrador para optar pela solução mais conveniente e oportuna ao interesse público. Não é arbitrariedade: subordina-se aos princípios (legalidade, finalidade, razoabilidade).",
    differentFrom:
      "Ato vinculado (lei estabelece taxativamente os requisitos e a conduta a ser adotada).",
    relatedTerms: ["Ato administrativo"],
  },
  {
    term: "Dolo",
    area: "Penal",
    definition:
      "Elemento subjetivo do crime: vontade consciente de praticar a conduta e produzir o resultado (dolo direto) ou de assumir o risco de produzi-lo (dolo eventual). Regra geral dos crimes; crimes culposos exigem previsão expressa.",
    example:
      "Atirar em alguém querendo matar = dolo direto. Dirigir em alta velocidade em via movimentada, sabendo que pode atropelar, e atropelando = dolo eventual.",
    differentFrom: "Culpa (não quer o resultado; produz por imprudência, negligência ou imperícia).",
    relatedTerms: ["Culpa"],
    relatedArt: "art. 18, I, CP",
  },
  {
    term: "Embargos à execução",
    area: "Execução",
    definition:
      "Ação autônoma de impugnação à execução de título extrajudicial. Versa sobre nulidade do título, prescrição, pagamento, excesso de execução, etc. Em regra, sem efeito suspensivo automático.",
    differentFrom:
      "Impugnação ao cumprimento de sentença (incidente nos próprios autos, contra título judicial).",
    relatedArt: "art. 914 CPC",
  },
  {
    term: "Embargos de declaração",
    area: "Recursos",
    definition:
      "Recurso de fundamentação vinculada, cabível contra qualquer decisão judicial, para sanar omissão, contradição, obscuridade ou corrigir erro material. Prazo: 5 dias. Interrompem (não apenas suspendem) o prazo para outros recursos.",
    example:
      "Sentença deixa de analisar pedido de honorários; parte opõe embargos para suprir a omissão.",
    relatedTerms: ["Apelação", "Agravo"],
    relatedArt: "arts. 1.022 a 1.026 CPC",
  },
  {
    term: "Empregado",
    area: "Trabalho",
    definition:
      "Pessoa física que presta serviços de natureza não eventual a empregador, sob a dependência deste e mediante salário. Os 4 requisitos: pessoalidade, não-eventualidade, subordinação e onerosidade.",
    differentFrom:
      "Trabalhador autônomo (sem subordinação) e prestador de serviços (relação cível).",
    relatedArt: "art. 3º CLT",
  },
  {
    term: "Estado de necessidade",
    area: "Penal",
    definition:
      "Excludente de ilicitude: prática de fato típico para salvar de perigo atual, que não provocou por sua vontade, direito próprio ou alheio cujo sacrifício, nas circunstâncias, não era razoável exigir-se.",
    example:
      "Naufrágio: um sobrevivente toma a tábua que sustentava outro para se salvar — estado de necessidade.",
    differentFrom: "Legítima defesa (repulsa a injusta agressão atual ou iminente).",
    relatedArt: "art. 24 CP",
  },
  {
    term: "Execução fiscal",
    area: "Tributário",
    definition:
      "Procedimento especial para cobrança da Dívida Ativa da Fazenda Pública (União, Estados, Municípios, autarquias). Citação para pagar em 5 dias ou nomear bens à penhora; embargos só após garantida a execução.",
    relatedArt: "Lei 6.830/80",
  },
  {
    term: "Execução de título extrajudicial",
    area: "Execução",
    definition:
      "Processo autônomo para satisfação de crédito documentado em título dotado de força executiva (cheque, nota promissória, contrato assinado por 2 testemunhas, etc.). Citação para pagar em 3 dias, com honorários de 10% (reduzidos a 5% se pago no prazo).",
    relatedTerms: ["Título executivo extrajudicial", "Cumprimento de sentença"],
    relatedArt: "arts. 824 e seguintes CPC",
  },
  {
    term: "Exegese",
    area: "Constitucional",
    definition:
      "Interpretação do texto legal. Pode ser literal (gramatical), histórica, sistemática, teleológica (finalidade), etc. Indispensável à aplicação do direito.",
  },
  {
    term: "Ex tunc / Ex nunc",
    area: "Civil",
    definition:
      'Expressões latinas que indicam o alcance temporal dos efeitos de uma decisão. "Ex tunc" = desde então (retroativos); "ex nunc" = a partir de agora (prospectivos).',
    example:
      "Anulação de casamento: efeitos ex tunc (apaga retroativamente). Divórcio: ex nunc (a partir do trânsito em julgado).",
  },
  {
    term: "Fato gerador",
    area: "Tributário",
    definition:
      "Situação prevista em lei que, ocorrida, gera a obrigação tributária. Sem fato gerador, não há tributo devido. Pode ser instantâneo (ICMS na venda), continuado (IPTU/IPVA), complexivo (IR anual).",
    relatedArt: "art. 114 CTN",
  },
  {
    term: "Foro de eleição",
    area: "Civil",
    definition:
      "Cláusula contratual que define o foro competente para dirimir conflitos. Em regra, é válida em contratos paritários. Em contratos de adesão e consumeristas, pode ser declarada nula de ofício se abusiva.",
    differentFrom:
      "Foro privilegiado (decorrente da lei — ex.: domicílio do consumidor, da mulher em ação de família).",
    relatedArt: "art. 63 CPC",
  },
  {
    term: "Fumus boni iuris",
    area: "Processual Civil",
    definition:
      "Aparência de bom direito; probabilidade de que a parte tenha razão. Requisito (junto com o periculum in mora) para concessão de tutelas de urgência cautelar ou antecipada.",
    relatedTerms: ["Periculum in mora", "Tutela de urgência"],
    relatedArt: "art. 300 CPC",
  },
  {
    term: "Furto",
    area: "Penal",
    definition:
      "Subtrair, para si ou para outrem, coisa alheia móvel, sem o emprego de violência ou grave ameaça. Pena: 1 a 4 anos. Causas de aumento: noturno, abuso de confiança, escalada, etc.",
    differentFrom: "Roubo (com violência ou grave ameaça) e estelionato (mediante fraude).",
    relatedArt: "art. 155 CP",
  },
  {
    term: "Guarda compartilhada",
    area: "Família",
    definition:
      "Modelo padrão no Brasil em que ambos os pais exercem o poder familiar e participam ativamente das decisões sobre os filhos, ainda que a residência principal seja com um deles. O juiz pode determiná-la mesmo sem acordo (Lei 13.058/14).",
    differentFrom:
      "Guarda unilateral (apenas um exerce); guarda alternada (residência alterna periodicamente — pouco aplicada).",
    relatedTerms: ["Poder familiar", "Alimentos"],
    relatedArt: "art. 1.584 §2º CC",
  },
  {
    term: "Habeas Corpus",
    area: "Penal",
    definition:
      "Ação constitucional cabível sempre que alguém sofrer ou estiver na iminência de sofrer violência ou coação ilegal em sua liberdade de locomoção (CF, art. 5º, LXVIII). Não exige advogado; pode ser impetrado por qualquer pessoa, inclusive a favor de terceiros.",
    example: "Réu preso preventivamente além do prazo razoável impetra HC ao TJ para relaxamento.",
    differentFrom: "Habeas Data (acesso a dados pessoais) e Mandado de Segurança (direito líquido e certo, exceto liberdade).",
    relatedArt: "art. 5º, LXVIII, CF",
  },
  {
    term: "Habeas Data",
    area: "Constitucional",
    definition:
      "Ação constitucional para: (i) assegurar conhecimento de informações relativas à pessoa do impetrante constantes em bancos de dados públicos; (ii) retificá-las quando incorretas; (iii) anotar contestação.",
    relatedArt: "art. 5º, LXXII, CF",
  },
  {
    term: "Hipossuficiência",
    area: "Consumidor",
    definition:
      "Situação de inferioridade técnica, informacional ou econômica de uma parte em relação à outra. Justifica medidas protetivas como a inversão do ônus da prova e a gratuidade de justiça. É presumida nas relações de consumo.",
    differentFrom:
      "Vulnerabilidade (conceito mais amplo, presunção legal nas relações de consumo).",
    relatedTerms: ["Inversão do ônus da prova", "Assistência Judiciária Gratuita"],
    relatedArt: "art. 6º, VIII, CDC",
  },
  {
    term: "Honorários sucumbenciais",
    area: "Processual Civil",
    definition:
      "Verba devida ao advogado da parte vencedora pelo perdedor. Fixados entre 10% e 20% sobre o valor da condenação, do proveito econômico ou da causa. Em ações contra a Fazenda Pública, há escalonamento. Não se confundem com honorários contratuais.",
    relatedArt: "art. 85 CPC",
  },
  {
    term: "Hora extra",
    area: "Trabalho",
    definition:
      "Horas trabalhadas além da jornada normal (8 diárias / 44 semanais). Devem ser pagas com adicional mínimo de 50% (CF, art. 7º, XVI); domingos e feriados, 100%. Limite de 2 horas extras por dia, salvo banco de horas.",
    relatedArt: "art. 7º, XVI, CF + art. 59 CLT",
  },
  {
    term: "Impedimento",
    area: "Processual Civil",
    definition:
      "Causa objetiva de afastamento do juiz do processo (parentesco, ter atuado como advogado, interesse no julgamento, etc.). Acarreta nulidade absoluta se não declarado. Difere de suspeição (parcialidade subjetiva — relativa).",
    differentFrom: "Suspeição (parcialidade subjetiva — relativa).",
    relatedArt: "art. 144 CPC",
  },
  {
    term: "Impenhorabilidade",
    area: "Execução",
    definition:
      "Bens que, por lei, não podem ser objeto de penhora: bem de família, salários (até 50 salários mínimos), instrumentos de trabalho, livros, pensão, vestuário, móveis residenciais, etc. Pode ser absoluta ou relativa.",
    relatedTerms: ["Bem de família", "Penhora"],
    relatedArt: "art. 833 CPC",
  },
  {
    term: "Improbidade administrativa",
    area: "Administrativo",
    definition:
      "Conduta de agente público que viola a probidade no exercício da função: enriquecimento ilícito (art. 9º), prejuízo ao erário (art. 10) ou violação a princípios (art. 11). Sanções: perda da função, suspensão de direitos políticos, multa, ressarcimento.",
    relatedArt: "Lei 8.429/92 (com alterações da Lei 14.230/21)",
  },
  {
    term: "Indenização",
    area: "Civil",
    definition:
      "Reparação pecuniária do dano causado por ato ilícito. Compreende dano emergente, lucros cessantes, dano moral e, em alguns casos, dano estético. Tem caráter compensatório, não punitivo (regra geral no Brasil).",
    relatedTerms: ["Dano emergente", "Lucros cessantes", "Dano moral"],
    relatedArt: "arts. 944 e 186 CC",
  },
  {
    term: "Inépcia da inicial",
    area: "Processual Civil",
    definition:
      "Vício da petição inicial que impede o regular processamento: falta de pedido ou de causa de pedir; pedido indeterminado; pedidos incompatíveis entre si; conclusão que não decorre da narração dos fatos. Acarreta indeferimento ou emenda.",
    differentFrom:
      "Petição com vícios sanáveis (juiz determina emenda em 15 dias).",
    relatedArt: "art. 330 §1º CPC",
  },
  {
    term: "Intervenção de terceiros",
    area: "Processual Civil",
    definition:
      "Mecanismos pelos quais terceiro estranho à lide passa a integrá-la: assistência (simples ou litisconsorcial), denunciação à lide, chamamento ao processo, amicus curiae, incidente de desconsideração da pessoa jurídica.",
    relatedArt: "arts. 119 a 138 CPC",
  },
  {
    term: "Intimação",
    area: "Processual Civil",
    definition:
      "Ato pelo qual se dá ciência às partes ou interessados de atos processuais. Diferentemente da citação (que chama o réu pela 1ª vez), a intimação cientifica de atos subsequentes (sentença, audiência, despacho).",
    differentFrom:
      "Citação (1º chamamento do réu); notificação (extrajudicial ou em procedimentos especiais).",
    relatedArt: "art. 269 CPC",
  },
  {
    term: "Inversão do ônus da prova",
    area: "Consumidor",
    definition:
      "Transferência do dever de provar do consumidor ao fornecedor, quando presentes verossimilhança das alegações ou hipossuficiência. Concedida pelo juiz, em geral, no saneamento. É um direito básico do consumidor.",
    example:
      "Consumidor alega defeito no produto; fornecedor é obrigado a provar a inexistência do vício.",
    relatedTerms: ["Hipossuficiência", "Ônus da prova"],
    relatedArt: "art. 6º, VIII, CDC",
  },
  {
    term: "Juiz natural",
    area: "Constitucional",
    definition:
      "Princípio segundo o qual ninguém será processado nem sentenciado senão pela autoridade competente, vedados os juízos de exceção. Implica julgamento por juiz pré-constituído conforme regras objetivas de competência.",
    relatedArt: "art. 5º, XXXVII e LIII, CF",
  },
  {
    term: "Juizado Especial",
    area: "Processual Civil",
    definition:
      "Órgão judiciário voltado a causas cíveis de menor complexidade (até 40 SM) e infrações penais de menor potencial ofensivo. Procedimento oral, simplificado, gratuito até 1º grau. Causas até 20 SM dispensam advogado.",
    differentFrom:
      "Justiça Comum (procedimento ordinário, sem teto de alçada, com custas integrais).",
    relatedArt: "Lei 9.099/95",
  },
  {
    term: "Justa causa (trabalhista)",
    area: "Trabalho",
    definition:
      "Motivo grave que autoriza a rescisão do contrato de trabalho por iniciativa do empregador, sem direito a aviso prévio, multa do FGTS e seguro-desemprego. Hipóteses taxativas: ato de improbidade, embriaguez em serviço, abandono, desídia, etc.",
    relatedArt: "art. 482 CLT",
  },
  {
    term: "Legitimidade ad causam",
    area: "Processual Civil",
    definition:
      "Pertinência subjetiva entre a parte e o direito ou a relação jurídica deduzida em juízo. É condição da ação. Pode ser ativa (autor) ou passiva (réu); ordinária (em nome próprio sobre direito próprio) ou extraordinária (em nome próprio sobre direito alheio — substituição processual).",
    relatedArt: "art. 17 CPC",
  },
  {
    term: "Legítima defesa",
    area: "Penal",
    definition:
      "Excludente de ilicitude: emprego moderado dos meios necessários para repelir injusta agressão atual ou iminente a direito próprio ou alheio. Não confundir com vingança (após cessada a agressão).",
    differentFrom:
      "Estado de necessidade (perigo, não necessariamente provocado por agressão humana).",
    relatedArt: "art. 25 CP",
  },
  {
    term: "Liminar",
    area: "Processual Civil",
    definition:
      "Termo genérico para decisão concedida no início do processo, antes do contraditório, em caráter de urgência. Hoje, com o CPC/15, fala-se em tutela provisória (de urgência ou de evidência).",
    relatedTerms: ["Tutela de urgência", "Tutela da evidência"],
  },
  {
    term: "Litisconsórcio",
    area: "Processual Civil",
    definition:
      "Pluralidade de partes no mesmo polo da relação processual. Pode ser ativo (vários autores) ou passivo (vários réus); necessário (lei ou natureza da relação) ou facultativo; unitário (decisão idêntica para todos) ou simples (decisão pode ser diferente).",
    example:
      "Vários condôminos demandando o síndico = litisconsórcio ativo facultativo.",
    relatedArt: "arts. 113 e 114 CPC",
  },
  {
    term: "Litispendência",
    area: "Processual Civil",
    definition:
      "Reprodução de ação idêntica (mesmas partes, causa de pedir e pedido) já em curso. Gera extinção da segunda ação sem julgamento de mérito. Detectada pelo juiz, de ofício ou a requerimento.",
    differentFrom:
      "Coisa julgada (ação idêntica já transitada em julgado); conexão (causas que se ligam pela causa de pedir ou pedido — gera reunião, não extinção).",
    relatedArt: "art. 337 §3º CPC",
  },
  {
    term: "Lucros cessantes",
    area: "Civil",
    definition:
      "O que o credor razoavelmente deixou de ganhar em razão do dano. Não basta alegar — exige prova de probabilidade objetiva (não meras expectativas). Calculam-se com base em valores médios ou históricos.",
    example:
      "Taxista tem veículo batido por culpa de terceiro: enquanto o carro está no conserto, a média de faturamento diário multiplicada pelos dias parados constitui lucros cessantes.",
    differentFrom: "Dano emergente (perda efetiva, atual).",
    relatedTerms: ["Dano emergente", "Indenização"],
    relatedArt: "art. 402 CC",
  },
  {
    term: "Mandado de injunção",
    area: "Constitucional",
    definition:
      "Ação constitucional cabível quando a falta de norma regulamentadora torna inviável o exercício de direito ou liberdade constitucional. Concedido, o STF pode até suprir a omissão legislativa (efeitos concretos).",
    relatedArt: "art. 5º, LXXI, CF",
  },
  {
    term: "Mandado de Segurança",
    area: "Constitucional",
    definition:
      "Ação constitucional para proteção de direito líquido e certo (comprovável de plano), não amparado por habeas corpus ou habeas data, contra ato ilegal ou abusivo de autoridade pública. Prazo: 120 dias da ciência do ato.",
    example:
      "Candidato aprovado em concurso preterido por convocação fora da ordem impetra MS contra o ato da administração.",
    differentFrom:
      "Ação ordinária (admite dilação probatória; sem prazo decadencial específico).",
    relatedTerms: ["Habeas Corpus", "Habeas Data"],
    relatedArt: "Lei 12.016/09",
  },
  {
    term: "Mediação",
    area: "Processual Civil",
    definition:
      "Método autocompositivo em que terceiro imparcial (mediador) facilita o diálogo entre as partes para que cheguem por si mesmas a uma solução. Adequada para relações continuadas (família, vizinhança).",
    differentFrom:
      "Conciliação (conciliador é mais ativo, sugere soluções) e arbitragem (árbitro decide).",
    relatedArt: "Lei 13.140/15",
  },
  {
    term: "Memoriais",
    area: "Processual Civil",
    definition:
      "Manifestação escrita das partes, após a audiência de instrução, com argumentos finais sobre as provas produzidas, em substituição às alegações orais. Comum em causas complexas.",
    relatedTerms: ["Alegações Finais", "Audiência de instrução e julgamento"],
    relatedArt: "art. 364 §2º CPC",
  },
  {
    term: "Mora",
    area: "Civil",
    definition:
      "Atraso culposo no cumprimento da obrigação. Pode ser do devedor (mora solvendi) ou do credor (mora accipiendi). Gera juros, correção monetária e, no caso do devedor, perdas e danos. Em obrigação positiva, líquida e com termo, a mora é automática (ex re).",
    example:
      "Aluguel vence dia 10; pago dia 20 = mora do locatário. Locador exige sem aceitar pagamento parcial = mora do credor.",
    relatedTerms: ["Juros legais", "Perdas e danos"],
    relatedArt: "arts. 394 a 401 CC",
  },
  {
    term: "Multa diária (astreintes)",
    area: "Processual Civil",
    definition:
      "Sinônimo de astreintes — multa coercitiva, em geral diária, para compelir cumprimento de obrigação de fazer, não fazer ou entregar.",
    relatedTerms: ["Astreintes"],
    relatedArt: "art. 537 CPC",
  },
  {
    term: "Negativação",
    area: "Consumidor",
    definition:
      "Inscrição do nome do devedor em cadastros de proteção ao crédito (Serasa, SPC, Boa Vista). Exige prévia notificação (Súmula 359 STJ). Negativação indevida gera dano moral in re ipsa (salvo se já houver outras negativações legítimas — Súmula 385 STJ).",
    relatedTerms: ["Dano moral", "Hipossuficiência"],
  },
  {
    term: "Negociação coletiva",
    area: "Trabalho",
    definition:
      "Processo entre sindicatos (ou empresa e sindicato) para celebração de convenção coletiva ou acordo coletivo de trabalho. Tem força normativa: gera obrigações para os representados.",
    relatedArt: "art. 7º, XXVI, CF + arts. 611 e seguintes CLT",
  },
  {
    term: "Nexo causal",
    area: "Civil",
    definition:
      "Vínculo de causa e efeito entre a conduta do agente e o dano sofrido pela vítima. É requisito da responsabilidade civil. Rompe-se por culpa exclusiva da vítima, caso fortuito, força maior ou fato de terceiro.",
    relatedTerms: ["Indenização", "Responsabilidade civil"],
    relatedArt: "art. 186 CC",
  },
  {
    term: "Notificação extrajudicial",
    area: "Extrajudicial",
    definition:
      "Comunicação formal e documentada, em geral por cartório, para constituir em mora, denunciar contrato, exigir prestação, etc. Não é processual, mas tem efeitos jurídicos (prova da ciência, marco inicial de prazos).",
    example:
      "Locador notifica inquilino para desocupar imóvel ao fim do prazo contratual (denúncia).",
  },
  {
    term: "Obrigação de fazer",
    area: "Civil",
    definition:
      "Obrigação cujo objeto é uma prestação positiva (fazer algo). Pode ser fungível (qualquer pessoa pode cumprir — substituível) ou infungível (personalíssima). Inadimplida, converte-se em perdas e danos ou execução específica com astreintes.",
    differentFrom:
      "Obrigação de não fazer (abster-se de algo) e obrigação de dar (entregar coisa certa ou incerta).",
    relatedTerms: ["Astreintes", "Perdas e danos"],
    relatedArt: "art. 247 CC",
  },
  {
    term: "Ônus da prova",
    area: "Processual Civil",
    definition:
      "Encargo processual de demonstrar a veracidade de um fato. Regra: ao autor cabe provar o fato constitutivo do seu direito; ao réu, o fato impeditivo, modificativo ou extintivo. Pode ser invertido em hipóteses legais ou por decisão fundamentada.",
    relatedTerms: ["Inversão do ônus da prova"],
    relatedArt: "art. 373 CPC",
  },
  {
    term: "Pedido",
    area: "Processual Civil",
    definition:
      "Providência específica pleiteada ao Judiciário. Deve ser certo, determinado e líquido. Compreende o pedido imediato (provimento jurisdicional — condenação, declaração, constituição) e o mediato (bem da vida).",
    differentFrom:
      "Causa de pedir (fatos e fundamentos que sustentam o pedido).",
    relatedTerms: ["Causa de pedir", "Petição inicial"],
    relatedArt: "art. 322 CPC",
  },
  {
    term: "Penhora",
    area: "Execução",
    definition:
      "Ato pelo qual se afetam bens do devedor para satisfação do crédito em execução. Há ordem legal preferencial (dinheiro, aplicações, títulos, etc.). Recai sobre tantos bens quantos bastem para o pagamento. Em regra, segue-se da avaliação e expropriação.",
    relatedTerms: ["Impenhorabilidade", "Cumprimento de sentença"],
    relatedArt: "art. 835 CPC",
  },
  {
    term: "Pensão alimentícia",
    area: "Família",
    definition:
      "Modalidade de alimentos paga em prestações periódicas (em geral mensais). Pode ser fixada como percentual da renda do alimentante ou em valor fixo. O atraso de 3 meses pode acarretar prisão civil.",
    relatedTerms: ["Alimentos", "Binômio necessidade-possibilidade"],
    relatedArt: "art. 1.694 CC",
  },
  {
    term: "Perdas e danos",
    area: "Civil",
    definition:
      "Reparação devida ao credor pelo inadimplemento, parcial ou absoluto, da obrigação. Compreende dano emergente, lucros cessantes e, conforme o caso, dano moral.",
    relatedTerms: ["Dano emergente", "Lucros cessantes"],
    relatedArt: "art. 402 CC",
  },
  {
    term: "Periculum in mora",
    area: "Processual Civil",
    definition:
      'Perigo de dano ou risco ao resultado útil do processo. Junto ao fumus boni iuris (probabilidade do direito), constitui requisito da tutela de urgência.',
    relatedTerms: ["Fumus boni iuris", "Tutela de urgência"],
    relatedArt: "art. 300 CPC",
  },
  {
    term: "Peticionamento eletrônico",
    area: "Processual Civil",
    definition:
      "Protocolo digital de peças e documentos via sistemas como PJe, e-SAJ, e-proc, e-STJ. Hoje é regra (Lei 11.419/06); excepcionalmente, admite-se físico em casos justificados.",
  },
  {
    term: "Petição inicial",
    area: "Processual Civil",
    definition:
      "Peça que inaugura o processo. Deve conter: endereçamento, qualificação das partes, fatos, fundamentos jurídicos, pedido, valor da causa, provas, requerimento de citação e demais elementos do art. 319 CPC.",
    relatedTerms: ["Causa de pedir", "Pedido", "Inépcia da inicial"],
    relatedArt: "art. 319 CPC",
  },
  {
    term: "Poder familiar",
    area: "Família",
    definition:
      "Conjunto de direitos e deveres dos pais em relação aos filhos menores não emancipados: criação, educação, representação, administração de bens, exigência de obediência. É exercido em igualdade pelos pais e não se confunde com guarda.",
    differentFrom: "Guarda (direção do filho); tutela (substituição em caso de falta dos pais).",
    relatedTerms: ["Guarda compartilhada"],
    relatedArt: "art. 1.630 CC",
  },
  {
    term: "Posse",
    area: "Civil",
    definition:
      "Exercício, de fato, de algum dos poderes inerentes à propriedade (uso, gozo, fruição). Pode ser direta ou indireta, justa ou injusta, de boa-fé ou má-fé. Protegida por ações possessórias (manutenção, reintegração, interdito proibitório).",
    differentFrom: "Propriedade (direito subjetivo erga omnes); detenção (fâmulo da posse).",
    relatedArt: "art. 1.196 CC",
  },
  {
    term: "Preclusão",
    area: "Processual Civil",
    definition:
      "Perda de uma faculdade processual por ter decorrido o prazo (preclusão temporal), por ter praticado ato incompatível (lógica) ou por já ter exercido a faculdade (consumativa). Garante o avanço progressivo do processo.",
    example:
      "Réu que não recorre da sentença no prazo perde por preclusão temporal o direito de impugnar.",
    relatedArt: "arts. 223 e 507 CPC",
  },
  {
    term: "Preliminar",
    area: "Processual Civil",
    definition:
      "Matéria processual examinada antes do mérito: incompetência, ilegitimidade, falta de interesse, conexão, prescrição (em alguns casos), etc. Argüida em contestação; se acolhida, pode extinguir o processo sem mérito.",
    relatedTerms: ["Contestação"],
    relatedArt: "art. 337 CPC",
  },
  {
    term: "Preparo",
    area: "Recursos",
    definition:
      "Recolhimento das custas recursais e do porte de remessa e retorno, exigido no ato da interposição do recurso. A falta acarreta deserção (não conhecimento). Há possibilidade de complementação em 5 dias se insuficiente.",
    relatedArt: "art. 1.007 CPC",
  },
  {
    term: "Prescrição",
    area: "Civil",
    definition:
      "Perda da pretensão pelo decurso do tempo (em razão da inércia do titular). Não extingue o direito em si, mas a faculdade de exigi-lo em juízo. Prazo geral: 10 anos (art. 205 CC); prazos especiais variam (3 anos para reparação civil, 5 anos para dívidas líquidas, etc.).",
    differentFrom:
      "Decadência (perda do próprio direito potestativo).",
    relatedTerms: ["Decadência"],
    relatedArt: "art. 189 CC",
  },
  {
    term: "Pretensão",
    area: "Civil",
    definition:
      "Poder de exigir judicialmente um direito violado. Distingue-se do direito subjetivo: a violação dá origem à pretensão, sujeita à prescrição. Sem pretensão, não há ação.",
    relatedTerms: ["Ação", "Prescrição"],
    relatedArt: "art. 189 CC",
  },
  {
    term: "Procuração ad judicia",
    area: "Extrajudicial",
    definition:
      "Instrumento de mandato pelo qual o cliente outorga poderes ao advogado para representá-lo em juízo. Os poderes da cláusula ad judicia são gerais; para atos especiais (confessar, transigir, renunciar), exigem-se poderes específicos (ad judicia et extra).",
    relatedArt: "art. 105 CPC + art. 5º Estatuto OAB",
  },
  {
    term: "Prova emprestada",
    area: "Processual Civil",
    definition:
      "Utilização, em um processo, de prova produzida em outro, observado o contraditório. Necessária a participação prévia ou superveniente das partes interessadas.",
    relatedArt: "art. 372 CPC",
  },
  {
    term: "Queixa-crime",
    area: "Processo Penal",
    definition:
      "Peça acusatória apresentada pelo ofendido (ou representante) em crimes de ação penal privada (calúnia, difamação, injúria, etc.). Tem requisitos similares aos da denúncia. Prazo: 6 meses do conhecimento da autoria.",
    differentFrom: "Denúncia (oferecida pelo Ministério Público em ação pública).",
    relatedArt: "art. 30 CPP",
  },
  {
    term: "Recurso especial",
    area: "Recursos",
    definition:
      "Recurso ao STJ contra decisão final de tribunal que: (i) contrarie tratado ou lei federal; (ii) julgue válido ato local em face de lei federal; (iii) der à lei federal interpretação divergente de outro tribunal. Exige prequestionamento.",
    differentFrom: "Recurso extraordinário (ao STF, questões constitucionais).",
    relatedArt: "art. 105, III, CF",
  },
  {
    term: "Recurso extraordinário",
    area: "Recursos",
    definition:
      "Recurso ao STF contra decisão final que: (i) contrarie a CF; (ii) declarar inconstitucionalidade de tratado ou lei federal; (iii) julgar válida lei local contestada em face da CF. Exige repercussão geral.",
    differentFrom: "Recurso especial (ao STJ, questões de lei federal).",
    relatedArt: "art. 102, III, CF",
  },
  {
    term: "Reconvenção",
    area: "Processual Civil",
    definition:
      "Pretensão autônoma exercida pelo réu contra o autor no bojo da própria contestação. Exige conexão com a ação principal ou com fundamento da defesa. Tem natureza de ação — gera julgamento separado, ainda que conjuntamente.",
    example:
      'Em ação de cobrança, o réu reconvém pedindo indenização por danos morais decorrentes do mesmo contrato.',
    relatedTerms: ["Contestação"],
    relatedArt: "art. 343 CPC",
  },
  {
    term: "Réplica",
    area: "Processual Civil",
    definition:
      "Manifestação do autor sobre a contestação, em prazo de 15 dias. Oportunidade para refutar preliminares, contestar fatos novos e impugnar documentos juntados pelo réu.",
    relatedTerms: ["Contestação"],
    relatedArt: "art. 350 CPC",
  },
  {
    term: "Repercussão geral",
    area: "Recursos",
    definition:
      "Requisito específico do recurso extraordinário: a questão constitucional debatida deve transcender o interesse subjetivo das partes, em termos econômicos, políticos, sociais ou jurídicos.",
    relatedTerms: ["Recurso extraordinário"],
    relatedArt: "art. 102 §3º CF",
  },
  {
    term: "Rescisão indireta",
    area: "Trabalho",
    definition:
      "Resolução do contrato de trabalho por falta grave do empregador (ex.: descumprimento contratual, rigor excessivo, atrasos salariais). Equipara-se à dispensa sem justa causa, gerando todas as verbas rescisórias.",
    example:
      'Empregador atrasa salários por 3 meses; empregado ajuíza ação pleiteando rescisão indireta.',
    differentFrom:
      "Justa causa (falta grave do empregado, sem direito a verbas) e dispensa sem justa causa (vontade do empregador).",
    relatedArt: "art. 483 CLT",
  },
  {
    term: "Responsabilidade civil",
    area: "Civil",
    definition:
      "Obrigação de reparar o dano causado a outrem. Pode ser subjetiva (depende de culpa, regra) ou objetiva (independe de culpa — risco da atividade, defeito de produto, dano ambiental, danos do Estado, etc.).",
    differentFrom: "Responsabilidade penal (sanção ao infrator); responsabilidade administrativa (esfera funcional).",
    relatedTerms: ["Nexo causal", "Indenização"],
    relatedArt: "arts. 186 e 927 CC",
  },
  {
    term: "Responsabilidade objetiva",
    area: "Civil",
    definition:
      "Modalidade em que o dever de indenizar surge independentemente de culpa, bastando demonstrar conduta, dano e nexo causal. Aplicação típica: relações de consumo, danos ambientais, atividades de risco, Estado.",
    relatedArt: "art. 927 §único CC",
  },
  {
    term: "Revelia",
    area: "Processual Civil",
    definition:
      "Ausência de contestação no prazo. Gera a presunção (relativa) de veracidade dos fatos narrados pelo autor. Não se aplica em direitos indisponíveis, ações sobre estado e capacidade, instrumento público da essência, etc.",
    relatedArt: "art. 344 CPC",
  },
  {
    term: "Roubo",
    area: "Penal",
    definition:
      "Subtração de coisa alheia móvel mediante violência ou grave ameaça à pessoa. Pena: 4 a 10 anos. Causas de aumento: arma de fogo, concurso de pessoas, restrição da liberdade da vítima, etc. (art. 157 §2º CP).",
    differentFrom: "Furto (sem violência ou ameaça).",
    relatedArt: "art. 157 CP",
  },
  {
    term: "Saneamento e organização",
    area: "Processual Civil",
    definition:
      "Decisão judicial em que se resolvem questões processuais pendentes, fixam-se os pontos controvertidos, definem-se as provas a produzir e os ônus probatórios. Pode ser feita em audiência (em causas complexas, com cooperação das partes).",
    relatedArt: "art. 357 CPC",
  },
  {
    term: "Sentença",
    area: "Processual Civil",
    definition:
      "Ato do juiz que põe fim à fase de conhecimento do processo no 1º grau, com ou sem julgamento de mérito. Estrutura legal: relatório, fundamentação e dispositivo. Sentença sem fundamentação é nula.",
    differentFrom:
      "Acórdão (decisão colegiada); decisão interlocutória (resolve questão incidente).",
    relatedTerms: ["Acórdão", "Decisão interlocutória"],
    relatedArt: "arts. 203 §1º e 489 CPC",
  },
  {
    term: "Súmula vinculante",
    area: "Constitucional",
    definition:
      "Súmula editada pelo STF, após reiteradas decisões sobre matéria constitucional, de observância obrigatória pelo Judiciário e pela Administração. O descumprimento autoriza reclamação direta ao STF.",
    differentFrom: "Súmula comum (orientação não vinculante).",
    relatedArt: "art. 103-A CF",
  },
  {
    term: "Suspeição",
    area: "Processual Civil",
    definition:
      "Causa subjetiva de afastamento do juiz (amizade íntima, inimizade, interesse no julgamento, etc.). Nulidade relativa — deve ser argüida em até 15 dias. Difere de impedimento (causa objetiva, nulidade absoluta).",
    differentFrom: "Impedimento (objetivo, absoluto).",
    relatedArt: "art. 145 CPC",
  },
  {
    term: "Sustentação oral",
    area: "Recursos",
    definition:
      "Exposição oral das razões do recurso na sessão de julgamento do tribunal, com tempo de 15 min. Cabível em apelação, recurso ordinário, recurso especial, recurso extraordinário, embargos de divergência, ação rescisória, mandado de segurança originário, etc.",
    relatedArt: "art. 937 CPC",
  },
  {
    term: "Termo de Ajustamento de Conduta (TAC)",
    area: "Administrativo",
    definition:
      "Acordo extrajudicial entre o Ministério Público (ou órgão público) e infrator, em que este se compromete a adequar sua conduta às exigências legais, sob pena de multa. Tem eficácia de título executivo extrajudicial.",
    relatedArt: "art. 5º §6º Lei 7.347/85",
  },
  {
    term: "Testamento",
    area: "Sucessões",
    definition:
      "Ato unilateral pelo qual alguém dispõe, para depois de sua morte, da totalidade ou parte de seus bens (a metade disponível, respeitada a legítima dos herdeiros necessários). Formas: público, cerrado e particular.",
    relatedArt: "arts. 1.857 e seguintes CC",
  },
  {
    term: "Tipicidade",
    area: "Penal",
    definition:
      "Adequação do fato concreto à descrição abstrata da lei penal (tipo). Sem tipicidade, não há crime. É a 1ª etapa do conceito analítico de crime (tipicidade + ilicitude + culpabilidade).",
    relatedArt: "art. 1º CP",
  },
  {
    term: "Título executivo",
    area: "Execução",
    definition:
      "Documento que confere ao credor o direito de promover a execução. Pode ser judicial (sentença, acórdão, decisão homologatória) ou extrajudicial (cheque, nota promissória, contrato com 2 testemunhas, etc.).",
    relatedTerms: ["Cumprimento de sentença", "Execução de título extrajudicial"],
    relatedArt: "arts. 515 e 784 CPC",
  },
  {
    term: "Tráfico de drogas",
    area: "Penal",
    definition:
      "Importar, exportar, remeter, preparar, produzir, fabricar, adquirir, vender, expor à venda, oferecer, ter em depósito, transportar, trazer consigo, guardar etc. drogas, sem autorização. Pena: 5 a 15 anos. Crime equiparado a hediondo.",
    relatedArt: "art. 33 Lei 11.343/06",
  },
  {
    term: "Trânsito em julgado",
    area: "Processual Civil",
    definition:
      "Momento em que a decisão não mais admite recurso (pela preclusão das vias recursais ou pelo esgotamento). Diferente de coisa julgada (efeito de imutabilidade).",
    differentFrom: "Coisa julgada (efeito); trânsito em julgado (momento).",
    relatedTerms: ["Coisa julgada"],
    relatedArt: "art. 502 CPC",
  },
  {
    term: "Tribunal do Júri",
    area: "Processo Penal",
    definition:
      "Órgão constitucional competente para julgar os crimes dolosos contra a vida (homicídio, infanticídio, aborto, instigação ao suicídio) e seus conexos. Composto pelo juiz togado e 7 jurados sorteados. Soberania dos veredictos.",
    relatedArt: "art. 5º, XXXVIII, CF + arts. 406 e seguintes CPP",
  },
  {
    term: "Tutela cautelar",
    area: "Processual Civil",
    definition:
      "Modalidade de tutela provisória de urgência destinada a assegurar o resultado útil do processo (não a satisfazer o direito desde logo). Ex.: arresto, sequestro, busca e apreensão liminar.",
    differentFrom: "Tutela antecipada (satisfaz desde logo o direito) e tutela da evidência (sem urgência).",
    relatedTerms: ["Tutela de urgência"],
    relatedArt: "art. 301 CPC",
  },
  {
    term: "Tutela da evidência",
    area: "Processual Civil",
    definition:
      "Tutela provisória que dispensa o periculum in mora. Concedida quando: (i) abuso do direito de defesa; (ii) tese firmada em julgamento de casos repetitivos ou súmula vinculante; (iii) pedido reipersecutório com prova documental do contrato; (iv) prova documental capaz de produzir a evidência do direito.",
    differentFrom: "Tutela de urgência (exige fumus boni iuris + periculum in mora).",
    relatedTerms: ["Tutela de urgência"],
    relatedArt: "art. 311 CPC",
  },
  {
    term: "Tutela de urgência",
    area: "Processual Civil",
    definition:
      "Provimento liminar concedido quando há (i) probabilidade do direito (fumus boni iuris) e (ii) perigo de dano ou risco ao resultado útil do processo (periculum in mora). Pode ser antecipada (satisfativa) ou cautelar (assegurativa).",
    example:
      "Negativa de cirurgia urgente pelo plano de saúde: pode-se obter tutela de urgência para autorização imediata.",
    differentFrom: "Tutela da evidência (sem urgência, mas com forte probabilidade); liminar (termo genérico).",
    relatedTerms: ["Fumus boni iuris", "Periculum in mora", "Tutela da evidência"],
    relatedArt: "art. 300 CPC",
  },
  {
    term: "União estável",
    area: "Família",
    definition:
      "Convivência pública, contínua e duradoura entre duas pessoas, com o objetivo de constituir família. Equipara-se ao casamento para efeitos sucessórios, previdenciários e patrimoniais. Regime padrão: comunhão parcial.",
    differentFrom: "Casamento (vínculo formal por celebração civil) e namoro qualificado (sem ânimo de constituir família).",
    relatedArt: "art. 1.723 CC + art. 226 §3º CF",
  },
  {
    term: "Usucapião",
    area: "Civil",
    definition:
      "Modo de aquisição da propriedade pela posse mansa, pacífica e contínua, com animus domini, pelo prazo legal. Variantes: extraordinária (15 anos), ordinária (10 anos com justo título e boa-fé), especial urbana/rural, familiar, coletiva.",
    relatedArt: "arts. 1.238 a 1.244 CC",
  },
  {
    term: "Valor da causa",
    area: "Processual Civil",
    definition:
      "Quantia atribuída à causa, com reflexos em competência (alçada de juizado, fixação de custas), preparo recursal e honorários sucumbenciais. Deve corresponder ao valor econômico do pedido. Pode ser impugnado pelo réu.",
    relatedArt: "arts. 291 e seguintes CPC",
  },
  {
    term: "Vícios redibitórios",
    area: "Civil",
    definition:
      "Defeitos ocultos no produto recebido em virtude de contrato comutativo, que o tornam impróprio ao uso ou lhe diminuem o valor. Conferem direito à redibição (devolução com restituição do preço) ou abatimento (ação quanti minoris). Prazo decadencial: 30 dias (móveis) / 1 ano (imóveis).",
    differentFrom: "Vício do produto no CDC (relações de consumo, prazos diferentes).",
    relatedArt: "arts. 441 a 446 CC",
  },
  {
    term: "Vista dos autos",
    area: "Processual Civil",
    definition:
      "Acesso da parte (por meio do seu advogado) aos autos do processo, em geral via sistema eletrônico. Em alguns atos exige carga, abertura de vista ou simples consulta. Falta de vista pode gerar nulidade por cerceamento de defesa.",
  },
  {
    term: "Aborto",
    area: "Penal",
    definition:
      "Interrupção da gravidez com a destruição do produto da concepção. Crime, salvo: (i) aborto necessário (risco à vida da gestante); (ii) sentimental (gravidez decorrente de estupro); e (iii) anencefalia (decisão do STF na ADPF 54).",
    relatedArt: "arts. 124 a 128 CP",
  },
  {
    term: "Adoção",
    area: "Família",
    definition:
      "Ato jurídico que estabelece, por sentença, vínculo de filiação entre adotante e adotando. Irrevogável. No Brasil, exige cadastro nacional, estágio de convivência, parecer técnico e melhor interesse da criança.",
    relatedArt: "art. 39 ECA + art. 1.618 CC",
  },
  {
    term: "Ato infracional",
    area: "ECA",
    definition:
      "Conduta descrita como crime ou contravenção penal praticada por criança (até 12 anos incompletos) ou adolescente (12 a 17 anos). Aplicam-se medidas protetivas (criança) ou socioeducativas (adolescente).",
    relatedArt: "art. 103 ECA",
  },
  {
    term: "ECA",
    area: "ECA",
    definition:
      "Estatuto da Criança e do Adolescente — microssistema legal de proteção integral. Estabelece direitos fundamentais (vida, saúde, dignidade, educação) e procedimentos especiais (adoção, ato infracional, perda do poder familiar).",
    relatedArt: "Lei 8.069/90",
  },
  {
    term: "Assédio moral",
    area: "Trabalho",
    definition:
      "Conduta abusiva, reiterada, no ambiente laboral, atentatória à dignidade ou integridade psíquica do trabalhador. Gera dever de indenizar (dano moral) e pode caracterizar rescisão indireta.",
    relatedTerms: ["Rescisão indireta", "Dano moral"],
    relatedArt: "art. 483 CLT (rescisão indireta)",
  },
  {
    term: "Banco de horas",
    area: "Trabalho",
    definition:
      "Sistema de compensação de jornada em que horas extras de um dia podem ser compensadas com folgas em outros. Por acordo individual escrito, compensação em até 6 meses; por convenção/acordo coletivo, em até 1 ano.",
    relatedArt: "art. 59 §§2º e 5º CLT",
  },
  {
    term: "Carência (plano de saúde)",
    area: "Consumidor",
    definition:
      "Período inicial do contrato em que algumas coberturas não são disponíveis. A Lei 9.656/98 fixa carências máximas: 24h (urgência/emergência), 180 dias (procedimentos em geral), 300 dias (parto a termo), 24 meses (doença/lesão preexistente).",
    relatedArt: "art. 12 Lei 9.656/98",
  },
  {
    term: "Concorrência desleal",
    area: "Empresarial",
    definition:
      "Atos contrários aos usos honestos de comércio, em prejuízo de concorrente: confusão de marcas, desvio de clientela por meios fraudulentos, falsas afirmações, etc. Gera responsabilidade civil e, em alguns casos, penal.",
    relatedArt: "art. 195 Lei 9.279/96",
  },
  {
    term: "Concursos públicos",
    area: "Administrativo",
    definition:
      "Procedimento seletivo de provas (ou provas e títulos), aberto e impessoal, para investidura em cargos efetivos da Administração Pública. Princípios: legalidade, impessoalidade, igualdade, eficiência, vinculação ao edital.",
    relatedArt: "art. 37, II, CF",
  },
  {
    term: "Crime hediondo",
    area: "Penal",
    definition:
      "Crime de gravidade especial, com regime jurídico mais severo: inafiançável, insuscetível de graça/anistia/indulto, progressão de regime após 40% (primário) ou 60% (reincidente) da pena.",
    relatedArt: "Lei 8.072/90",
  },
  {
    term: "Difamação",
    area: "Penal",
    definition:
      "Imputar a alguém fato ofensivo à sua reputação, ainda que verdadeiro (a verdade não exclui o crime, salvo em casos legais). Pena: detenção de 3 meses a 1 ano + multa.",
    differentFrom: "Calúnia (imputação falsa de crime) e injúria (ofensa direta à honra subjetiva).",
    relatedArt: "art. 139 CP",
  },
  {
    term: "Direito adquirido",
    area: "Constitucional",
    definition:
      "Direito incorporado definitivamente ao patrimônio jurídico de seu titular antes de novo regramento legal. A CF assegura que a lei nova não o prejudicará (CF, art. 5º, XXXVI).",
    relatedTerms: ["Ato jurídico perfeito", "Coisa julgada"],
    relatedArt: "art. 5º, XXXVI, CF",
  },
  {
    term: "Direito real",
    area: "Civil",
    definition:
      "Poder jurídico do titular sobre uma coisa, oponível erga omnes. Ex.: propriedade, usufruto, servidão, hipoteca, penhor. Disciplinados nos arts. 1.225 e seguintes do CC.",
    differentFrom: "Direito pessoal (relação entre pessoas — credor x devedor).",
    relatedArt: "art. 1.225 CC",
  },
  {
    term: "Estelionato",
    area: "Penal",
    definition:
      "Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro mediante artifício, ardil ou qualquer outro meio fraudulento. Pena: 1 a 5 anos. Estelionato eletrônico (golpe do PIX, falso pagamento): pena agravada (Lei 14.155/21).",
    differentFrom: "Furto (subtração sem fraude) e apropriação indébita (posse anterior legítima).",
    relatedArt: "art. 171 CP",
  },
  {
    term: "Falência",
    area: "Empresarial",
    definition:
      "Processo coletivo de execução contra empresário ou sociedade empresária em estado de insolvência. Reúne todos os credores; objetivo é otimizar a satisfação dos créditos com a alienação dos ativos.",
    differentFrom: "Recuperação judicial (objetiva soerguer a empresa, sem liquidação).",
    relatedTerms: ["Recuperação judicial"],
    relatedArt: "Lei 11.101/05",
  },
  {
    term: "FGTS",
    area: "Trabalho",
    definition:
      "Fundo de Garantia do Tempo de Serviço — depósito mensal pelo empregador de 8% sobre a remuneração do empregado, em conta vinculada na CEF. Levantado em hipóteses específicas (dispensa sem justa causa, aposentadoria, doença grave, etc.).",
    relatedArt: "Lei 8.036/90",
  },
  {
    term: "ICMS",
    area: "Tributário",
    definition:
      "Imposto sobre a Circulação de Mercadorias e Prestação de Serviços de transporte interestadual/intermunicipal e de comunicação. De competência dos Estados e DF. Não cumulativo. Alíquotas variam de 7% a 25%, conforme produto e UF.",
    relatedArt: "art. 155, II, CF + LC 87/96",
  },
  {
    term: "Imposto de Renda",
    area: "Tributário",
    definition:
      "Tributo federal sobre a renda (acréscimos patrimoniais) e proventos de qualquer natureza. Pessoa física: tabela progressiva (até 27,5%). Pessoa jurídica: lucro real, presumido ou arbitrado. Princípio da capacidade contributiva.",
    relatedArt: "art. 153, III, CF + Lei 7.713/88",
  },
  {
    term: "Injúria",
    area: "Penal",
    definition:
      "Ofender a dignidade ou o decoro de alguém. Pena: detenção de 1 a 6 meses + multa. Injúria racial (uso de elementos referentes a raça, cor, etnia, religião, origem) tem pena especial (1 a 3 anos + multa) e é imprescritível.",
    differentFrom: "Calúnia (imputação falsa de crime) e difamação (fato ofensivo à reputação).",
    relatedArt: "art. 140 CP",
  },
  {
    term: "Juros legais",
    area: "Civil",
    definition:
      "Juros que incidem por força de lei, em geral à taxa de 1% ao mês (12% ao ano), conforme art. 406 CC c/c art. 161 §1º CTN. Aplicam-se na mora, indenização, perdas e danos, salvo regulação específica.",
    relatedTerms: ["Mora"],
    relatedArt: "art. 406 CC",
  },
  {
    term: "LGPD",
    area: "Constitucional",
    definition:
      "Lei Geral de Proteção de Dados — regulamenta o tratamento de dados pessoais para proteger os direitos fundamentais de liberdade, privacidade e o livre desenvolvimento da personalidade. Hipóteses legais de tratamento, direitos do titular, sanções administrativas.",
    relatedArt: "Lei 13.709/18",
  },
  {
    term: "Litigância de má-fé",
    area: "Processual Civil",
    definition:
      "Conduta do litigante que: deduz pretensão contra texto expresso; altera a verdade; usa o processo para fim ilegal; opõe resistência injustificada; procede de modo temerário; provoca incidentes infundados; interpõe recurso protelatório. Multa de até 10% do valor da causa.",
    relatedArt: "arts. 80 e 81 CPC",
  },
  {
    term: "Locação",
    area: "Imobiliário",
    definition:
      "Contrato pelo qual uma das partes (locador) cede o uso e gozo de coisa não fungível à outra (locatário) por tempo determinado ou indeterminado, mediante pagamento de aluguel. Regida pelo CC (em geral) e pela Lei 8.245/91 (imóveis urbanos).",
    relatedTerms: ["Despejo", "Caução"],
    relatedArt: "Lei 8.245/91",
  },
  {
    term: "Mediação penal",
    area: "Processo Penal",
    definition:
      "Procedimento, em geral em crimes de menor potencial ofensivo, em que vítima e ofensor dialogam, com auxílio de mediador, para reparação do dano e composição. Pode acarretar transação penal.",
    relatedTerms: ["Transação penal"],
  },
  {
    term: "Multa de trânsito",
    area: "Administrativo",
    definition:
      "Sanção pecuniária por infração ao CTB. Há gradação (leve, média, grave, gravíssima) com pontuação. Cabe defesa prévia, recurso à JARI e ao CETRAN. Auto deve descrever a infração; ausência de elementos enseja anulação.",
    relatedArt: "Lei 9.503/97 (CTB)",
  },
  {
    term: "Pacto antenupcial",
    area: "Família",
    definition:
      "Convenção feita pelos nubentes antes do casamento, por escritura pública, estabelecendo regime de bens diverso do legal (comunhão parcial). Indispensável para regime de comunhão universal, separação total convencional, participação final nos aquestos.",
    relatedArt: "art. 1.640 §único CC",
  },
  {
    term: "Pena alternativa",
    area: "Penal",
    definition:
      "Modalidades substitutivas da pena privativa de liberdade: prestação de serviços à comunidade, limitação de fim de semana, prestação pecuniária, perda de bens, interdição temporária de direitos. Cabíveis em crimes culposos ou dolosos com pena até 4 anos, sem violência/grave ameaça.",
    relatedArt: "arts. 43 a 48 CP",
  },
  {
    term: "Princípio da insignificância",
    area: "Penal",
    definition:
      "Causa supralegal de exclusão da tipicidade material: condutas que produzem lesão mínima ao bem jurídico não constituem crime. Requisitos: mínima ofensividade, ausência de periculosidade, reduzido grau de reprovabilidade, inexpressividade da lesão.",
    relatedTerms: ["Tipicidade"],
  },
  {
    term: "Princípio da legalidade",
    area: "Constitucional",
    definition:
      "Ninguém será obrigado a fazer ou deixar de fazer algo senão em virtude de lei (CF, art. 5º, II). No Direito Administrativo, o agente público só pode agir conforme a lei. No Direito Penal, não há crime nem pena sem lei anterior (CF, art. 5º, XXXIX).",
    relatedArt: "art. 5º, II e XXXIX, CF",
  },
  {
    term: "Princípio da proporcionalidade",
    area: "Constitucional",
    definition:
      "Subordinação dos atos estatais a três critérios: adequação (meio é apto?), necessidade (não há meio menos gravoso?) e proporcionalidade em sentido estrito (benefícios superam os custos?). Aplicado em colisão de direitos fundamentais.",
  },
  {
    term: "Princípio do contraditório",
    area: "Constitucional",
    definition:
      "Garantia constitucional pela qual ninguém será privado de bens ou liberdade sem que tenha tido oportunidade de se manifestar e influenciar a decisão. Compreende o direito de informação, manifestação e influência.",
    relatedTerms: ["Devido processo legal", "Ampla defesa"],
    relatedArt: "art. 5º, LV, CF",
  },
  {
    term: "Princípio da função social",
    area: "Civil",
    definition:
      "A propriedade, o contrato e a empresa devem cumprir sua função social: respeitar o ordenamento, o meio ambiente, o trabalho e o consumidor. Justifica limitações legais e judiciais à autonomia privada.",
    relatedArt: "art. 5º, XXIII, CF + art. 421 CC",
  },
  {
    term: "Princípio do in dubio pro reo",
    area: "Processo Penal",
    definition:
      "Em caso de dúvida sobre a autoria ou materialidade, decide-se em favor do réu. Decorre da presunção de inocência (CF, art. 5º, LVII). Não se confunde com inversão do ônus probatório, mas com critério de decisão na dúvida.",
    relatedTerms: ["Presunção de inocência"],
  },
  {
    term: "Presunção de inocência",
    area: "Constitucional",
    definition:
      "Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória (CF, art. 5º, LVII). Implica ônus probatório da acusação e proibição de tratamento prévio como culpado.",
    relatedArt: "art. 5º, LVII, CF",
  },
  {
    term: "Recuperação judicial",
    area: "Empresarial",
    definition:
      "Procedimento destinado a permitir a superação da crise econômico-financeira do devedor empresário, mantendo a fonte produtora, o emprego dos trabalhadores e os interesses dos credores. Plano de recuperação aprovado em assembleia.",
    differentFrom: "Falência (extinção da empresa); recuperação extrajudicial (acordo direto, sem assembleia).",
    relatedTerms: ["Falência"],
    relatedArt: "art. 47 Lei 11.101/05",
  },
  {
    term: "Salário-família",
    area: "Trabalho",
    definition:
      "Benefício previdenciário pago ao trabalhador de baixa renda, por filho menor de 14 anos ou inválido. Valor unitário definido anualmente pelo INSS.",
    relatedArt: "art. 7º, XII, CF + Lei 8.213/91",
  },
  {
    term: "Salário mínimo",
    area: "Trabalho",
    definition:
      "Menor remuneração admitida no país, fixada por lei, nacionalmente unificada, capaz de atender às necessidades vitais básicas do trabalhador e sua família. Reajustes anuais por lei.",
    relatedArt: "art. 7º, IV, CF",
  },
  {
    term: "Sigilo profissional",
    area: "Extrajudicial",
    definition:
      "Dever do advogado de manter em segredo os fatos de que toma conhecimento no exercício da profissão. Constitui direito (recusar depoimento) e dever (não revelar mesmo sob ameaça). Imune até em busca e apreensão no escritório.",
    relatedArt: "art. 7º, II e XIX, Estatuto OAB + art. 154 CP",
  },
  {
    term: "Sigilo telefônico",
    area: "Constitucional",
    definition:
      "É inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e telefônicas, salvo, no último caso, por ordem judicial, para fins de investigação criminal ou instrução processual penal.",
    relatedArt: "art. 5º, XII, CF + Lei 9.296/96",
  },
  {
    term: "Suspensão condicional do processo",
    area: "Processo Penal",
    definition:
      "Acordo proposto pelo MP em crimes com pena mínima até 1 ano. Suspende-se o processo por 2 a 4 anos, mediante condições. Cumpridas, extingue-se a punibilidade. Aplicável apenas a réu sem condenação anterior por crime.",
    differentFrom: "Transação penal (Lei 9.099/95, crimes de menor potencial); ANPP (Lei 13.964/19, fora da audiência).",
    relatedArt: "art. 89 Lei 9.099/95",
  },
  {
    term: "Suspensão dos direitos políticos",
    area: "Constitucional",
    definition:
      "Hipóteses de perda ou suspensão (CF, art. 15): cancelamento de naturalização, incapacidade civil absoluta, condenação criminal transitada em julgado enquanto durarem seus efeitos, recusa a obrigação a todos imposta, improbidade administrativa.",
    relatedArt: "art. 15 CF",
  },
  {
    term: "Termo circunstanciado",
    area: "Processo Penal",
    definition:
      "Peça lavrada pela autoridade policial, em substituição ao auto de prisão em flagrante, em casos de infração de menor potencial ofensivo (até 2 anos de pena máxima ou contravenção). Encaminha-se ao Juizado Especial Criminal.",
    relatedArt: "art. 69 Lei 9.099/95",
  },
  {
    term: "Transação penal",
    area: "Processo Penal",
    definition:
      "Proposta do MP, em infração de menor potencial ofensivo, de pena restritiva de direitos ou multa antes do oferecimento da denúncia. Aceita pelo autor, evita o processo, sem reincidência ou maus antecedentes.",
    differentFrom: "Suspensão condicional do processo (após denúncia, pena mínima até 1 ano).",
    relatedArt: "art. 76 Lei 9.099/95",
  },
  {
    term: "Verbas rescisórias",
    area: "Trabalho",
    definition:
      "Pagamentos devidos ao trabalhador no momento da rescisão contratual: saldo de salário, férias proporcionais + 1/3, 13º proporcional, aviso prévio (se sem justa causa), multa de 40% do FGTS, liberação do FGTS, guias do seguro-desemprego.",
    relatedArt: "arts. 477, 478 e 482 CLT",
  },
  {
    term: "Vícios do consentimento",
    area: "Civil",
    definition:
      "Defeitos que viciam a manifestação da vontade no negócio jurídico: erro, dolo, coação, estado de perigo, lesão, fraude contra credores. Geram anulabilidade do ato, com prazo decadencial de 4 anos.",
    relatedArt: "arts. 138 a 165 CC",
  },
  {
    term: "Voto de qualidade",
    area: "Processual Civil",
    definition:
      "Em colegiados, voto de desempate. No CPC/15, em caso de empate, o voto do presidente decide. No TRF/STJ/STF e tribunais, regimentos disciplinam.",
  },
  {
    term: "Zelo profissional",
    area: "Extrajudicial",
    definition:
      "Dever ético do advogado de empregar a diligência adequada na condução das causas. A negligência grave pode ensejar responsabilidade civil perante o cliente e sanção disciplinar pela OAB.",
    relatedArt: "art. 34 Estatuto OAB",
  },
];

export const GLOSSARY_AREAS = Array.from(new Set(GLOSSARY.map((g) => g.area))).sort();
