document.addEventListener('DOMContentLoaded', function() {
    // Efecto de brillo en tarjetas
    const interactiveCards = document.querySelectorAll('.bot-card, .discord-widget-vertical');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Lógica para cerrar los popups con animación
    const popupsToHandle = [
        { popupId: 'tos-popup', closeId: 'close-tos' },
        { popupId: 'discount-popup', closeId: 'close-discount' }
    ];

    popupsToHandle.forEach(({ popupId, closeId }) => {
        const popupElement = document.getElementById(popupId);
        const closeBtn = document.getElementById(closeId);

        if (popupElement && closeBtn) {
            closeBtn.addEventListener("click", () => {
                // 1. Añadimos una clase para iniciar la animación de colapso
                popupElement.classList.add('closing');
                // 2. Escuchamos a que la transición CSS termine para eliminar el elemento
                popupElement.addEventListener('transitionend', () => popupElement.remove(), { once: true });
            });
        }
    });

    // Lógica para animaciones de aparición al hacer scroll
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Cuando el elemento entra en la vista, se añade la clase para la animación.
            // Cuando sale, se quita para que la animación pueda repetirse.
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.1 // La animación se activa cuando al menos un 10% del elemento es visible.
    });

    // Aplicar el observador a todos los elementos que queremos animar.
    const elementsToAnimate = document.querySelectorAll('.anim-on-scroll');
    elementsToAnimate.forEach(element => animationObserver.observe(element));
});