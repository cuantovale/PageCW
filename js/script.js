document.addEventListener('DOMContentLoaded', function() {

    // --- Animación de Scroll para Header ---
    const header = document.getElementById('header');
    const body = document.body; // Nos aseguramos de tener el body
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                body.classList.add('page-scrolled'); // <-- LÍNEA AÑADIDA
            } else {
                header.classList.remove('scrolled');
                body.classList.remove('page-scrolled'); // <-- LÍNEA AÑADIDA
            }
        });


    // --- Lógica del Menú Móvil ---
    const mobileMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const body = document.body;

    if (navToggle && mobileMenu && navClose) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.add('show-menu');
            body.classList.add('body-no-scroll');
        });

        navClose.addEventListener('click', () => {
            mobileMenu.classList.remove('show-menu');
            body.classList.remove('body-no-scroll');
        });
    }
    
    // --- Tabs de la página de Comandos ---
    const tabs = document.querySelectorAll('.commands__nav-btn');
    const all_content = document.querySelectorAll('.commands__content');

    if (tabs.length > 0 && all_content.length > 0) {
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => { t.classList.remove('active'); });
                tab.classList.add('active');

                all_content.forEach(content => { content.classList.remove('active'); });
                if (all_content[index]) {
                    all_content[index].classList.add('active');
                }
            });
        });
    }

// --- Lógica para el Selector de Moneda (con Descuento y Animación de Botón) ---
const currencySwitcher = document.querySelector('.currency-switcher');
if (currencySwitcher) {
    const currencyBtns = currencySwitcher.querySelectorAll('.currency-btn');
    const allPrices = document.querySelectorAll('.pricing__card__price');
    const slidingPill = currencySwitcher.querySelector('.sliding-pill');

    // Función que anima un número de un valor inicial a uno final
    function animateValue(element, start, end, duration) {
        if (!element) return; // Si el elemento no existe, no hace nada
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue.toLocaleString('es-AR');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Función para mover la píldora del botón
    function movePill() {
        const activeButton = currencySwitcher.querySelector('.currency-btn.active');
        if (activeButton && slidingPill) {
            slidingPill.style.width = activeButton.offsetWidth + 'px';
            slidingPill.style.transform = `translateX(${activeButton.offsetLeft}px)`;
            // Ajuste para el padding del contenedor
            const parentPadding = parseFloat(window.getComputedStyle(activeButton.parentElement).paddingLeft);
            slidingPill.style.transform = `translateX(${activeButton.offsetLeft - parentPadding}px)`;
        }
    }
    
    // Posiciona la píldora correctamente al cargar la página
    setTimeout(movePill, 100); 

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            movePill(); // Mueve la píldora al hacer clic

            const targetCurrency = btn.dataset.currency;

            allPrices.forEach(priceEl => {
                const originalValueSpan = priceEl.querySelector('.price-value-original');
                const saleValueSpan = priceEl.querySelector('.price-value');
                
                // Leemos los valores iniciales para animar desde ahí
                const startOriginal = originalValueSpan ? parseInt(originalValueSpan.textContent.replace(/\./g, '')) : 0;
                const startSale = saleValueSpan ? parseInt(saleValueSpan.textContent.replace(/\./g, '')) : 0;

                // Leemos los valores finales correctos usando camelCase
                let endOriginal, endSale;
                if (targetCurrency === 'ars') {
                    endOriginal = parseInt(priceEl.dataset.priceArsOriginal);
                    endSale = parseInt(priceEl.dataset.priceArsSale);
                } else {
                    endOriginal = parseInt(priceEl.dataset.priceUsdOriginal);
                    endSale = parseInt(priceEl.dataset.priceUsdSale);
                }

                // Animamos los valores si existen
                if (!isNaN(endSale)) {
                    animateValue(saleValueSpan, startSale, endSale, 500);
                }
                if (!isNaN(endOriginal)) {
                    animateValue(originalValueSpan, startOriginal, endOriginal, 500);
                }
            });
        });
    });
}

    // --- Lógica para el botón "Volver Arriba" ---
    const scrollUp = document.getElementById('scroll-up');
    if (scrollUp) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 400) {
                scrollUp.classList.add('show-scroll');
            } else {
                scrollUp.classList.remove('show-scroll');
            }
        });
    }
    
    // --- Lógica para la Animación de Changelogs ---
    const changelogSummaries = document.querySelectorAll('.changelog__summary');
    if (changelogSummaries.length > 0) {
        changelogSummaries.forEach(summary => {
            summary.addEventListener('click', (event) => {
                event.preventDefault();
                const details = summary.parentElement;
                const content = summary.nextElementSibling;
                if (details.hasAttribute('open')) {
                    details.classList.add('is-closing');
                    content.addEventListener('animationend', () => {
                        details.removeAttribute('open');
                        details.classList.remove('is-closing');
                    }, { once: true });
                } else {
                    details.setAttribute('open', '');
                }
            });
        });
    }

    // --- Lógica para activar animaciones al hacer scroll ---
    const animatedElements = document.querySelectorAll('.anim-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añade la clase 'is-visible' para activar la animación
                    entry.target.classList.add('is-visible');
                    // Opcional: deja de observar el elemento una vez animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // La animación se activa cuando el 10% del elemento es visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    }
}); // Cierre del 'DOMContentLoaded'
