document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------
       Modal de erro
    ----------------------------- */
    const errorModal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.getElementById("modal-close");

    function showError(message) {
        modalMessage.textContent = message;
        errorModal.style.display = "block";
    }

    modalClose.addEventListener("click", () => {
        errorModal.style.display = "none";
    });

    /* -----------------------------
       Elementos principais do formulário
    ----------------------------- */
    const form = document.getElementById("contributionForm");
    const submitBtn = document.querySelector(".submit-btn");

    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const cpfInput = document.getElementById("cpf");
    const nameInput = document.getElementById("name");
    const amountInput = document.getElementById("amount");

    const contributionValueSpan = document.getElementById("contribution-value");
    const totalValueSpan = document.getElementById("total-value");

    const boostCheckbox = document.getElementById("boost-checkbox");
    const boostPriceEl = document.querySelector(".boost-price");
    const paymentOptions = document.querySelectorAll(".payment-option");

    /* -----------------------------
       Utilitários de formatação
    ----------------------------- */
    function parseAmountRaw(raw) {
        if (!raw) return 0;
        raw = raw.trim().replace(/[^\d,.\-]/g, "");
        if (raw.indexOf(".") !== -1 && raw.indexOf(",") !== -1) {
            raw = raw.replace(/\./g, "").replace(",", ".");
        } else {
            raw = raw.replace(",", ".");
        }
        const n = parseFloat(raw);
        return isNaN(n) ? 0 : n;
    }

    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function getBoostTotal() {
        if (!boostPriceEl) return 0;
        const boostPrice = parseFloat(boostPriceEl.dataset.price) || 0;
        return boostCheckbox && boostCheckbox.checked ? boostPrice : 0;
    }

    function calculateTotal() {
        const contribution = parseAmountRaw(amountInput.value);
        const boostTotal = getBoostTotal();
        const total = contribution + boostTotal;

        contributionValueSpan.textContent = `R$ ${formatCurrency(contribution)}`;
        totalValueSpan.textContent = `R$ ${formatCurrency(total)}`;
    }

    /* -----------------------------
       Máscara de valor da contribuição
    ----------------------------- */
    amountInput.addEventListener("input", () => {
        let valor = amountInput.value.replace(/\D/g, "");
        if (valor === "") valor = "0";

        if (parseInt(valor, 10) > 9999999) {
            valor = "9999999"; // Máx: R$ 99.999,99
        }

        valor = (parseInt(valor, 10) / 100).toFixed(2).replace(".", ",");
        amountInput.value = valor;
        calculateTotal();
    });

    /* -----------------------------
       Alternância de forma de pagamento
    ----------------------------- */
    paymentOptions.forEach((option) => {
        option.addEventListener("click", () => {
            paymentOptions.forEach((btn) => btn.classList.remove("active"));
            option.classList.add("active");
        });
    });

    amountInput.addEventListener("input", calculateTotal);
    if (boostCheckbox) boostCheckbox.addEventListener("change", calculateTotal);
    calculateTotal(); // cálculo inicial

    /* -----------------------------
       Validações individuais
    ----------------------------- */
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let resto = soma % 11;
        let digito1 = resto < 2 ? 0 : 11 - resto;
        if (parseInt(cpf[9]) !== digito1) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        resto = soma % 11;
        let digito2 = resto < 2 ? 0 : 11 - resto;
        return parseInt(cpf[10]) === digito2;
    }

    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function validarTelefone(telefone) {
        const numeros = telefone.replace(/\D/g, "");
        if (numeros.length < 10 || numeros.length > 11) return false;
        const ddd = parseInt(numeros.substring(0, 2));
        return ddd >= 11 && ddd <= 99;
    }

    /* -----------------------------
       Validação final do formulário
    ----------------------------- */
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Processando...";

        const missing = [];
        if (!phoneInput.value.trim()) missing.push("Telefone");
        if (!emailInput.value.trim()) missing.push("E-mail");
        if (!cpfInput.value.trim()) missing.push("CPF");
        if (!nameInput.value.trim()) missing.push("Nome completo");

        const contributionVal = parseAmountRaw(amountInput.value);
        if (!amountInput.value.trim() || contributionVal === 0) {
            missing.push("Valor da contribuição");
        }

        if (missing.length > 0) {
            showError("Os campos obrigatórios não foram preenchidos, confira-os por favor!");
            submitBtn.disabled = false;
            submitBtn.textContent = "Contribuir";
            return;
        }

        if (!validarEmail(emailInput.value.trim())) {
            showError("Por favor, insira um e-mail válido.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Contribuir";
            return;
        }

        if (!validarTelefone(phoneInput.value)) {
            showError("Por favor, insira um telefone válido com DDD.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Contribuir";
            return;
        }

        if (!validarCPF(cpfInput.value)) {
            showError("CPF inválido. Por favor, insira um CPF válido.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Contribuir";
            return;
        }

        if (contributionVal < 30) {
            showError("O valor mínimo para contribuição é de R$ 30,00");
            submitBtn.disabled = false;
            submitBtn.textContent = "Contribuir";
            return;
        }

        /* -----------------------------
           Armazenamento local e redirecionamento
        ----------------------------- */
        const contribution = parseAmountRaw(amountInput.value);
        const boostTotal = getBoostTotal();
        const total = contribution + boostTotal;

        localStorage.setItem("valorContribuicaoBRL", contribution.toFixed(2));
        localStorage.setItem("valorBoostBRL", boostTotal.toFixed(2));
        localStorage.setItem("pixTotalBRL", total.toFixed(2));
        localStorage.setItem("pixTotalCentavos", String(Math.round(total * 100)));

        window.location.href = "/pagamento-pix";
    });
});
