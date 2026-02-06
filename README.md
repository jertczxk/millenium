# MilleniumPREV - Plataforma de Proteção Familiar

## 📋 Descrição do Projeto

O **MilleniumPREV** é uma plataforma web de planos de proteção familiar e serviços funerários. O projeto é composto por:

1. **Site Institucional (raiz)** - Página principal com informações sobre planos, benefícios e formulário de contato
2. **Painel do Vendedor (`/vendedor`)** - Dashboard completo para gestão de vendas, metas, treinamentos e comissões

---

## 🏗️ Estrutura do Projeto

```
millenium/
├── index.html              # Página principal do site
├── script.js               # JavaScript principal (animações, popups, formulários)
├── style.css               # Estilos principais
├── styleguide.css          # Variáveis CSS e design tokens
├── globals.css             # Estilos globais
├── politica-privacidade.html
├── politica-cookies.html
├── termos-uso.html
├── vercel.json             # Configuração de deploy Vercel
├── img/                    # Imagens e assets
└── vendedor/               # Painel do vendedor (ver README específico)
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização e responsividade |
| **JavaScript (ES6+)** | Lógica e interatividade |
| **GSAP** | Animações avançadas |
| **ScrollTrigger** | Animações baseadas em scroll |
| **Lenis** | Scroll suave |

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/jertczxk/millenium.git

# Navegue até a pasta
cd millenium

# Abra com Live Server ou servidor local

```

---

## 📄 Descrição dos Arquivos Principais

### `index.html`
Página principal contendo:
- **Hero Section**: Banner principal com CTAs
- **Seção de Benefícios**: Rede de benefícios, auxílio funeral, cashback
- **Carrossel de Marcas**: Parceiros e empresas conveniadas
- **Seção de Planos**: Planos Prata, Ouro, Pet e Company
- **Calculadora ROI**: Simulador de economia mensal
- **FAQ**: Perguntas frequentes com accordion
- **Formulário de Contato**: Integração com WhatsApp
- **Footer**: Links, políticas e informações

### `script.js`
Contém toda a lógica JavaScript:
- **Navegação Desktop/Mobile**: Animações de show/hide
- **Sistema de Popup**: Modal dinâmico para benefícios e seleção de planos
- **Animações GSAP**: Hero, botões, scroll horizontal
- **Calculadora ROI**: Cálculo de economia mensal
- **Formulário WhatsApp**: Validação e redirecionamento
- **Sistema de Cookies**: Banner de consentimento LGPD
- **Transições de Página**: Efeito de loading entre páginas

### `style.css`
Estilos organizados por seções:
- Variáveis CSS (cores, fontes, espaçamentos)
- Componentes (botões, cards, formulários)
- Seções específicas (hero, planos, footer)
- Media queries para responsividade

---

## 🔌 Pontos de Integração com Backend (MySQL)

> ⚠️ **IMPORTANTE PARA O DESENVOLVEDOR BACKEND**

### 1. Captura de Leads
**Arquivo**: `script.js` (linha ~920)
**Função**: `setupWhatsappForm()`

Atualmente os leads são salvos no `localStorage`. Substituir por chamada à API:

```javascript
// ATUAL (localStorage)
localStorage.setItem('millenium_leads', JSON.stringify(existingLeads));

// TODO: Substituir por API
// POST /api/leads
// Body: { name, phone, email, source, date }
```

### 2. Checkout de Planos
**Arquivo**: `script.js` (linha ~490)
**Objeto**: `contentData` (plan_prata, plan_ouro, plan_pet, plan_company)

URLs de checkout que devem incluir tracking do vendedor:
```javascript
// Adicionar parâmetro ?vendedor=SLUG_VENDEDOR nas URLs de checkout
// Para rastrear comissões no backend
```

### 3. Formulário de Contato
**Arquivo**: `script.js`
**Número WhatsApp**: `5548991258150` (linha ~864)

---

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Desktop**: > 1200px
- **Notebook**: 901px - 1200px
- **Tablet**: 768px - 900px
- **Mobile**: < 768px

---

## 📁 Diretório `/vendedor`

O painel do vendedor possui documentação própria. Consulte:
**[/vendedor/README.md](./vendedor/README.md)**

---

## 🔗 Links Úteis

- **Deploy Vercel**: Configurado em `vercel.json`
- **Checkout Tenex**: URLs apontam para `crematoriomillenium.tenex.com.br`

---

## 📝 Notas para Integração

1. **Autenticação**: O painel do vendedor usa `localStorage` para sessão. Implementar JWT ou sessão real.
2. **Dados Mock**: Arquivo `/vendedor/script.js` contém `MOCK_SELLER_DB` com estrutura de dados.
3. **Tracking de Vendas**: Parâmetro `?vendedor=SLUG` nas URLs de checkout para comissões.
4. **Variáveis de Ambiente**: Criar `.env` para URLs da API e configurações.
