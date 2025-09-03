document.addEventListener('DOMContentLoaded', function() {
            const botCards = document.querySelectorAll('.bot-card');
            botCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
            });
        });

        document.addEventListener("DOMContentLoaded", () => {
        const popup = document.getElementById("tos-popup");
        const closeBtn = document.getElementById("close-tos");

        closeBtn.addEventListener("click", () => {
            popup.style.animation = "fadeOut 0.5s ease forwards";
            setTimeout(() => popup.remove(), 500);
        });
        });

        document.addEventListener("DOMContentLoaded", () => {
        const discountPopup = document.getElementById("discount-popup");
        const closeDiscountBtn = document.getElementById("close-discount");

        if (closeDiscountBtn) {
            closeDiscountBtn.addEventListener("click", () => {
            discountPopup.style.animation = "fadeOut 0.5s ease forwards";
            setTimeout(() => discountPopup.remove(), 500);
            });
        }
        });