'use strict';

(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const wrapper = field.closest('.contact-form__field');
    if (!wrapper) return;
    wrapper.classList.add('contact-form__field--error');
    const errorEl = wrapper.querySelector('.contact-form__error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const wrapper = field.closest('.contact-form__field');
    if (!wrapper) return;
    wrapper.classList.remove('contact-form__field--error');
  }

  function clearAllErrors() {
    form.querySelectorAll('.contact-form__field--error').forEach(el => {
      el.classList.remove('contact-form__field--error');
    });
  }

  // Live validation
  ['cf-name', 'cf-company', 'cf-role', 'cf-email'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => clearError(id));
    el.addEventListener('blur', () => {
      if (id === 'cf-email' && el.value && !validateEmail(el.value)) {
        setError(id, 'Please enter a valid email address.');
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearAllErrors();

    let valid = true;
    const name    = document.getElementById('cf-name');
    const company = document.getElementById('cf-company');
    const role    = document.getElementById('cf-role');
    const email   = document.getElementById('cf-email');

    if (!name.value.trim()) {
      setError('cf-name', 'This field is required.'); valid = false;
    }
    if (!company.value.trim()) {
      setError('cf-company', 'This field is required.'); valid = false;
    }
    if (!role.value.trim()) {
      setError('cf-role', 'This field is required.'); valid = false;
    }
    if (!email.value.trim()) {
      setError('cf-email', 'This field is required.'); valid = false;
    } else if (!validateEmail(email.value)) {
      setError('cf-email', 'Please enter a valid email address.'); valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.contact-form__submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.style.opacity = '0';
      form.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.classList.add('visible');
      }, 400);
    }, 800);
  });
})();
