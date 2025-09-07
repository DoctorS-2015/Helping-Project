# \# Helping - Plataforma de Doações Seguras

# 

# Este projeto foi desenvolvido como parte do meu portfólio e tem como objetivo demonstrar a construção de uma aplicação web segura e responsiva utilizando \*\*Flask (Python)\*\* no backend e \*\*HTML, CSS e JavaScript\*\* no frontend.

# 

# A plataforma simula um ambiente de financiamento coletivo (crowdfunding), com foco em \*\*segurança, usabilidade e transparência\*\*, permitindo ao usuário contribuir em campanhas de forma simples e intuitiva.

# 

# ---

# 

# \## 🚀 Tecnologias utilizadas

# 

# \- \*\*Backend:\*\*

# &nbsp; - Flask (framework principal)

# &nbsp; - Flask-WTF (proteção contra CSRF)

# &nbsp; - Middlewares customizados (logging, rate limiting, bot filter, headers de segurança)

# &nbsp; - Python-dotenv (gestão de variáveis de ambiente)

# 

# \- \*\*Frontend:\*\*

# &nbsp; - HTML5 + Jinja2 (templates dinâmicos)

# &nbsp; - CSS3 (responsividade, layout padronizado e estilos reutilizáveis)

# &nbsp; - JavaScript (validação de formulários, interações com modais e feedbacks visuais)

# 

# \- \*\*Segurança:\*\*

# &nbsp; - Rate limiting (limitação de requisições)

# &nbsp; - Cloaking contra bots

# &nbsp; - CSP com Nonce dinâmico

# &nbsp; - CSRF Protection

# &nbsp; - Cabeçalhos de segurança aplicados globalmente

# 

# ---

# 

# \## 📌 Estrutura do Projeto

# 

Helping-Project/

│

├── backend/

│ ├── app.py # Rotas e inicialização do Flask

│ ├── middleware/ # Middlewares de segurança

│ └── ...

│

├── templates/ # Páginas HTML

│ ├── index\_human.html

│ ├── contribua.html

│ ├── login.html

│ ├── ...

│

├── static/

│ ├── css/ # Arquivos de estilo (style.css, pages.css, contribua.css)

│ ├── js/ # Scripts (security.js, contribua.js, etc.)

│ ├── img/ # Imagens utilizadas no site

│ └── ...

│

└── README.md







---



\## 🔒 Funcionalidades de Segurança



\- \*\*CSRF Protect:\*\* garante que requisições POST/PUT/DELETE sejam legítimas.  

\- \*\*Rate Limiting:\*\* previne abuso e ataques de força bruta.  

\- \*\*CSP Nonce:\*\* protege contra injeções de script (XSS).  

\- \*\*Headers de Segurança:\*\* aplicados via middleware.  

\- \*\*Filtro de Bots:\*\* impede acessos automatizados.  

\- \*\*Sanitização de formulários e validações no frontend.\*\*



---



\## 📱 Funcionalidades Frontend



\- Layout \*\*100% responsivo\*\*.  

\- \*\*Modais informativos\*\* (ex.: doação protegida).  

\- \*\*Validação de login\*\* no navegador (padrões de e-mail e senha).  

\- \*\*Formulários ilustrativos\*\* de contribuição.  

\- Estilo moderno e consistente entre todas as páginas.



---



\## 🧩 Páginas criadas



\- Home (`/`)

\- Contribua (`/contribua`)

\- Pagamento Pix (`/pagamento-pix`)

\- Como ajudar (`/como-ajudar`)

\- Descubra (`/descubra`)

\- Como funciona (`/como-funciona`)

\- Quem somos (`/quem-somos`)

\- Login (`/login`)

\- Política de privacidade (`/politica-de-privacidade`)

\- Termos de uso (`/termos-de-uso`)

\- Financiamento coletivo (`/financiamento-coletivo`)

\- Relatório de transparência (`/relatorio-de-transparencia`)



---



\## ⚙️ Como executar localmente



1\. Clone o repositório:

&nbsp;  ```bash

&nbsp;  git clone https://github.com/seu-usuario/helping.git

&nbsp;  cd helping


2. Crie o ambiente virtual:



python -m venv .venv

.venv\\Scripts\\activate  # Windows

source .venv/bin/activate  # Linux/Mac



3\. Instale as dependências:



pip install -r requirements.txt



4\. Crie um arquivo .env na raiz:



FLASK\_ENV=development

SECRET\_KEY=sua\_chave\_segura\_aqui

PORT=5000


5\. Execute o projeto:



python backend/app.py



6\. Acesse em:

http://127.0.0.1:5000



