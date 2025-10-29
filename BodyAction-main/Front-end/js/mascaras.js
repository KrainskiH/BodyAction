document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const emailInput = document.getElementById("email");

  const cpfErro = document.getElementById("cpf-erro");
  const telefoneErro = document.getElementById("telefone-erro");
  const emailErro = document.getElementById("email-erro");

  // Permitir apenas números para CPF e telefone
  function apenasNumeros(event) {
    const key = event.key;
    if (!/[0-9]/.test(key) && key !== "Backspace" && key !== "Delete" && key !== "Tab") {
      event.preventDefault();
    }
  }

  // Mascara CPF: 000.000.000-00
  function mascaraCPF() {
    let value = cpfInput.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    cpfInput.value = value;
  }

  // Mascara telefone: (00) 00000-0000
  function mascaraTelefone() {
    let value = telefoneInput.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    telefoneInput.value = value;
  }

  // Eventos
  cpfInput.addEventListener("keydown", apenasNumeros);
  cpfInput.addEventListener("input", mascaraCPF);

  telefoneInput.addEventListener("keydown", apenasNumeros);
  telefoneInput.addEventListener("input", mascaraTelefone);

  // Validação ao enviar
  form.addEventListener("submit", function (e) {
    let valid = true;

    // CPF
    const cpfNumeros = cpfInput.value.replace(/\D/g, "");
    if (cpfNumeros.length < 11) {
      cpfErro.style.display = "block";
      valid = false;
    } else {
      cpfErro.style.display = "none";
    }

    // Telefone
    const telefoneNumeros = telefoneInput.value.replace(/\D/g, "");
    if (telefoneNumeros.length < 11) {
      telefoneErro.style.display = "block";
      valid = false;
    } else {
      telefoneErro.style.display = "none";
    }

    // Email (verificar se contém "@" e ".")
    if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
      emailErro.style.display = "block";
      valid = false;
    } else {
      emailErro.style.display = "none";
    }

    if (!valid) e.preventDefault();
  });

  // Limpa mensagens de erro quando corrige
  cpfInput.addEventListener("input", () => {
    if (cpfInput.value.replace(/\D/g, "").length === 11) cpfErro.style.display = "none";
  });
  telefoneInput.addEventListener("input", () => {
    if (telefoneInput.value.replace(/\D/g, "").length === 11) telefoneErro.style.display = "none";
  });
  emailInput.addEventListener("input", () => {
    if (emailInput.value.includes("@") && emailInput.value.includes(".")) emailErro.style.display = "none";
  });
  
});

