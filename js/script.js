document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('header');
    const body = document.body; 
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                body.classList.add('page-scrolled'); 
            } else {
                header.classList.remove('scrolled');
                body.classList.remove('page-scrolled');
            }
        });


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

const currencySwitcher = document.querySelector('.currency-switcher');
if (currencySwitcher) {
    const currencyBtns = currencySwitcher.querySelectorAll('.currency-btn');
    const allPrices = document.querySelectorAll('.pricing__card__price');
    const slidingPill = currencySwitcher.querySelector('.sliding-pill');

    function animateValue(element, start, end, duration) {
        if (!element) return;
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
    
    function movePill() {
        const activeButton = currencySwitcher.querySelector('.currency-btn.active');
        if (activeButton && slidingPill) {
            slidingPill.style.width = activeButton.offsetWidth + 'px';
            const parentPadding = parseFloat(window.getComputedStyle(activeButton.parentElement).paddingLeft);
            slidingPill.style.transform = `translateX(${activeButton.offsetLeft - parentPadding}px)`;
        }
    }
    setTimeout(movePill, 100); 

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            movePill();

            const targetCurrency = btn.dataset.currency;

            allPrices.forEach(priceEl => {
                const valueSpan = priceEl.querySelector('.price-value');
                if (!valueSpan) return;
                
                const startValue = parseInt(valueSpan.textContent.replace(/\./g, ''));
                
                const endValue = (targetCurrency === 'ars') 
                    ? parseInt(priceEl.dataset.priceArs) 
                    : parseInt(priceEl.dataset.priceUsd);

                if (!isNaN(startValue) && !isNaN(endValue)) {
                    animateValue(valueSpan, startValue, endValue, 500);
                }
            });
        });
    });
}

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

    const animatedElements = document.querySelectorAll('.anim-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    }
}); 
