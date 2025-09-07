document.addEventListener('DOMContentLoaded', () => {
    /* ================================
       Compartilhar link da campanha
    ================================== */
    const shareLinkContainer = document.querySelector('.share-link');
    const campaignLinkInput = document.querySelector('.share-link input[type="text"]');

    if (shareLinkContainer && campaignLinkInput) {
        shareLinkContainer.addEventListener('click', (e) => {
            if (e.target === campaignLinkInput) {
                campaignLinkInput.select();
                campaignLinkInput.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(campaignLinkInput.value).then(() => {
                    alert('Link copiado para a área de transferência!');
                });
            }
        });
    }

    /* ================================
       Copiar chave PIX (botão único)
    ================================== */
    const copyPixKeyButton = document.querySelector('.pix-section .copy-pix-key');
    const pixKey = '5703389@vakinha.com.br';

    if (copyPixKeyButton) {
        copyPixKeyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(pixKey).then(() => {
                alert('Chave PIX copiada para a área de transferência!');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = pixKey;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Chave PIX copiada para a área de transferência!');
            });
        });
    }

    /* ================================
       Modal de doação protegida
    ================================== */
    const protectedDonationBtn = document.getElementById('protectedDonationBtn');
    const modal = document.getElementById('protectedDonationModal');
    const closeBtn = document.querySelector('.close');
    const okBtn = document.querySelector('.modal-ok-btn');

    if (protectedDonationBtn && modal) {
        protectedDonationBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (okBtn && modal) {
        okBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    /* ================================
       Acordeão (FAQ)
    ================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            faqQuestions.forEach(otherQuestion => {
                otherQuestion.parentElement.classList.remove('active');
            });

            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    /* ================================
       Abas de navegação
    ================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    /* ================================
       Copiar chave PIX (abas múltiplas)
    ================================== */
    const copyPixButtons = document.querySelectorAll('.copy-pix-key');

    copyPixButtons.forEach(button => {
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(pixKey).then(() => {
                alert('Chave PIX copiada para a área de transferência!');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = pixKey;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Chave PIX copiada para a área de transferência!');
            });
        });
    });
});

/* ================================
   Botão "Leia mais"
================================== */
function toggleReadMore() {
    const shortText = document.querySelector('.short-text');
    const fullText = document.querySelector('.full-text');
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    if (fullText.style.display === 'none') {
        shortText.style.display = 'none';
        fullText.style.display = 'block';
        readMoreBtn.textContent = 'Leia menos';
    } else {
        shortText.style.display = 'block';
        fullText.style.display = 'none';
        readMoreBtn.textContent = 'Leia mais';
    }
}
