document.addEventListener('DOMContentLoaded', function () {
  // ========= Helpers =========
  function limitarTexto(s, max) {
    if (!s) return "";
    return s.toString().normalize("NFC").slice(0, max);
  }

  function normalizarValorBRL(x) {
    if (x == null) return null;
    const s = String(x).replace(/\s+/g, "");
    const s2 = s.replace(",", ".");
    const v = Number(s2);
    if (!isFinite(v) || v <= 0) return null;
    return v.toFixed(2);
  }

  function crc16ccitt(input) {
    let crc = 0xFFFF;
    for (let i = 0; i < input.length; i++) {
      crc ^= input.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function gerarTxid() {
    const base = 'DOA' + Date.now().toString().slice(-10);
    return base.replace(/[^A-Za-z0-9]/g, '').slice(0, 25);
  }

  function tlv(id, val) {
    return id + String(val.length).padStart(2, "0") + val;
  }

  function montarPayloadPix(chave, valorBRL, nome, cidade, txid) {
    const mai = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", chave);
    const parts = [
      "000201",
      tlv("26", mai),
      "52040000",
      "5303986"
    ];
    if (valorBRL) parts.push(tlv("54", valorBRL));
    parts.push("5802BR");
    parts.push(tlv("59", limitarTexto(nome, 25)));
    parts.push(tlv("60", limitarTexto(cidade, 15)));

    const txidLimpo = txid ? String(txid).replace(/[^A-Za-z0-9]/g, "").slice(0, 25) : "***";
    parts.push(tlv("62", tlv("05", txidLimpo)));

    const payloadSemCRC = parts.join('') + '6304';
    const crc = crc16ccitt(payloadSemCRC);   // calcula sobre ...6304
    return payloadSemCRC + crc;             // concatena os 4 dígitos HEX
  }

  // ========= Dados =========
  const CHAVE_PIX = "5af85154-a973-4d30-91ff-4668e68f7b61"; // sua chave real
  const MERCHANT_NAME = limitarTexto("Maria Clara Barros Correia", 25);
  const MERCHANT_CITY = limitarTexto("Horizonte", 15);

  const totalBRL = localStorage.getItem('pixTotalBRL') || localStorage.getItem('valorContribuicao');
  const valorParaPix = normalizarValorBRL(totalBRL);
  const txid = gerarTxid();

  const payloadPix = montarPayloadPix(CHAVE_PIX, valorParaPix, MERCHANT_NAME, MERCHANT_CITY, txid);

  // ========= Exibição =========
  const valorSpan = document.getElementById('valorPix');
  if (valorSpan) {
    valorSpan.textContent = valorParaPix
      ? Number(valorParaPix).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      : '—';
  }

  const pixCodeInput = document.getElementById('pixCode');
  if (pixCodeInput) pixCodeInput.value = payloadPix;

  // ========= QR =========
  function gerarQr(texto) {
    const el = document.getElementById("qrcodePix");
    if (!el) return;
    el.innerHTML = "";
    if (window.QRCode) {
      new QRCode(el, { text: texto, width: 256, height: 256 });
    } else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload = () => new QRCode(el, { text: texto, width: 256, height: 256 });
      document.head.appendChild(s);
    }
  }
  gerarQr(payloadPix);

  // ========= Copiar =========
  window.copiarCodigo = function () {
    const input = document.getElementById('pixCode');
    if (!input) return alert('Campo não encontrado');
    const tryLegacy = () => { input.select(); document.execCommand('copy'); alert('Código Pix copiado!'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(input.value).then(() => alert('Código Pix copiado!')).catch(tryLegacy);
    } else {
      tryLegacy();
    }
  };

  console.log('payloadPix:', payloadPix);
});
