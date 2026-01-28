/* =========================================
   0. FUNÇÃO AUXILIAR - DETECÇÃO DE TELA
   ========================================= */
function isMobile() {
    return window.innerWidth <= 900;
}

/* =========================================
1. NAVBAR DESKTOP
========================================= */
const navbar = document.querySelector(".navbar");

(function () {
    if (!navbar) return;
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    let isHidden = false;

    function handleScroll() {
        if (isMobile()) return;

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (currentScroll > lastScroll && currentScroll > 80) {
                    if (!isHidden) {
                        gsap.to(navbar, { y: "-100%", duration: 0.4, ease: "power3.inOut" });
                        isHidden = true;
                    }
                } else if (currentScroll < lastScroll) {
                    if (isHidden) {
                        gsap.to(navbar, { y: "0%", duration: 0.4, ease: "power3.out" });
                        isHidden = false;
                    }
                }
                lastScroll = Math.max(currentScroll, 0);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", function () {
        if (!isMobile() && isHidden) {
            gsap.to(navbar, { y: "0%", duration: 0.4, ease: "power3.out" });
            isHidden = false;
        }
    });
})();

/* =========================================
   2. BOTÃO LOGIN (Apenas Desktop)
   ========================================= */
const clubBlock = document.querySelector('.club-login-block');
if (clubBlock) {
    const iconCircle = clubBlock.querySelector('.icon-circle');
    if (iconCircle) {
        const tlIcon = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "power2.out" } });
        tlIcon.to(iconCircle, { scale: 1.1, rotation: -20 });

        clubBlock.addEventListener('mouseenter', () => {
            if (!isMobile()) tlIcon.play();
        });
        clubBlock.addEventListener('mouseleave', () => {
            if (!isMobile()) tlIcon.reverse();
        });
    }
}

/* =========================================
   3. QR CODE NO HOVER (MÚLTIPLAS INSTÂNCIAS CORRIGIDAS)
   ========================================= */
// Seleciona TODOS os wrappers de download
const downloadWrappers = document.querySelectorAll('.download-wrapper');

// Itera sobre cada um para criar sua própria lógica isolada
downloadWrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.qr-card');
    // Seleciona os botões pelas classes, não por ID
    const btnApple = wrapper.querySelector('.apple-trigger');
    const btnAndroid = wrapper.querySelector('.android-trigger');
    const qrApple = wrapper.querySelector('.qr-apple');
    const qrAndroid = wrapper.querySelector('.qr-android');

    if (card && btnApple && btnAndroid && qrApple && qrAndroid) {
        let isAppleSelected = true;

        // Timeline de Hover específica para este card
        const hoverTl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power2.out" } });

        hoverTl.to(card, {
            autoAlpha: 1,
            y: 0,
            startAt: { y: 15 }
        });

        // Eventos de Mouse no Wrapper
        wrapper.addEventListener('mouseenter', () => {
            if (!isMobile()) hoverTl.play();
        });
        wrapper.addEventListener('mouseleave', () => {
            if (!isMobile()) hoverTl.reverse();
        });

        // Função de troca (isolada dentro do loop)
        function switchQR(type) {
            if ((type === 'apple' && isAppleSelected) || (type === 'android' && !isAppleSelected)) return;

            isAppleSelected = type === 'apple';

            if (isAppleSelected) {
                btnApple.classList.add('active');
                btnAndroid.classList.remove('active');
                gsap.to(qrApple, { autoAlpha: 1, duration: 0.3 });
                gsap.to(qrAndroid, { autoAlpha: 0, duration: 0.3 });
            } else {
                btnAndroid.classList.add('active');
                btnApple.classList.remove('active');
                gsap.to(qrAndroid, { autoAlpha: 1, duration: 0.3 });
                gsap.to(qrApple, { autoAlpha: 0, duration: 0.3 });
            }
        }

        // Eventos de Clique nos Botões
        btnApple.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isMobile()) switchQR('apple');
        });
        btnAndroid.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isMobile()) switchQR('android');
        });
    }
});

/* =========================================
   4. NAVBAR MOBILE
   ========================================= */
const menuOverlay = document.querySelector('.mobile-menu-overlay');
const toggleBtn = document.getElementById('menu-toggle-btn');
const menuItems = document.querySelectorAll('.menu-item-anim');
const navbarMobile = document.querySelector('.navbar-mobile');
const body = document.body;

if (menuOverlay && toggleBtn && navbarMobile) {
    const lineTop = document.getElementById('line-top');
    const lineMid = document.getElementById('line-mid');
    const lineBot = document.getElementById('line-bot');

    const pathOpen = {
        top: "M22.5 1.5L1.5 1.5",
        mid: "M32.5 12.5L1.5 12.5",
        bot: "M43.5 23.5H1.5"
    };

    let isMenuOpen = false;
    let isAnimating = false;

    const menuTl = gsap.timeline({
        paused: true,
        onStart: () => {
            isAnimating = true;
            body.classList.add('no-scroll');
        },
        onComplete: () => {
            isAnimating = false;
            menuOverlay.style.pointerEvents = "all";
        },
        onReverseComplete: () => {
            isAnimating = false;
            body.classList.remove('no-scroll');
            menuOverlay.style.pointerEvents = "none";
        }
    });

    if (lineTop && lineMid && lineBot) {
        menuTl
            .to(menuOverlay, { clipPath: "circle(150% at calc(100% - 42px) 40px)", duration: 0.8, ease: "power2.inOut" })
            .to(lineTop, { attr: { d: pathOpen.top }, duration: 0.6, ease: "power2.inOut" }, "<")
            .to(lineMid, { attr: { d: pathOpen.mid }, duration: 0.6, ease: "power2.inOut" }, "<")
            .to(lineBot, { attr: { d: pathOpen.bot }, duration: 0.6, ease: "power2.inOut" }, "<")
            .to(menuItems, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4");
    }

    function toggleMenu() {
        if (!isMobile()) return;
        if (isAnimating) return;

        if (!isMenuOpen) {
            menuTl.timeScale(1).play();
            isMenuOpen = true;
        } else {
            menuTl.timeScale(1.5).reverse();
            isMenuOpen = false;
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    menuItems.forEach(item => {
        if (item.tagName === 'A') {
            item.addEventListener('click', () => {
                if (isMenuOpen && !isAnimating) toggleMenu();
            });
        }
    });

    // Hide/Show Mobile Navbar
    let lastScrollMobile = window.pageYOffset || document.documentElement.scrollTop;
    let isHiddenMobile = false;

    function handleMobileScroll() {
        if (!isMobile()) {
            if (isHiddenMobile) {
                gsap.to(navbarMobile, { y: "0%", duration: 0.3, ease: "power2.out" });
                isHiddenMobile = false;
            }
            return;
        }

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (isMenuOpen) return;

        if (currentScroll > lastScrollMobile && currentScroll > 60) {
            if (!isHiddenMobile) {
                gsap.to(navbarMobile, { y: "-100%", duration: 0.3, ease: "power2.out" });
                isHiddenMobile = true;
            }
        } else if (currentScroll < lastScrollMobile) {
            if (isHiddenMobile) {
                gsap.to(navbarMobile, { y: "0%", duration: 0.3, ease: "power2.out" });
                isHiddenMobile = false;
            }
        }
        lastScrollMobile = Math.max(currentScroll, 0);
    }

    window.addEventListener("scroll", handleMobileScroll, { passive: true });

    window.addEventListener("resize", function () {
        if (!isMobile() && isMenuOpen) {
            toggleMenu();
        }
    });
}

/* =========================================
5. ANIMAÇÃO HERO + CTA HOVER + USUÁRIOS
========================================= */
document.addEventListener("DOMContentLoaded", () => {

    // 5.1 HERO ANIMAÇÃO
    const heroTl = gsap.timeline();
    heroTl.from(".hero-left > *", { y: 40, opacity: 0, duration: 0.7, stagger: 0.3, ease: "power3.inOut" });
    heroTl.to(".seal", { scale: 1, opacity: 1, duration: 0.9, stagger: { amount: 1, from: "random" }, ease: "back.out(1.7)" }, "-=0.5");

    gsap.to(".seal", { y: -15, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.3, from: "random" } });

    // Animação dos selos da about section quando atinge 70% do viewport
    const aboutSeals = document.querySelectorAll('.about-seal-1, .about-seal-2, .about-seal-3, .about-seal-4');
    if (aboutSeals.length > 0) {

        // Animação flutuante contínua (igual aos selos da hero)
        gsap.to(aboutSeals, {
            y: -15,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.4, from: "random" }
        });
    }

    // 5.2 BOTÃO CTA HOVER (Dark Button) - Aplica a TODOS os botões .btn-action
    const btnActions = document.querySelectorAll('.btn-action');

    btnActions.forEach(btnDark => {
        const arrowDark = btnDark.querySelector('.arrow-svg');
        const circleDark = btnDark.querySelector('.icon-bg');

        if (arrowDark && circleDark) {
            const btnTl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power3.out" } });
            btnTl.to(btnDark, { scale: 1.02, backgroundColor: "#225e55", duration: 0.5 })
                .to(circleDark, { scale: 1 }, "<")
                .to(arrowDark, { rotation: 70, scale: 1.03, stroke: "#1a4d45" }, "<");

            btnDark.addEventListener('mouseenter', () => btnTl.play());
            btnDark.addEventListener('mouseleave', () => btnTl.reverse());
        }
    });
});

// 5.3 STACK DE USUÁRIOS
const userImgs = document.querySelectorAll(".testimonial-img img");
userImgs.forEach((img) => {
    img.addEventListener("mouseenter", () => {
        userImgs.forEach((other) => {
            if (other !== img) gsap.to(other, { filter: "grayscale(100%)", scale: 0.9, duration: 0.4 });
        });
        gsap.to(img, { x: 0, scale: 1.15, filter: "grayscale(0%)", zIndex: 10, duration: 0.4, ease: "back.out(1.7)" });
    });

    img.addEventListener("mouseleave", () => {
        userImgs.forEach((other) => {
            gsap.to(other, { filter: "grayscale(0%)", scale: 1, x: 0, zIndex: 1, duration: 0.4 });
        });
    });
});

gsap.registerPlugin(ScrollTrigger);

// Row Ímpar (1 e 3) -> Direita
gsap.to(".row-odd", {
    scrollTrigger: {
        trigger: ".brands-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    xPercent: 10,
    ease: "none"
});

// Row Par (2 e 4) -> Esquerda
gsap.to(".row-even", {
    scrollTrigger: {
        trigger: ".brands-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    xPercent: -10,
    ease: "none"
});

// Fade In Conteúdo De Texto
gsap.from(".content-overlay", {
    scrollTrigger: {
        trigger: ".brands-section",
        start: "top 60%",
        toggleActions: "play none none reverse"
    },
    y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
});

// Botão CTA (Light Button)
const btnLight = document.querySelector('.btn-action-2');
const arrowLight = document.querySelector('.arrow-svg-2');
const circleLight = document.querySelector('.icon-bg-2');

if (btnLight && arrowLight && circleLight) {
    const tlLight = gsap.timeline({
        paused: true,
        defaults: { duration: 0.6, ease: "power3.out" }
    });
    tlLight
        .to(btnLight, {
            scale: 1.02,
            backgroundColor: "#81BB3F",
            duration: 0.5
        })
        .to(circleLight, {
            scale: 1
        }, "<")
        .to(arrowLight, {
            rotation: 70,
            scale: 1.03,
            stroke: "#81BB3F"
        }, "<");

    btnLight.addEventListener('mouseenter', () => tlLight.play());
    btnLight.addEventListener('mouseleave', () => tlLight.reverse());
}

/* =========================================
6. ANIMAÇÃO HORIZONTAL SCROLL (CARDS)
========================================= */
const section = document.querySelector(".pin-section");
const wrapper = document.querySelector(".pin-content-wrapper");

if (section && wrapper) {

    ScrollTrigger.matchMedia({

        // Apenas para Desktop (min-width: 901px)
        "(min-width: 901px)": function () {

            // 1. Calcula a largura total que precisa ser rolada
            // (Largura total do trilho - Largura da Janela)
            // Adicionamos um pequeno buffer (+100px) para garantir que o último card entre totalmente
            const scrollAmount = wrapper.scrollWidth - window.innerWidth;

            gsap.to(wrapper, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    pin: true, // Trava a seção na tela
                    scrub: 1,  // Suavidade no movimento

                    // CORREÇÃO AQUI:
                    // "top top": Trava quando o TOPO da seção bate no TOPO da tela.
                    // Isso garante que a seção verde ocupe 100% da viewport antes de começar a mover.
                    start: "center center",

                    // Define a duração da rolagem baseada na largura do conteúdo
                    end: () => "+=" + scrollAmount,

                    invalidateOnRefresh: true
                }
            });
        },

        // Mobile
        "(max-width: 900px)": function () {
            // Scroll nativo
        }
    });
}
;
document.addEventListener("DOMContentLoaded", () => {

    // --- DADOS DO POPUP (Agora com suporte a HTML customizado) ---
    const contentData = {
        rede: {
            title: "Economia Real para o seu dia a dia.",
            image: "img/rede de beneficios.png",
            type: "text", // Define que é uma lista de textos
            content: [
                "Acesse descontos de até 70% em mais de 3 mil estabelecimentos parceiros em todo o Brasil.",
                "Com a Rede de Benefícios MilleniumPREV, a economia mensal pode superar o valor que você investe no plano. Isso significa custo zero na prática: você protege quem ama e ainda sobra dinheiro no final do mês.",
                "Simples, prático e sem burocracia. É cuidado inteligente que transforma proteção em economia real para o dia a dia da sua família."
            ]
        },
        funeral: {
            title: "Acolhimento quando necessário",
            image: "img/auxilio.png",
            type: "text",
            content: [
                "Perder alguém querido já é devastador. Lidar com decisões burocráticas não deveria fazer parte desse processo.",
                "O Auxílio Funeral MilleniumPREV remove esse fardo. Oferecemos apoio completo: velório, sepultamento, documentação e todo suporte necessário, sem custo adicional, sem surpresas.",
                "Nossa equipe especializada cuida de cada detalhe com respeito e agilidade, para que você possa focar apenas em se despedir com amor."
            ]
        },
        cashback: {
            title: "Cuidado Volta em Dinheiro.",
            image: "img/cashback.png",
            type: "text",
            content: [
                "Cada vez que você compra nos parceiros aptos, você acumula cashback que volta diretamente para o seu bolso.",
                "O programa de Cashback transforma seu uso de parceiros em economia real e mensurável. Quanto mais você usa, mais você recupera, um ciclo virtuoso que premia quem prioriza prevenção e cuidado inteligente.",
                "Simples assim: proteja sua família, economize no dia a dia e ainda receba de volta."
            ]
        },
        // --- NOVO TIPO: CONTATO ---
        contact: {
            title: "Tem alguma dúvida sobre a MilleniumPREV?",
            image: "img/atendente.png",
            type: "html",
            description: "Preencha abaixo e converse direto no WhatsApp com um especialista que vai entender suas necessidades e apresentar a melhor solução.",
            htmlContent: `
                <form class="popup-form" id="popupWhatsappForm">
                    <input type="text" id="popup-nome" class="form-input" placeholder="Seu Nome Completo" required>
                    <input type="tel" id="popup-telefone" class="form-input" placeholder="(00) 00000-0000" required>
                    <input type="email" id="popup-email" class="form-input" placeholder="Seu E-mail Principal" required>
                    <button type="submit" class="btn-action-2 form-submit-btn">
                        <span>Ir para o Whatsapp</span>
                        <div class="icon-container">
                            <div class="icon-bg-2"></div>
                            <svg class="arrow-svg-2" viewBox="0 0 24 24">
                                <line x1="0" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </button>
                </form>
            `
        }
    };

    // --- SELETORES ---
    const body = document.body;
    const overlay = document.querySelector('.popup-overlay');
    const card = document.querySelector('.popup-card');
    // Seleciona TODOS os botões que devem ter a animação de hover
    const actionButtons = document.querySelectorAll('.trigger-btn, .btn-action-2');
    const triggers = document.querySelectorAll('.trigger-btn');
    const closeBtn = document.querySelector('.close-popup-btn');

    const popupTitle = document.getElementById('popup-title');
    const popupBody = document.getElementById('popup-body');
    const popupImgContainer = document.getElementById('popup-img-container');

    let isAnimating = false;
    let isOpen = false;
    let lastActiveBtn = null;
    let btnCenterX = 0;
    let btnCenterY = 0;

    // --- TIMELINE DE ABERTURA ---
    const popupTl = gsap.timeline({
        paused: true,
        onStart: () => {
            isAnimating = true;
            body.classList.add('no-scroll');
            overlay.classList.add('active');
        },
        onComplete: () => { isAnimating = false; },
        onReverseComplete: () => {
            isAnimating = false;
            body.classList.remove('no-scroll');
            overlay.classList.remove('active');
            isOpen = false;
        }
    });

    // --- FUNÇÃO ATUALIZADA (Lida com Texto e Formulário) ---
    function updatePopupContent(key) {
        const data = contentData[key];

        // Fallback simples se não achar o tipo
        if (!data) return;

        // 1. Título e Imagem (Comum a todos)
        popupTitle.textContent = data.title;
        popupImgContainer.style.backgroundImage = `url('${data.image}')`;
        popupBody.innerHTML = ''; // Limpa conteúdo anterior

        // 2. Lógica de Renderização
        if (data.type === 'text') {
            // Renderiza Parágrafos (Benefícios)
            data.content.forEach(text => {
                const p = document.createElement('p');
                p.classList.add('popup-text');
                p.textContent = text;
                popupBody.appendChild(p);
            });
        } else if (data.type === 'html') {
            // Renderiza Descrição + Formulário (Contato)
            if (data.description) {
                const p = document.createElement('p');
                p.classList.add('popup-text');
                p.textContent = data.description;
                popupBody.appendChild(p);
            }
            // Injeta o HTML do formulário
            popupBody.insertAdjacentHTML('beforeend', data.htmlContent);
        }
    }

    // --- FUNÇÃO ABRIR ---
    function openPopup(btn) {
        if (isAnimating || isOpen) return;

        const type = btn.getAttribute('data-type');
        updatePopupContent(type);

        // Se for tipo contato, inicializa o formulário e a animação do botão
        if (type === 'contact') {
            if (window.initPopupForm) window.initPopupForm();

            // Animação para o botão dinâmico do popup
            const popupSubmitBtn = card.querySelector('.form-submit-btn');
            if (popupSubmitBtn) {
                const arrow = popupSubmitBtn.querySelector('.arrow-svg-2');
                const circle = popupSubmitBtn.querySelector('.icon-bg-2');
                if (arrow && circle) {
                    const hoverTl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power3.out" } });
                    hoverTl.to(popupSubmitBtn, {
                        scale: 1.02,
                        backgroundColor: "var(--color-primary-lime-hover)",
                        duration: 0.3
                    })
                        .to(circle, { scale: 1 }, "<")
                        .to(arrow, {
                            rotation: -45,
                            scale: 1.03,
                            stroke: "var(--color-primary-dark)"
                        }, "<");

                    popupSubmitBtn.addEventListener('mouseenter', () => hoverTl.play());
                    popupSubmitBtn.addEventListener('mouseleave', () => hoverTl.reverse());
                }
            }
        }

        lastActiveBtn = btn;
        isOpen = true;

        const rect = btn.getBoundingClientRect();
        btnCenterX = rect.left + rect.width / 2;
        btnCenterY = rect.top + rect.height / 2;

        popupTl.clear();
        gsap.set(card, { clipPath: `circle(0px at ${btnCenterX}px ${btnCenterY}px)` });

        popupTl.to(card, {
            clipPath: `circle(150% at ${btnCenterX}px ${btnCenterY}px)`,
            duration: 0.8,
            ease: "power2.inOut"
        });
        popupTl.play();
    }

    // --- FUNÇÃO FECHAR ---
    function closePopup() {
        if (isAnimating || !isOpen) return;

        const rect = lastActiveBtn.getBoundingClientRect();
        btnCenterX = rect.left + rect.width / 2;
        btnCenterY = rect.top + rect.height / 2;

        const closeTl = gsap.timeline({
            onStart: () => { isAnimating = true; },
            onComplete: () => {
                isAnimating = false;
                isOpen = false;
                body.classList.remove('no-scroll');
                overlay.classList.remove('active');
            }
        });

        closeTl.to(card, {
            clipPath: `circle(0px at ${btnCenterX}px ${btnCenterY}px)`,
            duration: 0.7,
            ease: "power2.inOut"
        });
    }

    // --- EVENT LISTENERS DE ANIMAÇÃO ---
    actionButtons.forEach(btn => {
        // Animação de Hover 
        const arrow = btn.querySelector('.arrow-svg, .arrow-svg-2');
        const circle = btn.querySelector('.icon-bg, .icon-bg-2');

        if (arrow && circle) {
            const hoverTl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power3.out" } });
            // Verificamos o tipo de botão para definir as cores
            const isLime = btn.classList.contains('btn-action-2') || btn.classList.contains('trigger-btn') || btn.classList.contains('form-submit-btn');

            hoverTl.to(btn, {
                scale: 1.02,
                backgroundColor: isLime ? "var(--color-primary-lime-hover)" : "var(--color-primary-dark-hover)",
                duration: 0.3
            })
                .to(circle, { scale: 1 }, "<")
                .to(arrow, {
                    rotation: -45,
                    scale: 1.03,
                    stroke: isLime ? "var(--color-primary-dark)" : "var(--color-primary-lime)"
                }, "<");

            btn.addEventListener('mouseenter', () => hoverTl.play());
            btn.addEventListener('mouseleave', () => hoverTl.reverse());
        }
    });

    // --- EVENT LISTENERS DE POPUP ---
    triggers.forEach(btn => {
        // Clique
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup(btn);
        });
    });

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
});

document.addEventListener('DOMContentLoaded', () => {

    // CONFIGURAÇÕES
    const CONFIG = {
        PLAN_COST: 69.90,
        SAVING_CONSULTA: 200,
        SAVING_PHARMA_PCT: 0.15,
        SAVING_RESTAURANT: 20
    };

    const inputs = {
        consultas: document.getElementById('range-consultas'),
        farmacia: document.getElementById('range-farmacia'),
        restaurantes: document.getElementById('range-restaurantes')
    };

    const displays = {
        valConsultas: document.getElementById('val-consultas'),
        valFarmacia: document.getElementById('val-farmacia'),
        valRestaurantes: document.getElementById('val-restaurantes'),
        total: document.getElementById('total-saved'),
        feedback: document.getElementById('roi-feedback'),
        barSavings: document.getElementById('bar-savings')
    };

    // Função Principal de Cálculo
    function calculateROI() {
        const qtdConsultas = parseInt(inputs.consultas.value);
        const gastoFarmacia = parseInt(inputs.farmacia.value);
        const qtdRestaurantes = parseInt(inputs.restaurantes.value);

        // Atualiza textos
        displays.valConsultas.innerText = qtdConsultas;
        displays.valFarmacia.innerText = gastoFarmacia;
        displays.valRestaurantes.innerText = qtdRestaurantes;

        // Cálculos
        const econConsultas = qtdConsultas * CONFIG.SAVING_CONSULTA;
        const econFarmacia = gastoFarmacia * CONFIG.SAVING_PHARMA_PCT;
        const econRestaurantes = qtdRestaurantes * CONFIG.SAVING_RESTAURANT;

        const totalSavings = econConsultas + econFarmacia + econRestaurantes;
        const timesPaid = (totalSavings / CONFIG.PLAN_COST).toFixed(1);

        // Renderiza Total
        // Formatação brasileira de moeda
        displays.total.innerText = totalSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Lógica da Barra
        // Defini o teto visual como R$ 600,00 para a barra encher, ou 5x o custo
        const maxGraphValue = 600;
        let barHeightPct = (totalSavings / maxGraphValue) * 100;
        if (barHeightPct > 100) barHeightPct = 100;
        if (barHeightPct < 5 && totalSavings > 0) barHeightPct = 5; // Mínimo visual

        displays.barSavings.style.height = `${barHeightPct}%`;

        // Feedback
        if (totalSavings < CONFIG.PLAN_COST) {
            displays.feedback.innerText = "Ainda não cobre o custo...";
        } else {
            displays.feedback.innerText = `Seu plano se paga ${timesPaid}x!`;
        }
    }

    // Listeners
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateROI);
    });

    // Inicialização
    calculateROI();
});

document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DO FORMULÁRIO WHATSAPP (PADRONIZADA) ---
    const whatsappNumber = "5548996749236";

    function setupWhatsappForm(formId, config) {
        const form = document.getElementById(formId);
        if (!form) return;

        const nomeInput = document.getElementById(config.nomeId);
        const telInput = document.getElementById(config.telId);
        const emailInput = document.getElementById(config.emailId);
        const submitBtn = form.querySelector('button[type="submit"]');

        function validateForm() {
            if (!nomeInput || !telInput || !emailInput) return true;

            const nome = nomeInput.value.trim();
            const tel = telInput.value.trim();
            const email = emailInput.value.trim();

            let isValid = true;

            // Limpa estados anteriores
            [nomeInput, telInput, emailInput].forEach(inp => inp.classList.remove('invalid'));

            if (nome.length < 3) {
                nomeInput.classList.add('invalid');
                isValid = false;
            }
            if (tel.length < 10) {
                telInput.classList.add('invalid');
                isValid = false;
            }
            if (!email.includes('@')) {
                emailInput.classList.add('invalid');
                isValid = false;
            }

            return isValid;
        }

        if (telInput) {
            telInput.addEventListener('input', (e) => {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm()) {
                alert("Por favor, preencha todos os campos obrigatórios corretamente.");
                return;
            }

            const nome = nomeInput.value.trim();
            const message = `Olá! Vim do site MilleniumPREV e quero conhecer mais sobre os planos de proteção familiar. Meu nome: ${nome}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Inicializa o formulário da seção de contato
    setupWhatsappForm('whatsappForm', {
        nomeId: 'nome',
        telId: 'telefone',
        emailId: 'email'
    });

    // Como o formulário do popup é injetado dinamicamente, precisamos inicializá-lo 
    // toda vez que o popup 'contact' for aberto.
    // Vamos usar um Observer ou simplesmente chamar a função no openPopup.

    // Vou exportar ou tornar acessível para o escopo do openPopup
    window.initPopupForm = () => {
        setupWhatsappForm('popupWhatsappForm', {
            nomeId: 'popup-nome',
            telId: 'popup-telefone',
            emailId: 'popup-email'
        });
    };
    // --- LÓGICA DO FAQ (ACCORDION GSAP) ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const inner = item.querySelector('.faq-answer-inner');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Fecha outros se estiverem abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    gsap.to(otherAnswer, { height: 0, duration: 0.4, ease: "power2.inOut" });
                    otherItem.classList.remove('active');
                }
            });

            // Toggle item atual
            if (isOpen) {
                gsap.to(answer, { height: 0, duration: 0.4, ease: "power2.inOut" });
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                gsap.to(answer, {
                    height: inner.offsetHeight,
                    duration: 0.6,
                    ease: "power3.out"
                });
            }
        });
    });

    // --- LÓGICA DO MARQUEE INFINITO (FOOTER) ---
    const marqueeContent = document.querySelector('.footer-marquee-content');
    if (marqueeContent) {
        // Duplicamos o conteúdo para garantir o loop infinito sem buracos
        const content = marqueeContent.innerHTML;
        marqueeContent.innerHTML += content;

        gsap.to(marqueeContent, {
            xPercent: -50,
            repeat: -1,
            duration: 17,
            ease: "none"
        });
    }
});