// js/contato.js
(function () {
  const form = document.getElementById("form-contato");
  if (!form) return;

  const cpfInput = document.getElementById("cpf");
  const telInput = document.getElementById("telefone");
  const emailInput = document.getElementById("email");
  const alertBox = document.getElementById("fc-alert");

  // Helpers
  const showAlert = (msg, type = "ok") => {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `fc-alert ${type}`;
    alertBox.hidden = false;
  };
  const hideAlert = () => {
    if (alertBox) alertBox.hidden = true;
  };

  // Força somente dígitos no CPF e limita a 11
  if (cpfInput) {
    cpfInput.addEventListener("input", () => {
      cpfInput.value = cpfInput.value.replace(/\D/g, "").slice(0, 11);
    });
  }

  // Formata telefone levemente e impede letras
  if (telInput) {
    telInput.addEventListener("input", () => {
      telInput.value = telInput.value.replace(/[^\d()-\s]/g, "");
    });
  }

  form.addEventListener("submit", (e) => {
    hideAlert();

    // HTML5 pattern/type já valida — aqui só garantimos mensagens melhores
    const errors = [];

    // Assunto
    const assunto = document.getElementById("assunto");
    if (!assunto || !assunto.value) errors.push("Selecione um assunto.");

    // Nome
    const nome = document.getElementById("nome");
    if (!nome || nome.value.trim().length < 2) errors.push("Informe seu nome completo.");

    // Telefone (pattern no HTML)
    if (telInput && !telInput.checkValidity()) {
      errors.push("Telefone inválido. Ex.: (41) 99999-9999");
    }

    // E-mail (type=email)
    if (emailInput && !emailInput.checkValidity()) {
      errors.push("E-mail inválido. Ex.: seuemail@exemplo.com");
    }

    // CPF (opcional, mas se preencher precisa ter 11 dígitos)
    if (cpfInput && cpfInput.value && cpfInput.value.length !== 11) {
      errors.push("CPF deve conter exatamente 11 números (somente dígitos).");
    }

    // Mensagem
    const msg = document.getElementById("mensagem");
    if (!msg || msg.value.trim().length < 10) {
      errors.push("Escreva uma mensagem com pelo menos 10 caracteres.");
    }

    // LGPD
    const lgpd = document.getElementById("lgpd");
    if (!lgpd || !lgpd.checked) errors.push("Autorize o uso dos dados para retorno do contato.");

    if (errors.length) {
      e.preventDefault();
      showAlert(errors.join(" "), "err");
      return false;
    }

    // Se tudo ok, só demonstração: evita recarregar e mostra sucesso.
    e.preventDefault();
    showAlert("Mensagem enviada com sucesso! Em breve retornaremos.", "ok");

    // Limpa o formulário após alguns segundos
    setTimeout(() => {
      form.reset();
      hideAlert();
    }, 4000);
  });
})();