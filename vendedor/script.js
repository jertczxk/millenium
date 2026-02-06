/* =========================================
   PAINEL DO VENDEDOR - MILLENIUM PREV
   =========================================
   Este arquivo contém toda a lógica do painel do vendedor.
   
   PARA O DESENVOLVEDOR BACKEND:
   - Os dados abaixo (MOCK_SELLER_DB) simulam o que virá do MySQL
   - Substitua as funções de localStorage por chamadas à API
   - Mantenha a estrutura de dados para compatibilidade
   ========================================= */

/* =========================================
   1. DADOS MOCK - SUBSTITUIR POR API MYSQL
   =========================================
   Esta constante simula todos os dados que virão do banco de dados.
   Estrutura pronta para serialização JSON da API.
   ========================================= */
const MOCK_SELLER_DB = {
    // ================================
    // DADOS BÁSICOS DO VENDEDOR
    // Tabela MySQL: sellers
    // ================================
    id: 40,                         // ID único do vendedor
    slug: 'vendedor40',             // Slug único para URL da página de vendas
    name: 'Vendedor Teste',         // Nome completo
    firstName: 'Vendedor',          // Primeiro nome (para saudação)
    email: 'vendedor@example.com',  // Email de contato
    phone: '(41) 99999-9999',       // Telefone
    avatar: null,                   // URL do avatar ou null para padrão
    isPremium: true,                // Se é vendedor premium (badge especial)
    commissionRate: 0.15,           // Taxa de comissão (15% = 0.15)
    createdAt: '2024-01-15',        // Data de cadastro

    // ================================
    // MÉTRICAS DO DASHBOARD
    // Tabela MySQL: seller_metrics
    // Dados atualizados mensalmente
    // ================================
    metrics: {
        // Comissão do mês atual
        commission: {
            value: 650.00,          // Valor em R$
            trend: 12,              // Variação percentual em relação ao mês anterior
            trendUp: true           // true = aumento, false = queda
        },
        // Vendas realizadas no mês
        sales: {
            contracts: 18,          // Quantidade de contratos fechados
            trend: 5,               // Variação em relação ao mês anterior
            trendUp: true
        },
        // Meta mensal
        goal: {
            current: 18,            // Vendas realizadas
            target: 30,             // Meta definida
            percentage: 60,         // Percentual atingido (current/target * 100)
            remaining: 12           // Vendas restantes para bater meta
        },
        // Acessos à página de vendas do vendedor
        pageViews: {
            count: 156,             // Total de visualizações
            trend: 22,              // Variação percentual
            trendUp: true
        }
    },

    // ================================
    // DADOS DE METAS E FUNIL
    // Tabela MySQL: seller_goals
    // ================================
    goals: {
        // Meta mensal detalhada
        monthly: {
            month: 'Fevereiro 2026', // Mês de referência
            objective: 30,           // Objetivo de vendas
            achieved: 18,            // Vendas realizadas
            percentage: 60,          // Percentual atingido
            remaining: 12,           // Restantes
            status: 'in_progress'    // Status: 'completed', 'in_progress', 'failed'
        },
        // Funil de vendas (etapas do processo comercial)
        funnel: {
            approached: { current: 85, target: 100 },    // Clientes abordados
            negotiating: { current: 42, target: 50 },    // Em negociação
            closed: { current: 23, target: 30 }          // Vendas fechadas
        },
        // Detalhamento por tipo de plano
        breakdown: [
            { label: 'Vendas Planos Ouro', current: 15, target: 20, percentage: 75, color: '#81bb3f' },
            { label: 'Vendas Planos Pet', current: 5, target: 5, percentage: 100, color: '#2ecc71' },
            { label: 'Vendas Planos Company', current: 3, target: 5, percentage: 60, color: '#f1c40f' }
        ],
        // Conquistas/Recompensas (gamificação)
        rewards: [
            { id: 1, name: 'Vendedor Iniciante', description: 'Realizar a primeira venda.', unlocked: true, icon: 'fa-medal' },
            { id: 2, name: 'Vendedor Premium', description: 'Atingir 20 vendas no mês.', unlocked: true, icon: 'fa-star' },
            { id: 3, name: 'Top 1 do Mês', description: 'Ser o vendedor com mais vendas.', unlocked: false, icon: 'fa-crown' }
        ]
    },

    // ================================
    // EVENTOS DO CALENDÁRIO
    // Tabela MySQL: seller_events
    // ================================
    calendar: {
        currentMonth: 'Fevereiro 2026',  // Mês atual exibido
        // Lista de eventos com cores: red (urgente), blue (reunião), green (treinamento)
        events: [
            { id: 1, day: 2, title: 'Follow-up Cliente A', time: '10:00', type: 'call', color: 'red' },
            { id: 2, day: 5, title: 'Reunião Equipe', time: '14:00', type: 'meeting', color: 'blue' },
            { id: 3, day: 10, title: 'Reunião de Equipe', time: '14:00', location: 'Google Meet', color: 'green' },
            { id: 4, day: 12, title: 'Apresentação Cliente', time: '09:30', location: 'Presencial', color: 'green' },
            { id: 5, day: 15, title: 'Treinamento Vendas', time: '16:00', location: 'Online', color: 'blue' }
        ],
        upcomingEvents: [
            { day: 10, month: 'FEV', title: 'Reunião de Equipe', time: '14:00', location: 'Google Meet' },
            { day: 12, month: 'FEV', title: 'Apresentação Cliente', time: '09:30', location: 'Presencial' },
            { day: 15, month: 'FEV', title: 'Treinamento Vendas', time: '16:00', location: 'Online' }
        ]
    }
};

/* =========================================
   2. INICIALIZAÇÃO DO PAINEL
   =========================================
   Executa ao carregar a página.
   Verifica autenticação e carrega dados do vendedor.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // SISTEMA DE IDENTIFICAÇÃO DO VENDEDOR
    // TODO: Integrar com API MySQL
    // ================================

    // Verifica se o vendedor está autenticado (sessão válida)
    // Se não estiver, redireciona para página de login
    if (!checkAuth()) return;

    // Obtém dados do vendedor do localStorage (mock)
    // TODO: Substituir por GET /api/seller/:id
    const currentSeller = getSellerData();

    // Inicializa o dashboard com os dados do vendedor
    if (currentSeller && typeof initSellerDashboard === 'function') {
        initSellerDashboard(currentSeller);
    }

    // Inicializa animações GSAP
    initSmoothScroll();
    initAnimations();
    if (typeof initMarquee === 'function') initMarquee();
    if (typeof initPlansStacking === 'function') initPlansStacking();
    if (typeof initFooterMarquee === 'function') initFooterMarquee();

    // ================================
    // MÁSCARA DE CPF NO INPUT
    // Formata automaticamente: 000.000.000-00
    // ================================
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, "");  // Remove não-dígitos
            if (value.length > 11) value = value.slice(0, 11);  // Limita a 11 dígitos

            // Aplica máscara progressivamente
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, "$1.$2.$3");
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})(\d{3}).*/, "$1.$2");
            }
            e.target.value = value;
        });
    }

    // Sidebar Active State
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'dashboard.html' && currentPath.includes('dashboard.html')) {
            link.classList.add('active');
        }
    });
});

/* =========================================
   3. SISTEMA DE ANIMAÇÕES GSAP
   =========================================
   Animações de entrada e interação.
   Detecta o tipo de página e aplica animações específicas.
   ========================================= */
function initAnimations() {
    // Verifica se a biblioteca GSAP está carregada
    if (typeof gsap !== 'undefined') {

        // Detecta se é página de vendas (pública) ou dashboard (painel)
        const isSalesPage = document.querySelector('.sales-header') !== null;

        // ================================
        // ANIMAÇÕES DA PÁGINA DE VENDAS
        // Animações completas e chamativas para impressionar o cliente
        // ================================
        if (isSalesPage) {
            const tl = gsap.timeline();

            tl.from('.sales-header', {
                y: -20,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out'
            })
                .from('.hero-content h1', {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out"
                }, "-=0.2")
                .from('.hero-content p', {
                    y: 20,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out"
                }, "-=0.2")
                .from('.hero-content .btn-action', {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "-=0.2")
                .from('.sales-stats-grid .seal-pill', {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    stagger: 0.1
                }, "-=0.4")
                .from('.sales-intro', {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: 'power2.out'
                }, "-=0.4")
                .from('.partners-section', {
                    opacity: 0,
                    y: 30,
                    duration: 0.6
                }, "-=0.2")
                .from('.plans-header', {
                    opacity: 0,
                    y: 20,
                    duration: 0.6
                }, "-=0.2")
                .from('.plan-card', {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    stagger: 0.15
                }, "-=0.2");
        }

        // ================================
        // ANIMAÇÕES DO DASHBOARD
        // Sutis e rápidas para não atrapalhar a navegação
        // ================================
        if (!isSalesPage) {
            // Fade-in suave do conteúdo principal
            gsap.fromTo('.main-content',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.in' }
            );
        }

        // animate Numbers
        const metricValues = document.querySelectorAll('.metric-value-lg');
        metricValues.forEach(el => {
            const rawValue = el.textContent.trim();

            // 1. Currency Animation (e.g., R$ 850,00)
            if (rawValue.includes('R$')) {
                const targetValue = parseFloat(rawValue.replace('R$ ', '').replace('.', '').replace(',', '.'));

                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 0.5,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = 'R$ ' + obj.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                    }
                });
            }
            // 2. Percentage Animation (e.g., 70%)
            else if (rawValue.includes('%')) {
                const targetValue = parseInt(rawValue.replace('%', ''));
                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 0.5,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = Math.ceil(obj.value) + '%';
                    }
                });
            }
            // 3. Simple Number + Suffix (e.g., 23 contratos)
            else if (rawValue.match(/\d+/)) {
                const targetValue = parseInt(rawValue.match(/\d+/)[0]);
                const suffix = rawValue.replace(/\d+/, '').trim();

                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 0.8,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = `${Math.ceil(obj.value)} ${suffix}`;
                    }
                });
            }
        });

    }
}

/* =========================================
   4. SISTEMA DE LOGIN
   =========================================
   Processa o formulário de login por CPF.
   
   TODO BACKEND:
   - POST /api/auth/login { cpf }
   - Retornar { seller: {...}, token: "JWT" }
   - Armazenar token para requisições autenticadas
   ========================================= */
function handleLogin(event) {
    event.preventDefault();
    const cpf = document.getElementById('cpf').value;
    const cleanCpf = cpf.replace(/\D/g, "");  // Remove formatação

    // Valida se o CPF tem 11 dígitos
    if (cleanCpf.length === 11) {

        // Feedback visual de carregamento
        const btn = event.target.querySelector('button');
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ACESSANDO...`;
        btn.disabled = true;
        btn.style.opacity = '0.8';

        // ================================
        // TODO: SUBSTITUIR POR CHAMADA À API
        // fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ cpf: cleanCpf }) })
        // ================================

        // MOCK: Simula login bem-sucedido com dados fictícios
        const sessionSeller = { ...MOCK_SELLER_DB };
        sessionSeller.cpf = cleanCpf;

        // Salva sessão no localStorage (substituir por JWT em produção)
        localStorage.setItem('currentSeller', JSON.stringify(sessionSeller));

        // Redireciona para o dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    } else {
        alert("Por favor, digite um CPF válido.");
    }
}

/* =========================================
   5. MENU LATERAL (SIDEBAR)
   =========================================
   Funções para expandir/recolher o menu lateral.
   ========================================= */

// Alterna menu lateral em desktop (expandido/recolhido)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.classList.toggle('collapsed');

    // Ajusta padding do conteúdo principal
    if (sidebar.classList.contains('collapsed')) {
        mainContent.classList.add('sidebar-collapsed-padding');
    } else {
        mainContent.classList.remove('sidebar-collapsed-padding');
    }
}

// Abre/fecha menu em dispositivos móveis com animação GSAP
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const isOpen = sidebar.classList.contains('mobile-open');

    if (typeof gsap !== 'undefined') {
        if (!isOpen) {
            // Opening animation
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // GSAP slide in from left
            gsap.fromTo(sidebar,
                { x: '-100%' },
                { x: '0%', duration: 0.4, ease: 'power2.in' }
            );

            // Fade in overlay
            gsap.fromTo(overlay,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            // Toggle hamburger icon
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            // Closing animation
            closeMobileMenu();
        }
    } else {
        // Fallback without GSAP
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');

        const icon = menuBtn.querySelector('i');
        if (sidebar.classList.contains('mobile-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }
}

// Fecha menu mobile com animação de slide-out
function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (!sidebar.classList.contains('mobile-open')) return;

    if (typeof gsap !== 'undefined') {
        // GSAP slide out to left
        gsap.to(sidebar, {
            x: '-100%',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                sidebar.classList.remove('mobile-open');
                sidebar.style.transform = ''; // Reset inline style
            }
        });

        // Fade out overlay
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                overlay.classList.remove('active');
                overlay.style.opacity = ''; // Reset inline style
            }
        });
    } else {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    }

    // Reset icon
    const icon = menuBtn?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }

    // Unlock body scroll
    document.body.style.overflow = '';
}



/* =========================================
   6. COMPARTILHAMENTO WHATSAPP
   ========================================= */

// Compartilha link genérico no WhatsApp
function shareWhatsapp() {
    const text = encodeURIComponent("Olá! Confira os planos da MilleniumPREV e garanta sua proteção hoje mesmo: " + window.location.origin + '/index.html?ref=joaogabriel');
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. BTN-ACTION (Dark Theme)
    const startDarkButtons = document.querySelectorAll('.btn-action');
    startDarkButtons.forEach(btn => {
        const arrow = btn.querySelector('.arrow-svg');
        const circle = btn.querySelector('.icon-bg');
        if (arrow && circle) {
            const tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power3.out" } });
            tl.to(btn, { scale: 1.02, backgroundColor: "#225e55", duration: 0.5 })
                .to(circle, { scale: 1 }, "<")
                .to(arrow, { rotation: 75, scale: 1.03, stroke: "#1a4d45" }, "<");


            btn.addEventListener('mouseenter', () => tl.play());
            btn.addEventListener('mouseleave', () => tl.reverse());
        }
    });

    // 2. FLOATING SEALS ANIMATION
    const seals = document.querySelectorAll('.seal');
    if (seals.length > 0 && typeof gsap !== 'undefined') {
        gsap.to(seals, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2,
            onComplete: () => {
                // Infinite Float Animation after entrance
                seals.forEach((seal, index) => {
                    gsap.to(seal, {
                        y: -15,
                        duration: 3 + Math.random() * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: index * 0.2
                    });
                });
            }
        });

        // Initial setup for entrance (ensure they start slightly lower)
        gsap.set(seals, { y: 30 });
    }
});

function initMarquee() {
    if (typeof gsap === 'undefined') return;

    // Select rows
    const leftRows = document.querySelectorAll('.row-left');
    const rightRows = document.querySelectorAll('.row-right');

    const animateRow = (rows, direction) => {
        rows.forEach(row => {
            // Duplicate content 4 times to ensure smooth loop
            const content = row.innerHTML;
            row.innerHTML = content + content + content + content;

            // Initial position setup to avoid jump
            if (direction === 'right') {
                gsap.set(row, { xPercent: -50 });
            }

            gsap.to(row, {
                xPercent: direction === 'left' ? -50 : 0,
                duration: 60 + Math.random() * 20, // Varied speeds
                ease: "none",
                repeat: -1,
                // If moving right, we animate from -50 to 0. If left, from 0 to -50.
                startAt: { xPercent: direction === 'left' ? 0 : -50 }
            });
        });
    };

    if (leftRows.length > 0) animateRow(leftRows, 'left');
    if (rightRows.length > 0) animateRow(rightRows, 'right');
}

function initPlansStacking() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = document.querySelectorAll('.plan-card');

    if (!cards.length) return;

    // We use CSS Sticky for the actual pinning/stacking.
    // GSAP is used here ONLY for the entrance animation (scale/rotation).
    cards.forEach((card, index) => {
        gsap.fromTo(card, {
            scale: 0.9 + (0.02 * index),
            rotation: index % 2 === 0 ? 1 : -1, // Subtle tilt
            y: 50
        }, {
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%", // Animate in when card enters view
                toggleActions: "play none none reverse"
            }
        });
    });
}

/* =========================================
   7. SISTEMA DE CHECKOUT E POPUP DE PLANOS
   =========================================
   Gerencia a seleção de planos e redirecionamento para checkout.
   O parâmetro ?vendedor= é CRUCIAL para tracking de comissões!
   ========================================= */

/**
 * Obtém o slug do vendedor a partir da URL
 * URL esperada: venda.html?vendedor=vendedor40
 * 
 * IMPORTANTE: Este parâmetro é usado para rastrear
 * qual vendedor gerou a venda e calcular comissões.
 */
function getSellerFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('vendedor') || null;
}

/**
 * Adiciona o ID do vendedor na URL de checkout
 * Isso permite que o backend identifique quem fez a venda.
 * 
 * @param {string} url - URL base do checkout (Tenex)
 * @returns {string} URL com parâmetro vendedor
 */
function appendSellerToUrl(url) {
    const sellerId = getSellerFromUrl();
    if (!sellerId) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}vendedor=${sellerId}`;
}

// URLs de checkout por plano e faixa etária/peso/funcionários
// Apontam para o sistema Tenex
const checkoutLinks = {
    prata: {
        name: "Plano Prata",
        ageRanges: [
            { maxAge: 50, url: "https://crematoriomillenium.tenex.com.br/contratar/Master50?plano=c7ff1dc3-03f6-42f2-ae8f-67c794eabbab" },
            { maxAge: 70, url: "https://crematoriomillenium.tenex.com.br/contratar/Master70?plano=72fa0970-6041-4b0b-be69-715557561c40" }
        ]
    },
    ouro: {
        name: "Plano Ouro",
        ageRanges: [
            { maxAge: 50, url: "https://crematoriomillenium.tenex.com.br/contratar/Gold50?plano=107d4860-7187-4576-bd38-24f6f299e069" },
            { maxAge: 60, url: "https://crematoriomillenium.tenex.com.br/contratar/Gold70?plano=d0ed50e3-82d2-4422-b555-63de0996b022" },
            { maxAge: 70, url: "https://crematoriomillenium.tenex.com.br/contratar/gold61?plano=c2e7ac45-d824-4842-bbaf-8152b19ac6f0" }
        ]
    },
    pet: {
        name: "Plano Pet",
        options: {
            "até20kg": { label: "Até 20kg", url: "https://crematoriomillenium.tenex.com.br/contratar/pet?plano=f68e01b5-f296-4ef0-a0f4-c83233db6937" },
            "acima20kg": { label: "Acima de 20kg", url: "https://crematoriomillenium.tenex.com.br/contratar/petacima20kg?plano=eb5f7eb8-f697-421c-b1c6-a4a0a00126da" }
        }
    },
    company: {
        name: "Plano Company",
        employeeRanges: [
            { min: 20, max: 49, url: "https://crematoriomillenium.tenex.com.br/contratar/Company10?plano=807c6f17-a724-4aeb-a6b7-6c4eaff960c5" },
            { min: 50, max: 199, url: "https://crematoriomillenium.tenex.com.br/contratar/Company30?plano=cda8d91d-6165-436b-b693-b0a892f6eabb" }
        ]
    }
};

let currentPlan = null;
let currentAction = null;

function openAgePopup(action) {
    const parts = action.split('_');
    currentAction = parts[0];
    currentPlan = parts[1];

    const popup = document.getElementById('planPopup');
    const title = document.getElementById('popupTitle');
    const description = document.getElementById('popupDescription');

    document.getElementById('ageInputSection').style.display = 'none';
    document.getElementById('petWeightSection').style.display = 'none';
    document.getElementById('companyEmployeesSection').style.display = 'none';

    const ageInput = document.getElementById('titularAge');
    const employeeInput = document.getElementById('employeeCount');
    if (ageInput) ageInput.value = '';
    if (employeeInput) employeeInput.value = '';
    document.querySelectorAll('input[name="petWeight"]').forEach(r => r.checked = false);

    const planData = checkoutLinks[currentPlan];
    const actionText = currentAction === 'checkout' ? 'Comprar' : 'Compartilhar';

    if (currentPlan === 'prata' || currentPlan === 'ouro') {
        title.textContent = `${actionText} ${planData.name}`;
        description.textContent = 'Informe a idade do titular para prosseguir:';
        document.getElementById('ageInputSection').style.display = 'block';
    } else if (currentPlan === 'pet') {
        title.textContent = `${actionText} ${planData.name}`;
        description.textContent = 'Selecione o peso do seu pet:';
        document.getElementById('petWeightSection').style.display = 'block';
    } else if (currentPlan === 'company') {
        title.textContent = `${actionText} ${planData.name}`;
        description.textContent = 'Informe o número de funcionários:';
        document.getElementById('companyEmployeesSection').style.display = 'block';
    }

    popup.classList.add('active');

    setTimeout(() => {
        if (currentPlan === 'prata' || currentPlan === 'ouro') {
            document.getElementById('titularAge')?.focus();
        } else if (currentPlan === 'company') {
            document.getElementById('employeeCount')?.focus();
        }
    }, 100);
}

function closePlanPopup() {
    const popup = document.getElementById('planPopup');
    if (popup) {
        popup.classList.remove('active');
        currentPlan = null;
        currentAction = null;
    }
}

function confirmPlanSelection() {
    const planData = checkoutLinks[currentPlan];
    let checkoutUrl = null;
    let shareParam = '';

    if (currentPlan === 'prata' || currentPlan === 'ouro') {
        const age = parseInt(document.getElementById('titularAge').value);
        if (!age || age < 18 || age > 120) {
            alert('Por favor, insira uma idade válida (18-120 anos).');
            return;
        }
        for (const range of planData.ageRanges) {
            if (age <= range.maxAge) {
                checkoutUrl = range.url;
                break;
            }
        }
        if (!checkoutUrl) {
            alert('Desculpe, não temos planos disponíveis para esta faixa etária.');
            return;
        }
        shareParam = `idade ${age} anos`;
    } else if (currentPlan === 'pet') {
        const selected = document.querySelector('input[name="petWeight"]:checked');
        if (!selected) {
            alert('Por favor, selecione o peso do seu pet.');
            return;
        }
        const weight = selected.value;
        checkoutUrl = planData.options[weight].url;
        shareParam = planData.options[weight].label;
    } else if (currentPlan === 'company') {
        const employees = parseInt(document.getElementById('employeeCount').value);
        if (!employees || employees < 20) {
            alert('Por favor, insira um número válido de funcionários (mínimo 20).');
            return;
        }
        for (const range of planData.employeeRanges) {
            if (employees >= range.min && employees <= range.max) {
                checkoutUrl = range.url;
                break;
            }
        }
        if (!checkoutUrl) {
            checkoutUrl = planData.employeeRanges[planData.employeeRanges.length - 1].url;
        }
        shareParam = `${employees} funcionários`;
    }

    const btn = document.getElementById('confirmPopupBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    // Save values before timeout (closePlanPopup clears them)
    const actionToPerform = currentAction;
    const planName = planData.name;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        // Close popup first
        closePlanPopup();

        // Apply seller tracking to URL
        const finalUrl = appendSellerToUrl(checkoutUrl);

        // Perform action with saved values
        if (actionToPerform === 'checkout') {
            window.location.href = finalUrl;
        } else if (actionToPerform === 'share') {
            const message = encodeURIComponent(
                `Olá! Confira o ${planName} da MilleniumPREV para ${shareParam}:\n${finalUrl}`
            );
            window.location.href = `https://wa.me/?text=${message}`;
        }
    }, 800);
}

function initFooterMarquee() {
    const marqueeContent = document.querySelector('.footer-marquee-content');
    if (marqueeContent && typeof gsap !== 'undefined') {
        const content = marqueeContent.innerHTML;
        marqueeContent.innerHTML += content;

        gsap.to(marqueeContent, {
            xPercent: -40,
            repeat: -1,
            duration: 80,
            ease: "none"
        });
    }
}

// Ensure Footer Marquee runs
// document.addEventListener('DOMContentLoaded', () => {
// initFooterMarquee();
// }); This is now handled in the main listener

function initSmoothScroll() {
    // --- SMOOTH SCROLL (LENIS + GSAP) ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Expose to window for popup control
        window.lenis = lenis;

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Handle Anchor Links with Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    lenis.scrollTo(targetId, {
                        offset: -50, // Adjust for header
                        duration: 1.5
                    });
                }
            });
        });
    }
}

/* =========================================
   8. SISTEMA DE IDENTIFICAÇÃO DO VENDEDOR
   =========================================
   Funções para gerenciar sessão e dados do vendedor logado.
   
   TODO BACKEND:
   - Substituir localStorage por JWT
   - Validar token em cada requisição
   - Buscar dados atualizados via API
   ========================================= */

/**
 * Obtém dados do vendedor logado
 * Atualmente usa localStorage, deve ser substituído por API
 * 
 * TODO: GET /api/seller/me (com token JWT)
 * 
 * @returns {Object|null} Dados do vendedor ou null se não logado
 */
function getSellerData() {
    // Verifica se estamos em uma página protegida do painel
    const isDashboardPage = window.location.pathname.includes('dashboard') ||
        window.location.pathname.includes('material') ||
        window.location.pathname.includes('metas') ||
        window.location.pathname.includes('calendario') ||
        window.location.pathname.includes('treinamentos');

    // Se não for página do painel, retorna null
    if (!isDashboardPage) return null;

    // Tenta obter vendedor do localStorage (mock de sessão)
    let seller = localStorage.getItem('currentSeller');

    if (seller) {
        return JSON.parse(seller);
    }

    return null;
}

/**
 * Inicializa o dashboard com os dados do vendedor
 * Preenche todos os elementos dinâmicos da página
 * 
 * @param {Object} seller - Objeto com dados do vendedor
 */
function initSellerDashboard(seller) {
    // Armazena vendedor globalmente para acesso em outras funções
    window.currentSeller = seller;

    // Atualiza elementos comuns (sidebar, header, perfil)
    updateCommonElements(seller);

    // Detecta página atual e preenche dados específicos
    const currentPage = window.location.pathname;

    if (currentPage.includes('dashboard')) {
        populateDashboardPage(seller);  // Métricas principais
    } else if (currentPage.includes('metas')) {
        populateGoalsPage(seller);      // Metas e funil
    } else if (currentPage.includes('calendario')) {
        populateCalendarPage(seller);   // Eventos
    }
}

/**
 * Atualiza elementos comuns em todas as páginas
 * Nome do vendedor, links personalizados, etc.
 */
function updateCommonElements(seller) {
    // Update seller name in header
    const headerTitle = document.querySelector('.header-title h1');
    if (headerTitle && window.location.pathname.includes('dashboard')) {
        const badgeHTML = seller.isPremium ?
            ' <span class="premium-badge"><i class="fa-solid fa-star"></i> Vendedor Premium</span>' : '';
        headerTitle.innerHTML = `Olá, ${seller.name}!${badgeHTML}`;
    }

    // Update user profile in sidebar
    const userInfo = document.querySelector('.user-info h4');
    if (userInfo) {
        userInfo.textContent = seller.firstName || seller.name.split(' ')[0];
    }

    // Set sales page link in sidebar (by ID)
    const salesPageLink = document.getElementById('salesPageNavLink');
    if (salesPageLink) {
        salesPageLink.href = getSalesPageUrl(seller);
    }

    // Update quick action buttons (by ID)
    const btnAccessSalesPage = document.getElementById('btnAccessSalesPage');
    if (btnAccessSalesPage) {
        btnAccessSalesPage.onclick = () => openSalesPage(seller);
    }

    const btnShareWhatsapp = document.getElementById('btnShareWhatsapp');
    if (btnShareWhatsapp) {
        btnShareWhatsapp.onclick = () => shareSellerPage(seller);
    }
}

/**
 * Preenche a página principal (dashboard) com métricas do vendedor
 */
function populateDashboardPage(seller) {
    if (!seller.metrics) return;

    const m = seller.metrics;

    // Commission
    updateMetricCard('metricCommission', `R$ ${m.commission.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, m.commission.trend, m.commission.trendUp);

    // Sales
    updateMetricCard('metricSales', `${m.sales.contracts} contratos`, m.sales.trend, m.sales.trendUp);

    // Goal
    const goalCard = document.getElementById('metricGoal');
    if (goalCard) {
        const valueEl = goalCard.querySelector('.metric-value-lg');
        const progressBar = goalCard.querySelector('.progress-bar');
        const detailEl = goalCard.querySelector('.metric-detail');

        if (valueEl) valueEl.textContent = `${m.goal.percentage}%`;
        if (progressBar) progressBar.style.width = `${m.goal.percentage}%`;
        if (detailEl) detailEl.textContent = `Faltam ${m.goal.remaining} contratos para a meta`;
    }

    // Page Views
    updateMetricCard('metricPageViews', `${m.pageViews.count} acessos`, m.pageViews.trend, m.pageViews.trendUp);
}

/**
 * Atualiza um card de métrica individual
 * Usado para comissão, vendas, acessos, etc.
 */
function updateMetricCard(id, value, trend, trendUp) {
    const card = document.getElementById(id);
    if (!card) return;

    const valueEl = card.querySelector('.metric-value-lg');
    const trendEl = card.querySelector('.metric-trend');

    // Removed textContent update here to allow GSAP to animate it.
    // Instead, we will store the value in a data attribute for GSAP to pick up
    // Or, we update it and let GSAP handle it if it runs after.

    // To fix conflict with GSAP number animation:
    // GSAP animation reads text content. If we update it immediately, GSAP will animate 0 -> new value.
    if (valueEl) {
        valueEl.textContent = value;
    }

    if (trendEl) {
        const icon = trendUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        const sign = trendUp ? '+' : '';
        trendEl.innerHTML = `<i class="fa-solid ${icon}"></i> ${sign} ${trend}%`;
    }
}

/**
 * Preenche a página de metas com dados do vendedor
 * Inclui meta mensal, funil e conquistas
 */
function populateGoalsPage(seller) {
    if (!seller.goals) return;

    const g = seller.goals;

    // Monthly Goal
    const monthEl = document.getElementById('goalMonth');
    const percentEl = document.getElementById('goalPercentage');
    const circleEl = document.querySelector('.circle');
    const objectiveEl = document.getElementById('goalObjective');
    const achievedEl = document.getElementById('goalAchieved');
    const remainingEl = document.getElementById('goalRemaining');

    if (monthEl) monthEl.textContent = g.monthly.month;
    if (percentEl) percentEl.textContent = `${g.monthly.percentage}%`;
    if (circleEl) circleEl.setAttribute('stroke-dasharray', `${g.monthly.percentage}, 100`);
    if (objectiveEl) objectiveEl.textContent = `${g.monthly.objective} Contratos`;
    if (achievedEl) achievedEl.textContent = `${g.monthly.achieved} Contratos`;
    if (remainingEl) remainingEl.textContent = `${g.monthly.remaining} Contratos`;

    // Funnel
    updateFunnelStep('funnelApproached', g.funnel.approached);
    updateFunnelStep('funnelNegotiating', g.funnel.negotiating);
    updateFunnelStep('funnelClosed', g.funnel.closed);
}

/**
 * Atualiza uma etapa do funil de vendas
 */
function updateFunnelStep(id, data) {
    const step = document.getElementById(id);
    if (!step) return;

    const valueEl = step.querySelector('.step-value');
    if (valueEl) valueEl.textContent = `${data.current} / ${data.target}`;
}

/**
 * Preenche o calendário com eventos do vendedor
 * Marca dias com eventos e lista próximos compromissos
 */
function populateCalendarPage(seller) {
    if (!seller.calendar) return;

    const c = seller.calendar;

    // Update month title
    const monthTitle = document.querySelector('.calendar-header h2');
    if (monthTitle) monthTitle.textContent = c.currentMonth;

    // Mark days with events
    c.events.forEach(event => {
        const dayEl = document.querySelector(`.day:not(.other-month):nth-child(${event.day + 7})`); // +7 for prev month days
        if (dayEl && !dayEl.querySelector('.event-dot')) {
            const dot = document.createElement('div');
            dot.className = `event-dot ${event.color}`;
            dayEl.classList.add('has-event');
            dayEl.appendChild(dot);
        }
    });
}

/**
 * Gera URL da página de vendas personalizada do vendedor
 * Exemplo: https://site.com/vendedor/venda.html?vendedor=vendedor40
 * 
 * @param {Object} seller - Dados do vendedor
 * @returns {string} URL completa com parâmetro vendedor
 */
function getSalesPageUrl(seller) {
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '');
    return `${baseUrl}venda.html?vendedor=${seller.slug}`;
}

/**
 * Abre a página de vendas personalizada em nova aba
 * Usado no botão "Acessar Página" do dashboard
 */
function openSalesPage(seller) {
    const url = getSalesPageUrl(seller);
    window.open(url, '_blank');
}

/**
 * Compartilha a página de vendas via WhatsApp
 * O vendedor usa para enviar seu link personalizado aos clientes
 */
function shareSellerPage(seller) {
    const url = getSalesPageUrl(seller);
    const message = encodeURIComponent(
        `Olá! Conheça os planos MilleniumPREV com benefícios exclusivos para você e sua família:\n${url}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

/**
 * Gera URL de checkout com tracking do vendedor
 * Adiciona ?vendedor=SLUG para rastrear comissões
 * 
 * @param {string} planType - Tipo do plano (prata, ouro, pet, company)
 * @param {Object} params - Parâmetros adicionais (idade, peso, funcionários)
 * @param {Object} seller - Dados do vendedor
 * @returns {string} URL de checkout com ID do vendedor
 */
function getCheckoutUrlWithSeller(planType, params, seller) {
    const planData = checkoutLinks[planType];
    if (!planData) return null;

    let baseUrl = '';

    // Determine correct checkout URL based on plan type and params
    if (planType === 'prata' || planType === 'ouro') {
        for (const range of planData.ageRanges) {
            if (params.age <= range.maxAge) {
                baseUrl = range.url;
                break;
            }
        }
    } else if (planType === 'pet') {
        baseUrl = planData.options[params.weight].url;
    } else if (planType === 'company') {
        for (const range of planData.employeeRanges) {
            if (params.employees >= range.min && params.employees <= range.max) {
                baseUrl = range.url;
                break;
            }
        }
    }

    // Append seller ID to checkout URL
    // TODO: This should be handled by MySQL to track commissions
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}vendedor=${seller.slug}`;
}

/**
 * Faz logout do vendedor e limpa a sessão
 * Redireciona para página de login
 */
function logoutSeller() {
    localStorage.removeItem('currentSeller');  // Limpa dados da sessão
    window.location.href = 'index.html';       // Redireciona para login
}

/**
 * Verifica autenticação do vendedor
 * Protege páginas que requerem login
 * 
 * Páginas públicas (não requerem login):
 * - index.html (login)
 * - venda.html (página de vendas do cliente)
 * 
 * @returns {boolean} true se autenticado, false se não
 */
function checkAuth() {
    // Páginas que não requerem autenticação
    const isLoginPage = window.location.pathname.includes('index.html') ||
        window.location.pathname.endsWith('/vendedor/') ||
        window.location.pathname.endsWith('vendedor');
    const isVendaPage = window.location.pathname.includes('venda.html');

    // Se não é página pública e não tem sessão, redireciona para login
    if (!isLoginPage && !isVendaPage && !getSellerData()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
