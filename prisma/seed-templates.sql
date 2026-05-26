-- =============================================================
-- Seed expandido de modelos premium — substitui o seed inicial
-- =============================================================
truncate table public.templates;

insert into public.templates (title, area, piece_type, description, body, is_premium) values

-- =============== Direito Civil ===============
(
  'Petição Inicial — Indenização por Danos Morais (Consumidor)',
  'Direito do Consumidor',
  'peticao_inicial',
  'Modelo base para ações indenizatórias decorrentes de relação de consumo, com fundamentação no CDC.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL DA COMARCA DE ___\n\n[QUALIFICAÇÃO DA PARTE AUTORA], vem, respeitosamente, à presença de Vossa Excelência, por seu(sua) advogado(a) que esta subscreve, com fundamento nos artigos 6º, VI, e 14 da Lei nº 8.078/1990 (Código de Defesa do Consumidor), propor a presente\n\nAÇÃO DE INDENIZAÇÃO POR DANOS MORAIS\n\nem face de [QUALIFICAÇÃO DA PARTE RÉ], pelos fatos e fundamentos a seguir expostos.\n\nI – DOS FATOS\n[Descrever os fatos com clareza e cronologia]\n\nII – DO DIREITO\nA relação jurídica existente entre as partes caracteriza-se como típica relação de consumo, atraindo a incidência do CDC. A responsabilidade do fornecedor é objetiva, nos termos do art. 14, caput, do CDC. A inversão do ônus da prova é cabível conforme art. 6º, VIII, do CDC.\n\nIII – DOS PEDIDOS\nDiante do exposto, requer:\na) a citação da parte ré para responder aos termos da presente;\nb) a inversão do ônus da prova;\nc) a condenação ao pagamento de indenização por danos morais no valor de R$ ___;\nd) a condenação em honorários advocatícios e custas processuais.\n\nProtesta provar o alegado por todos os meios de prova em direito admitidos.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.\n\n[Local], [Data].\n[Nome do(a) Advogado(a)] — OAB/__ nº ___',
  true
),
(
  'Petição Inicial — Ação de Cobrança',
  'Direito Civil',
  'peticao_inicial',
  'Ação de cobrança baseada em título sem força executiva.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL DA COMARCA DE ___\n\n[QUALIFICAÇÃO DO AUTOR], vem propor AÇÃO DE COBRANÇA em face de [QUALIFICAÇÃO DO RÉU], pelos fatos e fundamentos a seguir.\n\nI – DOS FATOS\n[Descrever a origem da dívida, datas, valor, tentativas de cobrança]\n\nII – DO DIREITO\nNos termos do art. 397 do Código Civil, o inadimplemento da obrigação positiva e líquida no seu termo constitui de pleno direito em mora o devedor. Os juros legais incidem desde a constituição em mora (art. 405, CC), e a correção monetária preserva o valor real da dívida.\n\nIII – DOS PEDIDOS\nRequer:\na) a citação do réu;\nb) a condenação ao pagamento de R$ ___, acrescido de juros de mora de 1% ao mês e correção monetária pelo IPCA, desde [data];\nc) honorários advocatícios em 20% sobre o valor da condenação.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Petição Inicial — Despejo por Falta de Pagamento',
  'Direito Civil',
  'peticao_inicial',
  'Ação de despejo cumulada com cobrança, conforme Lei 8.245/91.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL DA COMARCA DE ___\n\n[QUALIFICAÇÃO DO LOCADOR], vem propor AÇÃO DE DESPEJO POR FALTA DE PAGAMENTO CUMULADA COM COBRANÇA em face de [QUALIFICAÇÃO DO LOCATÁRIO], com fundamento nos arts. 9º, III, e 62 da Lei nº 8.245/91, pelos fatos a seguir.\n\nI – DOS FATOS\nAs partes celebraram contrato de locação residencial em [data] do imóvel situado em [endereço], com aluguel mensal de R$ ___. O locatário está inadimplente desde [data], devendo R$ ___ em aluguéis e encargos.\n\nII – DO DIREITO\nA falta de pagamento autoriza a rescisão da locação e despejo, cumulado com a cobrança dos valores devidos, na forma do art. 62 da Lei do Inquilinato.\n\nIII – DOS PEDIDOS\na) a citação do réu para purgar a mora em 15 dias (art. 62, II);\nb) o decreto de despejo, com desocupação em 30 dias;\nc) a condenação ao pagamento dos aluguéis vencidos e vincendos, encargos e indenizações;\nd) a fixação de honorários sucumbenciais.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  true
),

-- =============== Processual Civil ===============
(
  'Contestação — Ação de Cobrança',
  'Direito Civil',
  'contestacao',
  'Modelo de contestação genérica para ações de cobrança, com preliminares e mérito.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL\n\nAutos nº ___\n\n[QUALIFICAÇÃO DA PARTE RÉ], nos autos da ação em epígrafe, vem apresentar CONTESTAÇÃO, pelos fundamentos a seguir.\n\nI – DAS PRELIMINARES\n1.1 Da prescrição. A pretensão autoral encontra-se prescrita, nos termos do art. 206, § 5º, I, do Código Civil.\n1.2 Da ilegitimidade passiva. [Quando aplicável]\n\nII – DO MÉRITO\n[Refutação dos fatos ponto a ponto]\n\nIII – DOS PEDIDOS\nRequer a total improcedência dos pedidos iniciais e a condenação do autor nas verbas sucumbenciais.\n\nProtesta provar o alegado por todos os meios de prova em direito admitidos.\n\nNestes termos, pede deferimento.\n\n[Local], [Data].',
  true
),
(
  'Recurso de Apelação — Cível',
  'Direito Processual Civil',
  'apelacao',
  'Razões de apelação cível, conforme art. 1.010 do CPC.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO\n\n[Recorrente], inconformado(a) com a r. sentença de fls. ___, vem interpor RECURSO DE APELAÇÃO, com fundamento no art. 1.009 do CPC, requerendo o recebimento e, após as formalidades legais, a remessa dos autos ao Egrégio Tribunal.\n\nRAZÕES DE APELAÇÃO\n\nI – BREVE SÍNTESE\n[Resumo da demanda e da sentença]\n\nII – DA TEMPESTIVIDADE E DO PREPARO\nO presente recurso é tempestivo e o preparo encontra-se devidamente recolhido (guia anexa).\n\nIII – DAS RAZÕES DE REFORMA\n[Erros de fato e de direito da sentença]\n\nIV – DOS PEDIDOS\nRequer o conhecimento e provimento do recurso para reformar integralmente a r. sentença.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Agravo de Instrumento — Decisão Liminar',
  'Direito Processual Civil',
  'agravo_instrumento',
  'Agravo contra decisão interlocutória que indeferiu pedido liminar.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___\n\n[Agravante], inconformado(a) com a r. decisão de [data] proferida nos autos nº ___, em trâmite na ___ª Vara Cível da Comarca de ___, vem interpor AGRAVO DE INSTRUMENTO, com fundamento no art. 1.015 do CPC, pelas razões a seguir.\n\nI – DA TEMPESTIVIDADE\nO presente recurso é tempestivo (art. 1.003, § 5º, CPC).\n\nII – DOS FATOS E DA DECISÃO AGRAVADA\n[Síntese]\n\nIII – DAS RAZÕES DE REFORMA\nA decisão agravada deve ser reformada porque [...]\n\nIV – DA TUTELA RECURSAL\nPresentes a probabilidade do direito e o perigo de dano, requer a concessão de efeito suspensivo (art. 1.019, I, CPC).\n\nV – DOS PEDIDOS\na) a atribuição de efeito suspensivo;\nb) o conhecimento e provimento do recurso para reformar a decisão agravada.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Embargos de Declaração — Omissão',
  'Direito Processual Civil',
  'embargos_declaracao',
  'Embargos para sanar omissão em sentença/acórdão (art. 1.022 CPC).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO\n\nAutos nº ___\n\n[Embargante], nos autos da ação em epígrafe, vem opor EMBARGOS DE DECLARAÇÃO, com fundamento no art. 1.022, II, do CPC, pelos motivos a seguir.\n\nI – DA TEMPESTIVIDADE\nO recurso é tempestivo (art. 1.023, CPC).\n\nII – DA OMISSÃO\n[Apontar com precisão o ponto omitido pela decisão]\n\nIII – DOS PEDIDOS\nRequer o acolhimento dos embargos para suprir a omissão apontada, com os efeitos infringentes cabíveis.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Réplica à Contestação',
  'Direito Processual Civil',
  'replica',
  'Manifestação da parte autora à contestação, com impugnação ponto a ponto.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO\n\nAutos nº ___\n\n[Autor], nos autos da ação em epígrafe, em atenção ao despacho de fls. ___, vem oferecer RÉPLICA à contestação apresentada, pelas razões a seguir.\n\nI – DA REJEIÇÃO DAS PRELIMINARES\n[Refutar cada preliminar suscitada pelo réu]\n\nII – DA REFUTAÇÃO DO MÉRITO\n[Impugnar fatos e teses da defesa]\n\nIII – DOS PEDIDOS\nRequer a integral procedência dos pedidos iniciais.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Cumprimento de Sentença — Quantia Certa',
  'Direito Processual Civil',
  'cumprimento_sentenca',
  'Petição de cumprimento de sentença para pagar quantia certa (art. 523 CPC).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL\n\nAutos nº ___\n\n[Exequente], nos autos da ação em epígrafe, transitada em julgado em [data], vem requerer o CUMPRIMENTO DE SENTENÇA, com fundamento no art. 523 do CPC, pelas razões a seguir.\n\nI – DA MEMÓRIA DE CÁLCULO\nValor principal da condenação: R$ ___\nCorreção monetária (IPCA) de [data] até [data]: R$ ___\nJuros de mora (1% a.m.) de [data] até [data]: R$ ___\nHonorários sucumbenciais (___% sobre o valor): R$ ___\nTotal atualizado: R$ ___\n\nII – DOS PEDIDOS\na) a intimação do executado para pagar em 15 dias, sob pena de multa de 10% e honorários de 10% (art. 523, § 1º, CPC);\nb) caso não pague, a expedição de mandado de penhora e avaliação.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Tutela de Urgência — Pedido Liminar',
  'Direito Processual Civil',
  'tutela_urgencia',
  'Modelo de pedido de tutela de urgência (art. 300 CPC).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO\n\nAutos nº ___\n\n[Requerente], vem requerer a concessão de TUTELA DE URGÊNCIA, com fundamento no art. 300 do CPC, em caráter liminar e inaudita altera parte, pelos fundamentos a seguir.\n\nI – DOS REQUISITOS\n1.1 Probabilidade do direito (fumus boni iuris). [Demonstrar a verossimilhança]\n1.2 Perigo de dano (periculum in mora). [Demonstrar a urgência]\n\nII – DA PROVIDÊNCIA REQUERIDA\n[Especificar a medida a ser deferida]\n\nIII – DOS PEDIDOS\nRequer a concessão da tutela de urgência, em caráter liminar, para que se determine [providência].\n\nNestes termos, pede deferimento.',
  true
),

-- =============== Direito do Consumidor ===============
(
  'Ação no Juizado Especial — Negativação Indevida',
  'Direito do Consumidor',
  'acao_consumidor_juizado',
  'JEC contra credor que negativou indevidamente o consumidor.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DO ___ JUIZADO ESPECIAL CÍVEL\n\n[Consumidor], vem ajuizar AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE DÉBITO C/C INDENIZAÇÃO POR DANOS MORAIS em face de [Empresa], pelas razões a seguir.\n\nI – DOS FATOS\nO autor foi surpreendido com a negativação indevida de seu nome em [data] no valor de R$ ___. Nunca contratou serviço ou produto com a ré, configurando-se nítida falha na prestação do serviço.\n\nII – DO DIREITO\nA negativação indevida configura dano moral in re ipsa (Súmula 385 STJ, a contrario sensu, quando inexistente outra negativação legítima). Aplicam-se os arts. 14 e 6º, VIII, do CDC.\n\nIII – DOS PEDIDOS\na) a inversão do ônus da prova;\nb) a declaração de inexistência do débito;\nc) a determinação para retirada da negativação em 5 dias úteis, sob multa diária;\nd) a condenação ao pagamento de indenização por danos morais no valor de R$ 10.000,00.\n\nDá-se à causa o valor de R$ ___ (até 40 SM).\n\nNestes termos, pede deferimento.',
  true
),
(
  'Reclamação ao PROCON — Defeito de Produto',
  'Direito do Consumidor',
  'reclamacao_procon',
  'Reclamação formal por defeito não solucionado em prazo legal.',
  E'AO ILMO. SR. DIRETOR DO PROCON DE ___\n\nReclamante: [qualificação completa]\nReclamada: [razão social, CNPJ, endereço]\n\nI – DO PRODUTO\nProduto: [descrição]\nDe compra: [data]\nValor: R$ ___\n\nII – DO PROBLEMA\nO produto apresentou defeito em [data]. Foram acionados os canais de atendimento da reclamada nos dias [datas], sem solução satisfatória dentro do prazo de 30 dias previsto no art. 18, § 1º, do CDC.\n\nIII – DOS PEDIDOS AO PROCON\nRequer a intervenção do PROCON para que a reclamada:\na) realize a substituição do produto por outro da mesma espécie em perfeitas condições; OU\nb) restitua imediatamente a quantia paga, monetariamente atualizada; OU\nc) conceda abatimento proporcional do preço.\n\nPede-se a aplicação das sanções administrativas previstas no art. 56 do CDC.\n\nProtesta-se por audiência conciliatória.\n\n[Local], [Data].\n[Assinatura]',
  false
),
(
  'Ação Consumerista — Plano de Saúde (Negativa de Cobertura)',
  'Direito do Consumidor',
  'peticao_inicial',
  'Inicial para obrigar plano de saúde a cobrir tratamento negado.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL\n\n[Beneficiário(a)], vem ajuizar AÇÃO DE OBRIGAÇÃO DE FAZER COM PEDIDO DE TUTELA DE URGÊNCIA em face de [Operadora do Plano de Saúde], pelos fatos a seguir.\n\nI – DOS FATOS\nO autor é beneficiário do plano de saúde da ré desde [data]. Foi diagnosticado com [doença/condição] e seu médico prescreveu [tratamento]. A ré negou cobertura sob argumento de [motivo da negativa].\n\nII – DO DIREITO\nA Súmula 102 do TJSP estabelece que “havendo expressa indicação médica, é abusiva a negativa de cobertura de custeio de tratamento sob o argumento da sua natureza experimental ou por não estar previsto no rol de procedimentos da ANS”. Aplica-se ainda o CDC, art. 51, IV, vedando cláusulas abusivas.\n\nIII – DA TUTELA DE URGÊNCIA\nPresentes os requisitos do art. 300 do CPC, requer-se liminarmente a determinação para que a ré autorize, em 48h, sob pena de multa diária, o tratamento prescrito.\n\nIV – DOS PEDIDOS\na) tutela de urgência conforme acima;\nb) confirmação da liminar em sentença;\nc) condenação por danos morais em R$ ___;\nd) inversão do ônus da prova.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  true
),

-- =============== Direito do Trabalho ===============
(
  'Reclamação Trabalhista — Verbas Rescisórias',
  'Direito do Trabalho',
  'reclamacao_trabalhista',
  'Reclamação trabalhista pleiteando verbas rescisórias não pagas.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO TRABALHO DA ___ª VARA DO TRABALHO DE ___\n\n[QUALIFICAÇÃO DO(A) RECLAMANTE], vem propor RECLAMAÇÃO TRABALHISTA em face de [QUALIFICAÇÃO DA RECLAMADA], pelos fatos a seguir.\n\nI – DO CONTRATO DE TRABALHO\nAdmitido em [data], na função de [função], com salário mensal de R$ ___ e jornada de [jornada]. Dispensado sem justa causa em [data].\n\nII – DAS VERBAS NÃO PAGAS\na) aviso prévio indenizado\nb) férias proporcionais + 1/3\nc) 13º salário proporcional\nd) FGTS + multa de 40%\ne) saldo de salário\n\nIII – DA HORA EXTRA E ADICIONAL NOTURNO\n[Quando aplicável]\n\nIV – DOS PEDIDOS\nRequer a procedência dos pedidos para condenar a Reclamada ao pagamento das verbas devidas, com juros (TR) e correção monetária (IPCA-E), bem como honorários sucumbenciais e custas processuais.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  false
),
(
  'Defesa Trabalhista — Contestação',
  'Direito do Trabalho',
  'defesa_trabalhista',
  'Defesa empresarial em ação trabalhista, com impugnação às verbas pleiteadas.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO TRABALHO\n\nAutos nº ___\n\n[Reclamada] vem apresentar DEFESA à reclamação trabalhista proposta por [Reclamante], pelos fundamentos a seguir.\n\nI – DAS PRELIMINARES\n[Inépcia, prescrição quinquenal/bienal, etc.]\n\nII – DA IMPUGNAÇÃO ÀS VERBAS\n[Refutar ponto a ponto cada verba pleiteada]\n\nIII – DOS PEDIDOS\nRequer a total improcedência dos pedidos, com condenação do reclamante em honorários sucumbenciais.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Reclamação Trabalhista — Rescisão Indireta',
  'Direito do Trabalho',
  'reclamacao_trabalhista',
  'Pedido de rescisão indireta por falta grave do empregador (art. 483 CLT).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO TRABALHO\n\n[Reclamante] vem propor RECLAMAÇÃO TRABALHISTA com pedido de RESCISÃO INDIRETA do contrato de trabalho, com fundamento no art. 483, alínea [letra], da CLT, pelos fatos a seguir.\n\nI – DO CONTRATO DE TRABALHO\n[Datas, função, salário, jornada]\n\nII – DAS FALTAS GRAVES DO EMPREGADOR\n[Descrever as condutas: atraso reiterado de salário, descumprimento de obrigações contratuais, rigor excessivo, etc.]\n\nIII – DO PEDIDO DE RESCISÃO INDIRETA E VERBAS\nRequer:\na) o reconhecimento da rescisão indireta;\nb) o pagamento das verbas como na dispensa sem justa causa (aviso prévio, 13º proporcional, férias + 1/3, FGTS + 40%, multa do art. 477 CLT, seguro-desemprego);\nc) honorários sucumbenciais.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  true
),

-- =============== Direito Penal ===============
(
  'Habeas Corpus — Liberatório',
  'Direito Penal',
  'habeas_corpus',
  'HC liberatório com pedido de liminar (art. 5º, LXVIII, CF).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___\n\n[Impetrante], vem impetrar HABEAS CORPUS, com pedido liminar, em favor de [Paciente], em face de ato coator praticado por [Autoridade Coatora], pelos fatos a seguir.\n\nI – DOS FATOS\n[Síntese da prisão e da decisão coatora]\n\nII – DO DIREITO\nAusentes os requisitos do art. 312 do CPP, a prisão preventiva configura constrangimento ilegal sanável por habeas corpus (art. 648, I, CPP).\n\nIII – DA LIMINAR\nPresentes o fumus boni iuris e o periculum libertatis, requer-se a concessão de medida liminar para que se determine a imediata expedição de alvará de soltura.\n\nIV – DOS PEDIDOS\nRequer:\na) a concessão de liminar;\nb) no mérito, a concessão da ordem para revogar a prisão preventiva.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Resposta à Acusação — Rito Comum',
  'Direito Penal',
  'resposta_acusacao',
  'Resposta à acusação após recebimento da denúncia (art. 396-A CPP).',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CRIMINAL\n\nAutos nº ___\n\n[Acusado], por sua defesa técnica, vem apresentar RESPOSTA À ACUSAÇÃO, com fundamento no art. 396-A do CPP, pelas razões a seguir.\n\nI – DAS PRELIMINARES\n[Inépcia da denúncia, ausência de justa causa, etc.]\n\nII – DAS TESES DE MÉRITO\n[Negativa de autoria, atipicidade, excludentes de ilicitude/culpabilidade]\n\nIII – DAS PROVAS\nProtesta-se pela produção de prova testemunhal (rol anexo), documental e pericial.\n\nIV – DOS PEDIDOS\nRequer:\na) a absolvição sumária (art. 397 CPP);\nb) subsidiariamente, a produção da prova requerida.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Alegações Finais — Memoriais Defensivos',
  'Direito Penal',
  'alegacoes_finais',
  'Memoriais defensivos após instrução, com pedido absolutório.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CRIMINAL\n\nAutos nº ___\n\n[Acusado], por sua defesa técnica, vem apresentar ALEGAÇÕES FINAIS POR MEMORIAIS, com fundamento no art. 403, § 3º, do CPP, pelos fundamentos a seguir.\n\nI – DA SÍNTESE DA ACUSAÇÃO\n\nII – DA ANÁLISE DA PROVA PRODUZIDA\n[Demonstrar fragilidade do conjunto probatório]\n\nIII – DAS TESES ABSOLUTÓRIAS\n[Aplicação do in dubio pro reo, atipicidade material, ausência de prova suficiente, etc.]\n\nIV – SUBSIDIARIAMENTE\nCaso superada a tese absolutória, requer-se o reconhecimento de atenuantes (art. 65 CP), aplicação da pena no mínimo legal e regime mais brando.\n\nV – DOS PEDIDOS\nRequer a absolvição com fundamento no art. 386, VII, do CPP.\n\nNestes termos, pede deferimento.',
  true
),

-- =============== Direito de Família ===============
(
  'Ação de Alimentos',
  'Direito de Família',
  'acao_alimentos',
  'Ação para fixação de alimentos com pedido de tutela de urgência.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA DE FAMÍLIA\n\n[Alimentado], representado(a) por sua genitora [nome], vem propor AÇÃO DE ALIMENTOS em face de [Alimentante], pelos fatos a seguir.\n\nI – DOS FATOS\n[Vínculo entre as partes, situação atual]\n\nII – DA TRINOMIA: NECESSIDADE × POSSIBILIDADE × PROPORCIONALIDADE\nNecessidades: [despesas mensais detalhadas].\nPossibilidades: [renda e patrimônio do alimentante].\n\nIII – DOS ALIMENTOS PROVISÓRIOS\nRequer-se, liminarmente, a fixação de alimentos provisórios em ___% do salário mínimo / dos rendimentos líquidos do alimentante (art. 4º Lei 5.478/68).\n\nIV – DOS PEDIDOS\na) a fixação de alimentos provisórios;\nb) a citação do réu;\nc) a procedência do pedido, fixando-se pensão definitiva em ___% sobre os rendimentos do alimentante.\n\nDá-se à causa o valor de 12 prestações.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Divórcio Consensual',
  'Direito de Família',
  'divorcio_consensual',
  'Petição conjunta de divórcio, com partilha amigável e guarda compartilhada.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA DE FAMÍLIA\n\n[Cônjuge A] e [Cônjuge B], casados sob o regime de [regime] em [data], vêm requerer o DIVÓRCIO CONSENSUAL, com fundamento no art. 226, § 6º, da CF, e no art. 1.580 do CC, pelas razões a seguir.\n\nI – DAS PARTES\n[Qualificação de ambos os cônjuges]\n\nII – DA UNIÃO E DA SEPARAÇÃO\n[Datas, filhos comuns]\n\nIII – DA PARTILHA\nOs bens comuns são partilhados conforme [acordo]: [detalhamento].\n\nIV – DOS FILHOS\n[Guarda compartilhada, convivência, alimentos]\n\nV – DOS PEDIDOS\nRequerem a homologação do divórcio consensual com a partilha e a regulamentação acordadas.\n\nNestes termos, pedem deferimento.',
  true
),

-- =============== Direito Administrativo ===============
(
  'Mandado de Segurança — Concurso Público',
  'Direito Administrativo',
  'mandado_seguranca',
  'MS contra ato de eliminação em concurso público.',
  E'EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ___ª VARA DA FAZENDA PÚBLICA\n\n[Impetrante], vem impetrar MANDADO DE SEGURANÇA, com pedido de liminar, em face de ato de [Autoridade Coatora], integrante do quadro da [órgão], pelos fatos a seguir.\n\nI – DOS FATOS\nO impetrante é candidato no concurso público regido pelo Edital nº ___. Foi eliminado sob o fundamento de [motivo]. Tal ato é manifestamente ilegal e fere direito líquido e certo do impetrante.\n\nII – DO DIREITO LÍQUIDO E CERTO\n[Demonstrar violação a princípios como legalidade, vinculação ao edital, razoabilidade, proporcionalidade, devido processo administrativo]\n\nIII – DA LIMINAR\nPresentes o fumus boni iuris e o periculum in mora (art. 7º, III, Lei 12.016/09), requer a concessão de liminar para que o impetrante prossiga nas fases seguintes.\n\nIV – DOS PEDIDOS\na) a concessão de liminar;\nb) a notificação da autoridade coatora;\nc) a oitiva do MP;\nd) a concessão definitiva da segurança.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
  true
),
(
  'Defesa Administrativa — Multa de Trânsito',
  'Direito Administrativo',
  'defesa_processo_administrativo',
  'Defesa prévia em auto de infração de trânsito.',
  E'ILMO. SR. DIRETOR DA [JARI / ÓRGÃO AUTUADOR]\n\nProcesso administrativo nº ___\nAuto de infração nº ___\n\n[Autuado], inconformado(a) com o auto de infração acima, vem apresentar DEFESA PRÉVIA, com fundamento no art. 281 do CTB, pelos seguintes motivos.\n\nI – DA TEMPESTIVIDADE\n\nII – DO AUTO DE INFRAÇÃO\n[Descrição do auto: infração, local, data, hora, equipamento]\n\nIII – DA NULIDADE\n[Vícios formais, ausência de aferição do equipamento, ausência de fotografia, descrição imprecisa, etc.]\n\nIV – DOS PEDIDOS\nRequer o conhecimento da defesa e o cancelamento do auto de infração.\n\nNestes termos, pede deferimento.\n\n[Local], [Data].',
  false
),

-- =============== Extrajudicial ===============
(
  'Notificação Extrajudicial — Cobrança',
  'Extrajudicial',
  'notificacao_extrajudicial',
  'Constituição em mora extrajudicial antes de ação judicial.',
  E'NOTIFICAÇÃO EXTRAJUDICIAL\n\nNotificante: [qualificação completa]\nNotificado(a): [qualificação completa]\n\nPela presente, vem o(a) Notificante, com fundamento no art. 397, parágrafo único, do Código Civil, CONSTITUIR EM MORA o(a) Notificado(a) em razão do inadimplemento da obrigação assumida em [origem da dívida — contrato, nota promissória, etc.], no valor atualizado de R$ ___, com vencimento em [data].\n\nFica V.Sa. NOTIFICADO(A) a efetuar o pagamento no prazo de 10 (dez) dias úteis a contar do recebimento desta, sob pena de adoção das medidas judiciais cabíveis para cobrança da dívida, com acréscimo de juros, correção monetária, custas e honorários advocatícios.\n\nDá-se a presente para os fins de direito.\n\n[Local], [Data].\n\n______________________________\n[Nome do Notificante]',
  false
),
(
  'Procuração Ad Judicia',
  'Extrajudicial',
  'procuracao',
  'Procuração para atuação em processos judiciais e administrativos.',
  E'PROCURAÇÃO AD JUDICIA ET EXTRA\n\nOutorgante: [qualificação completa, CPF, RG, estado civil, profissão, endereço]\n\nOutorgado(s): [Nome do(a) Advogado(a) ou Escritório], OAB/__ nº ___, com escritório em [endereço].\n\nPelo presente instrumento particular de procuração, o(a) Outorgante nomeia e constitui seu(sua) bastante procurador(a) o(a) Outorgado(a), a quem confere os mais amplos poderes da cláusula AD JUDICIA ET EXTRA, para o foro em geral, podendo atuar em juízo, em qualquer instância ou tribunal, bem como em órgãos da administração pública direta e indireta, podendo propor contra quem de direito as ações cabíveis e defendê-lo(a) nas contrárias, requerer, alegar, juntar documentos, ouvir intimações, recorrer, desistir, transigir, firmar acordos, dar e receber quitação, levantar valores, substabelecer com ou sem reservas, e cumprir tudo o que for necessário ao bom desempenho do presente mandato.\n\n[Local], [Data].\n\n______________________________\n[Nome do(a) Outorgante]',
  false
),
(
  'Contrato de Prestação de Serviços',
  'Extrajudicial',
  'contrato_servicos',
  'Minuta padrão de contrato de prestação de serviços profissionais.',
  E'CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: [qualificação completa]\nCONTRATADA: [qualificação completa]\n\nAs partes acima identificadas têm entre si justo e contratado o presente instrumento, regido pelas cláusulas seguintes.\n\nCLÁUSULA 1ª – OBJETO\nA CONTRATADA prestará à CONTRATANTE os seguintes serviços: [descrição detalhada].\n\nCLÁUSULA 2ª – PRAZO E LOCAL\nO contrato vigorará pelo prazo de [prazo], com início em [data].\n\nCLÁUSULA 3ª – REMUNERAÇÃO\nA CONTRATANTE pagará à CONTRATADA o valor de R$ ___, [forma de pagamento: à vista / parcelado].\n\nCLÁUSULA 4ª – OBRIGAÇÕES\nDa CONTRATADA: [obrigações].\nDa CONTRATANTE: [obrigações].\n\nCLÁUSULA 5ª – RESCISÃO\nO contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de [prazo] dias, sem ônus.\n\nCLÁUSULA 6ª – FORO\nFica eleito o foro da Comarca de [cidade/UF] para dirimir quaisquer controvérsias.\n\nE, por estarem assim justos e contratados, assinam o presente em 2 (duas) vias de igual teor.\n\n[Local], [Data].\n\n______________________________\nCONTRATANTE\n\n______________________________\nCONTRATADA\n\nTestemunhas:\n1) ___\n2) ___',
  true
),
(
  'NDA — Acordo de Confidencialidade',
  'Extrajudicial',
  'contrato_nda',
  'Acordo de confidencialidade bilateral (NDA).',
  E'ACORDO DE CONFIDENCIALIDADE (NDA)\n\nPARTE A: [qualificação]\nPARTE B: [qualificação]\n\nAs partes acordam o seguinte:\n\n1. OBJETO\nAs partes pretendem trocar informações confidenciais relacionadas a [contexto/projeto], e por este instrumento se comprometem com a confidencialidade dessas informações.\n\n2. INFORMAÇÕES CONFIDENCIAIS\nConsideram-se confidenciais todas as informações, técnicas, comerciais, financeiras, estratégicas ou de qualquer natureza, marcadas ou não como tal, reveladas no contexto da relação.\n\n3. OBRIGAÇÕES\nCada parte se compromete a:\n(i) manter as informações em sigilo;\n(ii) usá-las apenas para os fins do projeto;\n(iii) não divulgar a terceiros sem autorização escrita.\n\n4. PRAZO\nA obrigação de confidencialidade vigora por 5 (cinco) anos a contar desta data.\n\n5. PENALIDADE\nO descumprimento sujeita a parte infratora a multa de R$ ___ , além de perdas e danos.\n\n6. FORO\nFica eleito o foro da Comarca de [cidade/UF].\n\n[Local], [Data].\n\n______________________________\nPARTE A\n\n______________________________\nPARTE B',
  true
);
