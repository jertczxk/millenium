# Painel do Vendedor - MilleniumPREV

## 📋 Descrição

O **Painel do Vendedor** é um dashboard completo para gestão de vendas, metas, comissões e treinamentos dos vendedores MilleniumPREV.

---

## 🏗️ Estrutura de Arquivos

```
vendedor/
├── index.html          # Página de login (CPF)
├── dashboard.html      # Painel principal com métricas
├── venda.html          # Página de vendas (pública, com ?vendedor=SLUG)
├── metas.html          # Página de metas e funil de vendas
├── calendario.html     # Calendário de eventos e compromissos
├── treinamentos.html   # Academy - cursos, aulas e exercícios
├── material.html       # Materiais de marketing para download
├── script.js           # JavaScript principal do painel
└── style.css           # Estilos do painel
```

---

## 🔐 Fluxo de Autenticação

```
1. Vendedor acessa /vendedor/index.html
2. Insere CPF no formulário de login
3. Sistema valida CPF (TODO: API MySQL)
4. Se válido, salva dados no localStorage e redireciona para dashboard.html
5. Páginas protegidas verificam autenticação via checkAuth()
6. Logout limpa localStorage e redireciona para login
```

### Funções de Autenticação
| Função | Descrição |
|--------|-----------|
| `handleLogin(event)` | Processa formulário de login |
| `checkAuth()` | Verifica se usuário está autenticado |
| `getSellerData()` | Retorna dados do vendedor do localStorage |
| `logoutSeller()` | Faz logout e limpa sessão |

---

## 📊 Páginas do Dashboard

### 1. `dashboard.html` - Painel Principal
**Métricas exibidas:**
- Comissão do mês (R$)
- Contratos vendidos
- Progresso da meta (%)
- Acessos à página de vendas

**Ações rápidas:**
- Acessar página de vendas
- Compartilhar no WhatsApp
- Cadastrar novo vendedor

### 2. `venda.html` - Página de Vendas
**URL**: `venda.html?vendedor=SLUG_VENDEDOR`

Página pública que o vendedor compartilha com clientes. Contém:
- Apresentação dos planos
- Botões de checkout com tracking do vendedor
- Carrossel de parceiros

> ⚠️ O parâmetro `?vendedor=` é crucial para tracking de comissões!

### 3. `metas.html` - Metas e Funil
- Meta mensal com progresso circular
- Funil de vendas (Abordados → Negociando → Fechados)
- Breakdown por tipo de plano
- Conquistas/Recompensas

### 4. `calendario.html` - Calendário
- Visualização mensal
- Eventos marcados com cores
- Lista de próximos compromissos

### 5. `treinamentos.html` - Academy MilleniumPREV
**Conteúdos educacionais para vendedores:**

- **Categorias**: Técnicas de Vendas, Conhecimento de Planos, Atendimento, Follow-up
- **Cursos**: Conjunto de aulas em vídeo
- **Aulas**: Vídeos com player (Vimeo/YouTube)
- **Recursos**: PDFs e documentos para download
- **Exercícios**: Quizzes com pontuação e feedback

**Progresso do vendedor:**
- Cursos completos
- Horas de estudo
- Exercícios realizados
- Certificados emitidos

### 6. `material.html` - Materiais de Marketing
- Cards promocionais
- Artes para redes sociais
- Apresentações PDF
- Scripts de vendas

---

## 💾 Estrutura de Dados Mock (MOCK_SELLER_DB)

O arquivo `script.js` contém `MOCK_SELLER_DB` que simula os dados do MySQL:

```javascript
MOCK_SELLER_DB = {
    // Dados básicos do vendedor (tabela: sellers)
    id: 40,
    slug: 'vendedor40',
    name: 'Vendedor Teste',
    email: 'vendedor@example.com',
    phone: '(41) 99999-9999',
    isPremium: true,
    commissionRate: 0.15,

    // Métricas do dashboard (tabela: seller_metrics)
    metrics: {
        commission: { value: 650.00, trend: 12, trendUp: true },
        sales: { contracts: 18, trend: 5, trendUp: true },
        goal: { current: 18, target: 30, percentage: 60 },
        pageViews: { count: 156, trend: 22, trendUp: true }
    },

    // Metas (tabela: seller_goals)
    goals: { ... },

    // Calendário (tabela: seller_events)
    calendar: { ... }
}
```

---

## 🗄️ Tabelas MySQL Sugeridas

### Vendedores e Autenticação
```sql
CREATE TABLE sellers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    is_premium BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(3,2) DEFAULT 0.10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Métricas Mensais
```sql
CREATE TABLE seller_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    month DATE NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0,
    sales_contracts INT DEFAULT 0,
    page_views INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);
```

### Metas
```sql
CREATE TABLE seller_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    month DATE NOT NULL,
    objective INT NOT NULL,
    achieved INT DEFAULT 0,
    status ENUM('in_progress', 'completed', 'failed') DEFAULT 'in_progress',
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);
```

### Eventos do Calendário
```sql
CREATE TABLE seller_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    day INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    time TIME,
    location VARCHAR(100),
    type ENUM('call', 'meeting', 'training') DEFAULT 'meeting',
    color VARCHAR(20),
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);
```

### Vendas (para comissões)
```sql
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT,
    plan_type ENUM('prata', 'ouro', 'pet', 'company') NOT NULL,
    customer_name VARCHAR(100),
    customer_cpf VARCHAR(14),
    amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    checkout_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);
```

### Sistema de Treinamentos
```sql
-- Categorias de cursos
CREATE TABLE training_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50)
);

-- Cursos
CREATE TABLE training_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    duration VARCHAR(20),
    rating DECIMAL(2,1),
    is_new BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES training_categories(id)
);

-- Aulas
CREATE TABLE training_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),
    duration VARCHAR(10),
    order_num INT,
    FOREIGN KEY (course_id) REFERENCES training_courses(id)
);

-- Recursos para download
CREATE TABLE training_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type ENUM('pdf', 'doc', 'ppt', 'other'),
    FOREIGN KEY (lesson_id) REFERENCES training_lessons(id)
);

-- Exercícios (questões em JSON)
CREATE TABLE training_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    questions_json JSON,
    FOREIGN KEY (lesson_id) REFERENCES training_lessons(id)
);

-- Progresso do vendedor
CREATE TABLE seller_training_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    lesson_id INT NOT NULL,
    progress_percent INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (lesson_id) REFERENCES training_lessons(id)
);

-- Certificados
CREATE TABLE seller_certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    course_id INT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (course_id) REFERENCES training_courses(id)
);
```

---

## 🔌 Pontos de Integração (TODO Backend)

### 1. Login
**Arquivo**: `script.js` → `handleLogin()`
```javascript
// TODO: Substituir localStorage por chamada à API
// POST /api/auth/login
// Body: { cpf }
// Response: { seller: {...}, token: "JWT" }
```

### 2. Carregar Dados do Dashboard
**Arquivo**: `script.js` → `getSellerData()`
```javascript
// TODO: Buscar dados via API
// GET /api/seller/:id/dashboard
// Headers: { Authorization: "Bearer TOKEN" }
```

### 3. Métricas em Tempo Real
**Arquivo**: `script.js` → `populateDashboardPage()`
```javascript
// TODO: Endpoint para métricas
// GET /api/seller/:id/metrics
```

### 4. Tracking de Vendas
**Arquivo**: `script.js` → `appendSellerToUrl()`
```javascript
// O parâmetro ?vendedor=SLUG deve ser capturado no checkout
// para registrar a venda e calcular comissão do vendedor
```

### 5. Progresso de Treinamentos
**Arquivo**: `treinamentos.html` (script inline)
```javascript
// TODO: Salvar progresso via API
// POST /api/training/progress
// Body: { seller_id, lesson_id, progress_percent, completed }
```

---

## 🎨 Funções JavaScript Principais

| Função | Arquivo | Descrição |
|--------|---------|-----------|
| `handleLogin()` | script.js | Processa login por CPF |
| `initSellerDashboard()` | script.js | Inicializa dashboard com dados do vendedor |
| `updateCommonElements()` | script.js | Atualiza elementos comuns (sidebar, header) |
| `populateDashboardPage()` | script.js | Preenche métricas do dashboard |
| `populateGoalsPage()` | script.js | Preenche página de metas |
| `populateCalendarPage()` | script.js | Preenche calendário com eventos |
| `getSalesPageUrl()` | script.js | Gera URL da página de vendas com slug |
| `shareSellerPage()` | script.js | Compartilha página via WhatsApp |
| `openAgePopup()` | script.js | Abre popup de seleção de idade/peso |
| `confirmPlanSelection()` | script.js | Processa checkout com tracking |
| `filterByCategory()` | treinamentos.html | Filtra cursos por categoria |
| `openLesson()` | treinamentos.html | Abre modal de aula |
| `loadExercise()` | treinamentos.html | Carrega exercício/quiz |
| `submitExercise()` | treinamentos.html | Envia respostas e calcula pontuação |

---

## ⚠️ Observações Importantes

1. **Sessão por localStorage**: Atualmente usa `localStorage`. Implementar JWT para produção.
2. **Dados Mock**: `MOCK_SELLER_DB` deve ser substituído por chamadas à API.
3. **Vídeos**: Player de vídeo não implementado. Integrar Vimeo/YouTube API.
4. **Exercícios**: Questões armazenadas em JSON. Estrutura pronta para MySQL.
5. **Tracking**: Parâmetro `?vendedor=` é essencial para comissões.
