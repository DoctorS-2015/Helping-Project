import os
import secrets

from flask import Flask, request, render_template, abort, g
from dotenv import load_dotenv

# Middlewares e segurança já existentes no projeto
from middleware.logging_safe import logging_safe
from middleware.headers import apply_security_headers
from middleware.bot_filter import limiter
from middleware.cloaking import decide_variant

# CSRF para formulários
from flask_wtf import CSRFProtect


# -----------------------------------------------------
# Configuração básica do app
# -----------------------------------------------------
load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, "static"),
    template_folder=os.path.join(BASE_DIR, "templates"),
)

# SECRET_KEY é necessária para CSRF e sessões
# (usa valor do .env; se não houver, gera uma chave efêmera segura)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))

# Rate Limiting (limiter vem do seu middleware.bot_filter)
limiter.init_app(app)

# Middlewares globais
app.before_request(logging_safe)
app.after_request(apply_security_headers)

# CSRF global (protege POST/PUT/PATCH/DELETE)
csrf = CSRFProtect(app)


# -----------------------------------------------------
# CSP nonce por request (para permitir <script nonce="...">)
# -----------------------------------------------------
@app.before_request
def add_csp_nonce():
    g.csp_nonce = secrets.token_urlsafe(16)


@app.context_processor
def inject_nonce():
    # Disponibiliza csp_nonce nos templates Jinja
    return {"csp_nonce": getattr(g, "csp_nonce", "")}


# -----------------------------------------------------
# ROTAS PRINCIPAIS
# -----------------------------------------------------
@app.get("/")
def index():
    variant = decide_variant(request)
    if variant == "block":
        abort(403)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("index_human.html")


@app.get("/contribua")
def contribua():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("contribua.html")


@app.get("/pagamento-pix")
def pagamento_pix():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("pagamento-pix.html")


# -----------------------------------------------------
# NOVAS ROTAS (mesma lógica já usada nas principais)
# -----------------------------------------------------
@app.get("/como-ajudar")
def como_ajudar():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("como-ajudar.html")


@app.get("/descubra")
def descubra():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("descubra.html")


@app.get("/como-funciona")
def como_funciona():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("como-funciona.html")


@app.get("/quem-somos")
def quem_somos():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("quem-somos.html")


@app.get("/login")
def login():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("login.html")


@app.get("/politica-de-privacidade")
def politica_de_privacidade():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("politica-de-privacidade.html")


@app.get("/termos-de-uso")
def termos_de_uso():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("termos-de-uso.html")


@app.get("/financiamento-coletivo")
def financiamento_coletivo():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("financiamento-coletivo.html")


@app.get("/relatorio-de-transparencia")
def relatorio_de_transparencia():
    variant = decide_variant(request)
    if variant == "bot":
        return render_template("index_bot.html")
    return render_template("relatorio-de-transparencia.html")


# -----------------------------------------------------
# ROTAS AUXILIARES
# -----------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


@app.errorhandler(403)
def forbidden(e):
    return render_template("403.html"), 403


# -----------------------------------------------------
# MAIN
# -----------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Em produção, lembre-se de desabilitar debug
    app.run(host="127.0.0.1", port=port, debug=True)
