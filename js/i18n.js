'use strict';

// ── Bilingual toggle (PT-BR ⇄ EN) ────────────────────────────────────────────
// HTML default = PT-BR. Translation modes (priority order):
//   1. data-en          — English plain text (overrides dictionary)
//   2. data-en-html     — English HTML (for <br>, <em>, etc.)
//   3. data-en-attr     — JSON map of attributes to translate (e.g. placeholder)
//   4. Auto dictionary  — Any leaf text element whose trimmed text appears as a
//                         key in I18N_DICT will be auto-translated.
//
// PT counterparts are cached on first run as data-pt / data-pt-html /
// data-pt-attr / data-i18n-pt so toggling back never loses information.
// ────────────────────────────────────────────────────────────────────────────
(function initI18n() {
  const KEY = 'orizia-lang';
  const root = document.documentElement;

  // PT → EN dictionary for automatic page-wide translation.
  const I18N_DICT = {
    // Nav / common
    'Início': 'Home',
    'Capacidades': 'Capabilities',
    'Score': 'Score',
    'Relatório': 'Report',
    'Contato': 'Contact',
    'Consulting': 'Consulting',
    'Iniciar conversa': 'Start a conversation',
    'Nossas capacidades': 'Our capabilities',

    // Eyebrows / labels
    'O que fazemos': 'What we do',
    'Nosso processo': 'Our process',
    'O desafio': 'The challenge',
    'Pronto para começar?': 'Ready to start?',
    'Relatório de Mercado': 'Market Report',

    // Buttons / CTAs
    'Começar': 'Get started',
    'Explorar o Score': 'Explore the Score',
    'Solicitar acesso': 'Request access',
    'Solicitar relatório': 'Request the report',
    'Solicitar Score': 'Request the Score',
    'Entrar em contato': 'Get in touch',
    'Enviar mensagem': 'Send message',
    'Enviar uma mensagem': 'Send a message',
    'Falar com a equipe': 'Talk to the team',
    'Explorar todas as capacidades': 'Explore all capabilities',
    'Agendar uma conversa completa →': 'Book a full conversation →',
    'Voltar para o início': 'Back to home',
    'ou': 'or',

    // Page hero / common
    'Nossas capacidades.': 'Our capabilities.',
    'Seis frameworks proprietários, cada um voltado para uma dimensão específica do desafio de inteligência em seguros embarcados. Juntos, formam a camada analítica mais completa disponível para o mercado brasileiro.':
      'Six proprietary frameworks, each designed for a specific dimension of the embedded insurance intelligence challenge. Together, they form the most complete analytical layer available for the Brazilian market.',

    // Capabilities — taglines
    'Inteligência operacional completa para carteiras de seguros embarcados':
      'Complete operational intelligence for embedded insurance portfolios',
    'Inteligência preditiva de churn para seguros embarcados':
      'Predictive churn intelligence for embedded insurance',
    'Inteligência de conversão em cada canal embarcado':
      'Conversion intelligence across every embedded channel',
    'Monitoramento contínuo com alertas operacionais inteligentes':
      'Continuous monitoring with intelligent operational alerts',
    'Um único número composto para toda a operação embarcada':
      'A single composite number for your entire embedded operation',
    'Construindo a infraestrutura analítica para independência duradoura':
      'Building the analytical infrastructure for lasting independence',

    // Capabilities — paragraphs (Diagnose)
    'A maior parte das operações de seguro embarcado acumula anos de dados sem nunca desenvolver uma visão coerente do que esses dados revelam. O Orizia Diagnose é o ponto de partida — uma auditoria rigorosa que mapeia cada dimensão do desempenho da sua carteira contra benchmarks internos, normas do setor e as dinâmicas específicas do seu canal de distribuição.':
      "Most embedded insurance operations accumulate years of data without ever developing a coherent picture of what that data reveals. Orizia Diagnose is the starting point — a rigorous audit that maps every dimension of your portfolio's performance against internal benchmarks, sector norms, and the specific dynamics of your distribution channel.",
    'Analisamos padrões de cancelamento, taxas de adesão por segmento, frequência e severidade de sinistros, adequação de prêmios e postura de compliance regulatório. O resultado não é um relatório — é um mapa de decisões, estruturado em torno dos pontos de alavancagem específicos onde sua operação pode melhorar mais rápido.':
      'We analyze cancellation patterns, adhesion rates by segment, claim frequency and severity, premium adequacy, and regulatory compliance posture. The output is not a report — it is a decision map, structured around the specific leverage points where your operation can improve most quickly.',
    'Entregue ao longo de quatro semanas, o engajamento Diagnose produz uma matriz de ações priorizada, uma comparação de benchmark com o setor e uma baseline clara contra a qual todo o desempenho futuro será medido.':
      'Delivered over four weeks, the Diagnose engagement produces a prioritized action matrix, a benchmark comparison against the sector, and a clear baseline against which all future performance will be measured.',
    'Auditoria completa da performance da carteira em 18 dimensões':
      'Complete portfolio performance audit across 18 dimensions',
    'Comparação de benchmark com o setor e análise de gaps':
      'Sector benchmark comparison and gap analysis',
    'Matriz de ações priorizada com impacto projetado':
      'Prioritized action matrix with projected impact',
    'Avaliação de prontidão da infraestrutura de dados':
      'Data infrastructure readiness assessment',
    'Apresentação executiva e sessão de trabalho':
      'Executive presentation and working session',
    'Clareza sobre as 3 principais alavancas de melhoria em até 30 dias do início do engajamento':
      'Clarity on the top 3 improvement levers within 30 days of engagement',

    // Capabilities — Retain
    'Churn é o problema mais custoso e mais prevenível dos seguros embarcados. O Orizia Retain é um modelo de machine learning treinado em dados comportamentais brasileiros de seguros embarcados, calibrado para prever quais segurados têm maior probabilidade de cancelar nos próximos 30, 60 e 90 dias — e por quê.':
      'Churn is the most costly and most preventable problem in embedded insurance. Orizia Retain is a machine-learning model trained on Brazilian embedded insurance behavioral data, calibrated to predict which policyholders are most likely to cancel in the next 30, 60, and 90 days — and why.',
    'Diferente de modelos genéricos de propensão, o Retain é construído para as dinâmicas específicas dos canais embarcados: a relação entre o engajamento da plataforma host e o comportamento do seguro, a sazonalidade do cancelamento por segmento e o papel da experiência de sinistro na retenção futura.':
      "Unlike generic propensity models, Retain is built for the specific dynamics of embedded channels: the relationship between the host platform's engagement and insurance behavior, the seasonality of cancellation by segment, and the role of claim experience in future retention.",
    'O modelo alimenta diretamente a lógica de campanhas de retenção, permitindo que sua equipe atue no momento certo, pelo canal certo, com a mensagem certa — antes que a decisão de cancelamento seja tomada.':
      'The model feeds directly into retention campaign logic, allowing your team to intervene at the right moment, through the right channel, with the right message — before the cancellation decision is made.',
    'Modelo de propensão a churn com horizontes de 30/60/90 dias':
      'Churn propensity model with 30/60/90-day horizons',
    'Painel de estratificação de risco por segmento':
      'Segment-level risk stratification dashboard',
    'Playbook de intervenção em retenção':
      'Retention intervention playbook',
    'Recalibração mensal do modelo':
      'Monthly model recalibration',
    'Integração com CRM e plataformas de comunicação':
      'Integration with CRM and communication platforms',
    'Redução de 15–30% no churn de apólices em até 90 dias da ativação do modelo':
      '15–30% reduction in policy churn within 90 days of model activation',

    // Capabilities — Convert
    'Taxas de adesão em seguros embarcados variam drasticamente entre canais, momentos e perfis de cliente — frequentemente por um fator de três a cinco. O Orizia Convert é a camada analítica que mostra exatamente por que isso acontece e o que fazer a respeito.':
      'Adhesion rates in embedded insurance vary dramatically across channels, moments, and customer profiles — often by a factor of three to five. Orizia Convert is the analytical layer that tells you exactly why, and what to do about it.',
    'Mapeamos todo o funil de conversão da exposição à oferta até o primeiro pagamento de prêmio, identificando pontos de atrito, sensibilidade a preço e sinais comportamentais que preveem a adesão. O resultado é um playbook de conversão específico para cada canal — não boas práticas genéricas, mas evidência dos seus próprios dados.':
      'We map the full conversion funnel from offer exposure to first premium payment, identifying friction points, pricing sensitivity, and behavioral signals that predict adhesion. The result is a conversion playbook specific to each channel — not generic best practices, but evidence from your own data.',
    'O Convert funciona melhor como parceria contínua, com atualizações mensais do modelo conforme novos dados de oferta entram e o comportamento do canal evolui com a base de usuários da plataforma.':
      "Convert works best as a continuous partnership, with model updates monthly as new offer data flows in and channel behavior evolves with the platform's user base.",
    'Mapeamento do funil de conversão e modelo de atribuição':
      'Conversion funnel mapping and attribution model',
    'Benchmark de adesão por canal e caminho de otimização':
      'Channel-level adhesion benchmark and optimization path',
    'Análise de sensibilidade a preço por segmento e momento':
      'Pricing sensitivity analysis by segment and moment',
    'Framework de teste A/B para mensagem e timing da oferta':
      'A/B test framework for offer messaging and timing',
    'Relatório mensal de desempenho de conversão':
      'Monthly conversion performance report',
    'Aumento de 12–22% na conversão de ofertas embarcadas em um trimestre':
      '12–22% increase in embedded offer conversion within one quarter',

    // Capabilities — Pulse
    'Operações de seguro podem mudar drasticamente em semanas. Uma mudança na UX da plataforma host, um sinal regulatório, um evento macro em um segmento-chave — esses fatores criam ondas nos dados da sua carteira que, se detectados cedo, podem ser gerenciados. Se detectados tarde, viram crises.':
      'Insurance operations can shift dramatically in weeks. A change in the host platform\'s UX, a regulatory signal, a macro event in a key segment — these create ripples in your portfolio data that, if caught early, can be managed. If caught late, they become crises.',
    'O Orizia Pulse monitora sua operação embarcada continuamente, acompanhando os principais indicadores de desempenho e alertando sua equipe quando aparecem anomalias — antes que se tornem visíveis em relatórios trimestrais.':
      'Orizia Pulse monitors your embedded operation on a continuous basis, tracking the key performance indicators that matter most and alerting your team when anomalies appear — before they become visible in quarterly reports.',
    'Toda semana você recebe um Pulse brief: um resumo de uma página do sinal mais importante nos dados da sua carteira, com indicação clara se requer ação imediata ou monitoramento contínuo.':
      'Each week, you receive a Pulse brief: a one-page summary of the most important signal in your portfolio data, with a clear indication of whether it requires immediate action or continued monitoring.',
    'Pulse brief semanal com identificação do sinal prioritário':
      'Weekly Pulse brief with priority signal identification',
    'Detecção de anomalias em tempo real em 24 KPIs':
      'Real-time anomaly detection across 24 KPIs',
    'Análise mensal de tendências e alertas prospectivos':
      'Monthly trend analysis and forward-looking alerts',
    'Monitoramento regulatório de sinais da SUSEP e BACEN':
      'Regulatory monitoring for SUSEP and BACEN signals',
    'Analista dedicado para situações urgentes':
      'Dedicated analyst contact for urgent situations',
    'Detecção de anomalias operacionais 3,4 semanas antes, em média':
      'Average of 3.4 weeks earlier detection of operational anomalies',

    // Capabilities — Score
    'Equipes executivas precisam de um sinal sobre o qual possam agir rapidamente. O Orizia Score é esse sinal — um indicador composto mensal, pontuado de 0 a 100, que sintetiza controle de churn, performance de adesão, fit produto-mercado e risco da carteira em um único número interpretável.':
      'Executive teams need a signal they can act on quickly. The Orizia Score is that signal — a monthly composite indicator, scored from 0 to 100, that synthesizes churn control, adhesion performance, product-market fit, and portfolio risk into a single, interpretable number.',
    'Diferente de dashboards internos de KPIs, o Score é calibrado contra o setor — ou seja, um Score de 74 não descreve só a sua operação, ele a posiciona no contexto do mercado. Acima da média setorial de 62 é bom. Acima de 80 é excepcional.':
      "Unlike internal KPI dashboards, the Score is calibrated against the sector — meaning a Score of 74 doesn't just describe your operation, it places it in the context of the market. Above the sector average of 62 is good. Above 80 is exceptional.",
    'O Score é entregue mensalmente com um brief de duas páginas explicando o que mudou, por quê e quais ações são recomendadas para melhorar no próximo período.':
      'The Score is delivered monthly with a two-page brief explaining what changed, why, and what actions are recommended to improve it in the following period.',
    'Score composto mensal com quatro subindicadores':
      'Monthly composite Score with four sub-indicators',
    'Comparação de benchmark com o setor':
      'Sector benchmark comparison',
    'Score brief com recomendações de ação':
      'Score brief with action recommendations',
    'Tendência histórica de 12 meses e projeção':
      '12-month historical trend and projection',
    'Resumo executivo pronto para o board':
      'Board-ready executive summary',
    'Melhoria média do Score de 8–14 pontos em 6 meses de engajamento':
      'Average Score improvement of 8–14 points within 6 months of engagement',

    // Capabilities — Intelligence
    'As operações de seguro mais ambiciosas não querem só insights — querem a capacidade de gerá-los de forma independente. O Orizia Intelligence é nossa trilha de infraestrutura: um programa estruturado para construir a capacidade analítica da sua equipe do zero.':
      "The most ambitious insurance operations don't just want insights — they want the capability to generate them independently. Orizia Intelligence is our infrastructure track: a structured program to build your team's analytical capacity from the ground up.",
    'Desenhamos e implementamos a arquitetura de dados, definimos o framework de KPIs, construímos os dashboards internos e treinamos seus analistas para operar a camada de inteligência sem dependência externa. O objetivo não é engajamento perpétuo — é sua equipe rodando tão bem quanto a nossa.':
      'We design and implement the data architecture, define the KPI framework, build the internal dashboards, and train your analysts to operate the intelligence layer without external dependency. The goal is not perpetual engagement — it is your team running as well as ours.',
    'Engajamentos de Intelligence duram 6–12 meses e são estruturados em três fases: infraestrutura, transferência de capacidade e operação independente. Ao final, você é dono dos modelos, da arquitetura e da metodologia.':
      'Intelligence engagements run 6–12 months and are structured in three phases: infrastructure, capability transfer, and independent operation. At the end, you own the models, the architecture, and the methodology.',
    'Arquitetura e implementação do data warehouse':
      'Data warehouse architecture and implementation',
    'Framework de KPIs e biblioteca de dashboards':
      'KPI framework and dashboard library',
    'Programa de treinamento da equipe analítica':
      'Analytical team training program',
    'Transferência de metodologia e propriedade dos modelos':
      'Methodology transfer and model ownership',
    'Independência operacional total ao fim do programa':
      'Full operational independence at program completion',
    'Autonomia analítica completa em 6–12 meses, sem dependência externa contínua':
      'Complete analytical autonomy within 6–12 months, with no continued external dependency',

    'Entregas': 'Deliverables',
    'Resultado esperado': 'Expected outcome',

    // Score page
    'O Score': 'The Score',
    'Orizia Score.': 'Orizia Score.',
    'Um indicador composto, atualizado mensalmente, que sintetiza a saúde de toda a sua operação de seguros embarcados em um único número entre 0 e 100.':
      'A composite indicator, updated monthly, that synthesizes the health of your entire embedded insurance operation into a single number between 0 and 100.',
    'Composição do Score': 'Score composition',
    'Como o Score é construído': 'How the Score is built',
    'Metodologia': 'Methodology',
    'Benchmark do setor': 'Sector benchmark',
    'Solicite seu Score': 'Request your Score',
    'O seu número.': 'Your number.',
    'Solicite uma demonstração e veja o que o Orizia Score revela sobre a sua operação.':
      'Request a demo and see what the Orizia Score reveals about your operation.',

    // Report page
    'O Relatório': 'The Report',
    'Orizia Market Report.': 'Orizia Market Report.',
    'Inteligência de benchmark mensal para o setor de seguros embarcados no Brasil — churn por segmento, adesão por canal, sinais regulatórios e o score do setor.':
      'Monthly benchmark intelligence for the embedded insurance sector in Brazil — churn by segment, adhesion by channel, regulatory signals, and the sector score.',
    'O que está no relatório': "What's inside the report",
    'Estrutura da edição': 'Edition structure',
    'Edição prévia': 'Preview edition',
    'Receba a próxima edição': 'Receive the next edition',
    'Acesso restrito a operadores qualificados.': 'Access restricted to qualified operators.',
    'Pré-visualização': 'Preview',
    'Próxima edição': 'Next edition',

    // Contact page
    'Entre em contato': 'Get in touch',
    'Não fazemos calls de descoberta para vender. Fazemos para entender. Se não conseguirmos agregar valor real à sua operação em 90 dias, dizemos isso antes do projeto começar.':
      "We don't do discovery calls to sell. We do them to understand. If we can't add meaningful value to your operation in 90 days, we'll tell you before the engagement starts.",
    'E-mail': 'Email',
    'Localização': 'Location',
    'São Paulo & Remoto': 'São Paulo & Remote',
    'Tempo de resposta': 'Response time',
    'Em até 24 horas': 'Within 24 hours',
    '— Princípio fundador da Orizia': '— Orizia founding principle',
    'Conte-nos sobre seu desafio.': 'Tell us about your challenge.',
    'Nome completo *': 'Full name *',
    'Empresa *': 'Company *',
    'Cargo *': 'Role *',
    'Telefone (opcional)': 'Phone (optional)',
    'E-mail corporativo *': 'Corporate email *',
    'Qual é o seu principal desafio?': 'What is your main challenge?',
    'Tipo de serviço': 'Type of service',
    'Diagnóstico': 'Diagnostic',
    'Parceria contínua': 'Ongoing partnership',
    'Outro': 'Other',
    'Este campo é obrigatório.': 'This field is required.',
    'Informe um e-mail válido.': 'Please enter a valid email address.',
    'Mensagem recebida.': 'Message received.',
    'Entraremos em contato em até 24 horas. Enquanto isso, você pode revisar nossas capacidades ou a metodologia do Orizia Score.':
      "We'll be in touch within 24 hours. In the meantime, you may find it useful to review our capabilities or the Orizia Score methodology.",
    'Ou comece com uma conversa rápida': 'Or start with a quick conversation',
    'O Score': 'The Score'
  };

  const AUTO_SELECTOR =
    'h1, h2, h3, h4, h5, h6, p, span, a, button, li, label, em, strong, ' +
    'td, th, blockquote, cite, summary, dt, dd, figcaption, option';

  function cacheAttrOriginal(el) {
    if (el.hasAttribute('data-en-html') && !el.hasAttribute('data-pt-html')) {
      el.setAttribute('data-pt-html', el.innerHTML);
    } else if (el.hasAttribute('data-en') && !el.hasAttribute('data-pt')) {
      el.setAttribute('data-pt', el.textContent);
    }
    if (el.hasAttribute('data-en-attr') && !el.hasAttribute('data-pt-attr')) {
      try {
        const map = JSON.parse(el.getAttribute('data-en-attr'));
        const ptMap = {};
        Object.keys(map).forEach(a => { ptMap[a] = el.getAttribute(a) || ''; });
        el.setAttribute('data-pt-attr', JSON.stringify(ptMap));
      } catch (_) {}
    }
  }

  function applyExplicit(lang) {
    const els = document.querySelectorAll('[data-en],[data-en-html],[data-en-attr]');
    els.forEach(el => {
      cacheAttrOriginal(el);
      if (el.hasAttribute('data-en-html')) {
        const html = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-pt-html');
        if (html != null) el.innerHTML = html;
      } else if (el.hasAttribute('data-en')) {
        const txt = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
        if (txt != null) el.textContent = txt;
      }
      if (el.hasAttribute('data-en-attr')) {
        try {
          const enMap = JSON.parse(el.getAttribute('data-en-attr'));
          const ptMap = JSON.parse(el.getAttribute('data-pt-attr') || '{}');
          const target = lang === 'en' ? enMap : ptMap;
          Object.keys(target).forEach(a => el.setAttribute(a, target[a]));
        } catch (_) {}
      }
    });
  }

  function applyAuto(lang) {
    const els = document.querySelectorAll(AUTO_SELECTOR);
    els.forEach(el => {
      if (el.hasAttribute('data-en') || el.hasAttribute('data-en-html')) return;
      if (el.closest('[data-lang-toggle]')) return;
      if (el.children.length > 0) return;
      const original = el.textContent;
      const trimmed = original.trim();
      if (!trimmed) return;

      if (!el.hasAttribute('data-i18n-pt')) {
        if (I18N_DICT[trimmed] !== undefined) {
          el.setAttribute('data-i18n-pt', original);
        } else {
          return;
        }
      }
      const ptStored = el.getAttribute('data-i18n-pt');
      const ptKey = ptStored.trim();
      const enValue = I18N_DICT[ptKey];
      if (enValue === undefined) return;

      el.textContent = lang === 'en' ? ptStored.replace(ptKey, enValue) : ptStored;
    });
  }

  function apply(lang) {
    root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
    applyExplicit(lang);
    applyAuto(lang);

    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      const ptLabel = btn.querySelector('[data-lang-pt]');
      const enLabel = btn.querySelector('[data-lang-en]');
      if (ptLabel && enLabel) {
        ptLabel.classList.toggle('active', lang === 'pt');
        enLabel.classList.toggle('active', lang === 'en');
      }
      btn.setAttribute('aria-label', lang === 'en' ? 'Switch language to Portuguese' : 'Trocar idioma para inglês');
    });
  }

  function getLang() {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'pt') return saved;
    return 'pt';
  }
  function setLang(lang) {
    localStorage.setItem(KEY, lang);
    apply(lang);
  }

  apply(getLang());

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-lang-toggle]');
    if (!t) return;
    e.preventDefault();
    setLang(getLang() === 'pt' ? 'en' : 'pt');
  });

  window.__OriziaI18N = { apply, setLang, getLang, dict: I18N_DICT };
})();
