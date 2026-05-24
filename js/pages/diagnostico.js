'use strict';

const API_BASE = 'https://api.orizia.com.br';

const CSV_EXAMPLES = {
  carteira: {
    title: 'carteira.csv',
    subtitle: 'Apólices ativas e canceladas da carteira.',
    code: `canal,produto,data_emissao,status,premio
App,Seguro Celular,2024-01-15,ativa,29.90
App,Seguro Celular,2024-02-03,cancelada,29.90
Internet Banking,Vida Embarcado,2024-01-20,ativa,45.00
PDV,Proteção Equipamento,2024-03-10,ativa,19.90
App,Seguro Celular,2024-03-22,ativa,29.90
Internet Banking,Vida Embarcado,2024-04-05,cancelada,45.00
PDV,Seguro Residencial,2024-04-18,ativa,35.50
App,Proteção Digital,2024-05-01,ativa,22.90
API B2B,Seguro Celular,2024-05-14,ativa,29.90
Internet Banking,Vida Embarcado,2024-06-02,ativa,45.00`
  },
  cancelamentos: {
    title: 'cancelamentos.csv',
    subtitle: 'Cancelamentos dos últimos 12 meses com motivo e canal.',
    code: `data,motivo,canal,tempo_vida_dias
2024-03-15,inadimplencia,App,45
2024-04-02,solicitacao_cliente,App,12
2024-04-18,inadimplencia,Internet Banking,89
2024-05-03,produto_nao_atende,PDV,34
2024-05-20,mudanca_plano,App,156
2024-06-08,inadimplencia,Internet Banking,23
2024-06-25,solicitacao_cliente,API B2B,67
2024-07-11,produto_nao_atende,App,8
2024-07-28,inadimplencia,PDV,112
2024-08-14,solicitacao_cliente,Internet Banking,245`
  },
  sinistros: {
    title: 'sinistros.csv',
    subtitle: 'Sinistros dos últimos 12 meses.',
    code: `data_aviso,tipo,valor_pago,status
2024-02-10,roubo,1200.00,pago
2024-02-28,quebra_acidental,350.00,pago
2024-03-15,roubo,1200.00,negado
2024-04-03,danos_eletricos,280.00,pago
2024-04-19,quebra_acidental,350.00,em_analise
2024-05-07,roubo,1200.00,pago
2024-06-12,danos_eletricos,180.00,pago
2024-07-01,quebra_acidental,350.00,pago
2024-08-15,roubo,1200.00,em_analise
2024-09-04,danos_eletricos,220.00,pago`
  },
  adesoes: {
    title: 'adesoes.csv',
    subtitle: 'Ofertas vs. adesões por canal e mês.',
    code: `mes,canal,exposicoes,adesoes
2024-01,App,8420,2105
2024-01,Internet Banking,3200,896
2024-01,PDV,1540,416
2024-02,App,8910,2005
2024-02,Internet Banking,3380,844
2024-02,PDV,1620,389
2024-03,App,9250,2312
2024-03,Internet Banking,3490,906
2024-03,PDV,1700,442
2024-04,App,9640,2218
2024-04,Internet Banking,3610,867
2024-04,PDV,1780,427`
  }
};

(function DiagnosticoForm() {
  let currentStep = 1;
  const TOTAL_STEPS = 3;

  const form        = document.getElementById('diag-form');
  const successEl   = document.getElementById('diag-success');
  const errorBanner = document.getElementById('diag-error-banner');
  const errorText   = document.getElementById('diag-error-text');

  if (!form) return;

  // ── Step navigation ──────────────────────────────────────────
  function getStepEl(n) {
    return form.querySelector(`[data-form-step="${n}"]`);
  }

  function getStepIndicator(n) {
    return document.querySelector(`.diag-step[data-step="${n}"]`);
  }

  function goToStep(n) {
    const current = getStepEl(currentStep);
    const next    = getStepEl(n);
    if (!next) return;

    // Update stepper indicator
    const currentInd = getStepIndicator(currentStep);
    const nextInd    = getStepIndicator(n);

    if (currentInd) {
      currentInd.classList.remove('active');
      if (n > currentStep) currentInd.classList.add('completed');
    }
    if (nextInd) {
      nextInd.classList.remove('completed');
      nextInd.classList.add('active');
    }

    current.hidden = true;
    next.hidden = false;

    if (n === TOTAL_STEPS) buildSummary();

    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Next buttons ─────────────────────────────────────────────
  form.addEventListener('click', e => {
    const nextBtn = e.target.closest('.diag-next');
    const backBtn = e.target.closest('.diag-back');

    if (nextBtn) {
      if (currentStep === 1 && !validateStep1()) return;
      if (currentStep === 2 && !validateStep2()) return;
      goToStep(currentStep + 1);
    }

    if (backBtn) {
      const prevInd = getStepIndicator(currentStep - 1);
      const currInd = getStepIndicator(currentStep);
      if (currInd) { currInd.classList.remove('active'); currInd.classList.add(''); }
      if (prevInd) { prevInd.classList.remove('completed'); prevInd.classList.add('active'); }

      const current = getStepEl(currentStep);
      const prev    = getStepEl(currentStep - 1);
      current.hidden = true;
      prev.hidden = false;
      currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // ── Step 1 validation ────────────────────────────────────────
  function validateStep1() {
    const step = getStepEl(1);
    const required = step.querySelectorAll('[required]');
    let ok = true;

    required.forEach(field => {
      const label = field.closest('.form-label');
      if (!field.value.trim()) {
        field.classList.add('invalid');
        if (label) label.classList.add('has-error');
        ok = false;
      } else {
        field.classList.remove('invalid');
        if (label) label.classList.remove('has-error');
      }
    });

    const emailField = step.querySelector('[name="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('invalid');
      ok = false;
    }

    if (!ok) {
      const first = step.querySelector('.invalid');
      if (first) first.focus();
    }
    return ok;
  }

  // ── Step 2 validation ────────────────────────────────────────
  function getUploadedFiles() {
    const fileNames = ['carteira', 'cancelamentos', 'sinistros', 'adesoes'];
    return fileNames.filter(name => {
      const input = document.getElementById(`file-${name}`);
      return input && input.files && input.files.length > 0;
    });
  }

  function validateStep2() {
    const uploaded = getUploadedFiles();
    const notice = document.getElementById('upload-min-msg');
    if (uploaded.length < 2) {
      notice.hidden = false;
      return false;
    }
    notice.hidden = true;
    return true;
  }

  // ── File upload UX ───────────────────────────────────────────
  ['carteira', 'cancelamentos', 'sinistros', 'adesoes'].forEach(name => {
    const input     = document.getElementById(`file-${name}`);
    const dropzone  = input ? input.closest('.upload-dropzone') : null;
    const card      = dropzone ? dropzone.closest('.upload-card') : null;
    const fileNameEl = card ? card.querySelector('.upload-dropzone__file-name') : null;

    if (!input || !dropzone) return;

    input.addEventListener('change', () => handleFileChange(input, card, fileNameEl));

    // Drag and drop
    dropzone.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        const dt = new DataTransfer();
        dt.items.add(e.dataTransfer.files[0]);
        input.files = dt.files;
        handleFileChange(input, card, fileNameEl);
      }
    });
  });

  function handleFileChange(input, card, fileNameEl) {
    const file = input.files[0];
    if (!file) return;

    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      showError(`O arquivo "${file.name}" excede ${maxMB} MB. Por favor, reduza o tamanho.`);
      input.value = '';
      return;
    }

    if (fileNameEl) {
      const inner = fileNameEl.querySelector('p') || document.createElement('p');
      inner.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
      if (!fileNameEl.contains(inner)) fileNameEl.appendChild(inner);

      let removeBtn = fileNameEl.querySelector('.remove-file');
      if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-file';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', 'Remover arquivo');
        fileNameEl.appendChild(removeBtn);
      }

      removeBtn.onclick = () => {
        input.value = '';
        fileNameEl.hidden = true;
        if (card) card.classList.remove('has-file');
      };

      fileNameEl.hidden = false;
    }

    if (card) card.classList.add('has-file');
    document.getElementById('upload-min-msg').hidden = true;
  }

  // ── CSV Example modals ───────────────────────────────────────
  const overlay      = document.getElementById('csv-modal-overlay');
  const closeBtn     = document.getElementById('csv-modal-close');
  const modalTitle   = document.getElementById('csv-modal-title');
  const modalSub     = document.getElementById('csv-modal-subtitle');
  const modalCode    = document.getElementById('csv-modal-code');

  form.addEventListener('click', e => {
    const exBtn = e.target.closest('.upload-example-btn');
    if (!exBtn) return;
    const file = exBtn.dataset.file;
    const ex   = CSV_EXAMPLES[file];
    if (!ex || !overlay) return;

    modalTitle.textContent = ex.title;
    modalSub.textContent   = ex.subtitle;
    modalCode.textContent  = ex.code;
    overlay.hidden = false;
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) closeModal();
  });

  function closeModal() {
    if (overlay) overlay.hidden = true;
  }

  // ── Summary (step 3) ─────────────────────────────────────────
  function buildSummary() {
    const summaryId = document.getElementById('summary-identification');
    const summaryFiles = document.getElementById('summary-files');
    if (!summaryId || !summaryFiles) return;

    const labels = {
      nome: 'Nome', email: 'E-mail', whatsapp: 'WhatsApp',
      empresa: 'Empresa', cargo: 'Cargo',
      segmento: 'Segmento', canal: 'Canal'
    };

    summaryId.innerHTML = '';
    Object.entries(labels).forEach(([key, label]) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (!field) return;
      const val = field.value || '—';
      summaryId.innerHTML += `
        <div class="diag-summary__field">
          <span class="diag-summary__field-key">${label}</span>
          <span class="diag-summary__field-val">${escapeHtml(val)}</span>
        </div>`;
    });

    summaryFiles.innerHTML = '';
    const uploaded = getUploadedFiles();
    if (uploaded.length === 0) {
      summaryFiles.innerHTML = '<p style="font-size:13px;color:var(--text-muted);">Nenhum arquivo selecionado.</p>';
    } else {
      uploaded.forEach(name => {
        const input = document.getElementById(`file-${name}`);
        const file  = input && input.files[0];
        summaryFiles.innerHTML += `
          <div class="diag-summary__file-chip">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="12" height="12" rx="1" stroke="#6B91C1" stroke-width="1.2"/>
              <path d="M4 7H10M4 5H8M4 9H7" stroke="#6B91C1" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            ${escapeHtml(name)}.csv${file ? ` · ${(file.size/1024).toFixed(0)} KB` : ''}
          </div>`;
      });
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Form submission ──────────────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const honeypot = form.querySelector('[name="_honey"]');
    if (honeypot && honeypot.value) return;

    const nda = document.getElementById('aceite-nda');
    if (!nda || !nda.checked) {
      showError('Por favor, aceite o NDA e o Acordo de Tratamento de Dados para continuar.');
      return;
    }

    const submitBtn   = document.getElementById('diag-submit');
    const submitLabel = submitBtn.querySelector('.diag-submit__label');
    const submitLoad  = submitBtn.querySelector('.diag-submit__loading');

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.hidden = true;
    if (submitLoad)  submitLoad.hidden  = false;
    hideError();

    try {
      const formData = new FormData();

      const fields = ['nome', 'email', 'whatsapp', 'empresa', 'cargo', 'segmento', 'canal'];
      fields.forEach(name => {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) formData.append(name, el.value);
      });

      formData.append('aceite_nda_dpa', 'true');

      const fileNames = ['carteira', 'cancelamentos', 'sinistros', 'adesoes'];
      fileNames.forEach(name => {
        const input = document.getElementById(`file-${name}`);
        if (input && input.files[0]) formData.append(name, input.files[0]);
      });

      const resp = await fetch(`${API_BASE}/api/diagnostico`, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      const data = await resp.json();

      if (resp.ok && (data.status === 'queued' || data.id)) {
        form.hidden = true;
        successEl.hidden = false;
        document.querySelector('.diag-stepper').hidden = true;
      } else {
        const msg = data.detail || data.message || 'Ocorreu um erro ao enviar. Tente novamente ou entre em contato por e-mail.';
        showError(msg);
        resetSubmitBtn(submitBtn, submitLabel, submitLoad);
      }
    } catch (err) {
      showError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
      resetSubmitBtn(submitBtn, submitLabel, submitLoad);
    }
  });

  function resetSubmitBtn(btn, label, load) {
    btn.disabled = false;
    if (label) label.hidden = false;
    if (load)  load.hidden  = true;
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorBanner.hidden = false;
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    errorBanner.hidden = true;
  }

  // Live validation — clear error on fix
  form.addEventListener('input', e => {
    const field = e.target;
    if (field.classList.contains('invalid') && field.value.trim()) {
      field.classList.remove('invalid');
      const label = field.closest('.form-label');
      if (label) label.classList.remove('has-error');
    }
  });
})();
