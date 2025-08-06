document.addEventListener('DOMContentLoaded', () => {
    
    const infractions = [
        { title: 'PG', time: 20 }, { title: 'Evadir Rol', time: 40 },
        { title: 'PG Masivo', time: 40 }, { title: 'DM', time: 25 },
        { title: 'DM Masivo', time: 35 }, { title: 'VDM', time: 20 },
        { title: 'VDM Masivo', time: 30 }, { title: 'MG', time: 20 },
        { title: 'RK', time: 30 }, { title: 'CJ', time: 25 },
        { title: 'No valorar vida', time: 25 }, { title: 'No respetar rol de entorno', time: 20 },
        { title: 'Usar arma no debida en ciudad', time: 15 }, { title: 'Forzar rol', time: 25 },
        { title: 'No respetar el mínimo de integrantes en un robo', time: 20 }, { title: 'No respetar los 3 avisos de tirador', time: 20 },
        { title: 'Cortar rol', time: 25 }, { title: 'Campear zona', time: 15 },
        { title: 'Matar a un Staff en reporte', time: 15 }, { title: 'Robar a Trabajo legal', time: 20 },
        { title: 'Spam del /anon o comandos', time: 30 }, { title: 'Mal uso del /me o /do', time: 10 },
        { title: 'Mentir en reporte', time: 15 }, { title: 'Mal uso del F5-F6', time: 25 },
        { title: 'Aprovecharse de bugs', time: 70 }, { title: 'Abusar de animaciones para beneficio propio', time: 20 },
        { title: 'Incumplimiento de normativa', time: 20 }, { title: 'Evadir Soporte', time: 40 },
        { title: 'No respetar el tiempo de espera de una zona a la otra', time: 25 },
    ];

    let state = { status: 'ONLINE', selectedInfractions: [] };
    let limitAlertShown = false;

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const grid = document.getElementById('infractions-grid');
    const onlineBtn = document.querySelector('.btn-status[data-status="ONLINE"]');
    const offlineBtn = document.querySelector('.btn-status[data-status="OFFLINE"]');
    const statusGroup = document.getElementById('status-group');
    const playerIdInput = document.getElementById('player-id-input');
    const playerIdLabel = document.getElementById('player-id-label');
    const byInput = document.getElementById('by-input');
    const timeInput = document.getElementById('time-input');
    const reasonsSummary = document.getElementById('reasons-summary');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-command-btn');

    const commandModal = document.getElementById('command-modal');
    const commandOutput = document.getElementById('command-output');
    
    const alertModal = document.getElementById('alert-modal');
    const alertTitle = document.getElementById('alert-title');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');
    
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    // --- LÓGICA DE LA INTERFAZ ---

    function moveSlider() {
        const activeButton = document.querySelector('.btn-status.active');
        if (activeButton) {
            statusGroup.style.setProperty('--slider-left', `${activeButton.offsetLeft}px`);
            statusGroup.style.setProperty('--slider-width', `${activeButton.offsetWidth}px`);
        }
    }

    function updateStatusUI() {
        if (state.status === 'ONLINE') {
            onlineBtn.classList.add('active');
            offlineBtn.classList.remove('active');
            playerIdLabel.textContent = 'ID';
            playerIdInput.placeholder = 'Ej: 222';
        } else {
            offlineBtn.classList.add('active');
            onlineBtn.classList.remove('active');
            playerIdLabel.textContent = 'Licencia';
            playerIdInput.placeholder = 'license:a1b2c3d4e5f6...';
        }
        moveSlider();
    }

    function setStatus(newStatus) {
        state.status = newStatus;
        updateStatusUI();
    }

    function updateSummary() {
        const totalTime = state.selectedInfractions.reduce((sum, infraction) => sum + infraction.time, 0);
        timeInput.value = totalTime > 0 ? totalTime : '';

        if (totalTime > 180 && !limitAlertShown) {
            showCustomAlert('Límite de Tiempo en la Cárcel: 180 - Una vez superado el Límite se deberá Banear', 'Límite Superado');
            limitAlertShown = true; 
        } 
        else if (totalTime <= 180) {
            limitAlertShown = false;
        }

        if (state.selectedInfractions.length === 0) {
            reasonsSummary.textContent = 'Ninguna sanción seleccionada.';
            reasonsSummary.style.fontStyle = 'italic';
        } else {
            reasonsSummary.textContent = state.selectedInfractions.map(inf => inf.title).join(' + ');
            reasonsSummary.style.fontStyle = 'normal';
        }
    }

    function handleCardClick(card, infraction) {
        const index = state.selectedInfractions.findIndex(item => item.title === infraction.title);
        
        if (index > -1) {
            state.selectedInfractions.splice(index, 1);
            card.classList.remove('selected');
        } 
        else {
            const currentTotalTime = state.selectedInfractions.reduce((sum, inf) => sum + inf.time, 0);
            // --- CAMBIO #2: El bloqueo ahora se activa si el tiempo a añadir SUPERA 180 ---
            if ((currentTotalTime + infraction.time) > 180) {
                showCustomAlert('Al añadir esta sanción superarás el límite de 180 minutos. No puedes añadirla.', 'Límite Superado');
                return;
            }
            state.selectedInfractions.push(infraction);
            card.classList.add('selected');
        }
        updateSummary();
    }
    
    function showCustomAlert(message, title = 'Error') {
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        alertModal.classList.add('visible');
    }
    
    function generateCommand() {
        const playerId = playerIdInput.value.trim();
        const sanctionedBy = byInput.value.trim();
        const totalTime = timeInput.value;
        const reason = state.selectedInfractions.map(inf => inf.title).join(', ');

        if (!playerId || state.selectedInfractions.length === 0) {
            showCustomAlert('Poné una ID/Licencia y seleccioná al menos una sanción.', 'Faltan Datos');
            return;
        }
        if (!sanctionedBy) {
            showCustomAlert('Poné un "By".', 'Faltan Datos');
            return;
        }
        
        if (state.status === 'ONLINE') {
            const isNumeric = /^[0-9]+$/.test(playerId);
            if (!isNumeric) {
                showCustomAlert('El ID solo puede tener números.');
                return;
            }
        } else {
             if (!playerId.startsWith('license:')) {
                showCustomAlert('La licencia debe comenzar con "license:".');
                return;
            }
        }
        
        const commandPrefix = state.status === 'ONLINE' ? '/carcel' : '/carceloffline';
        const finalCommand = `${commandPrefix} ${playerId} ${totalTime} ${reason} by ${sanctionedBy}`;

        commandOutput.textContent = finalCommand;
        commandModal.classList.add('visible');
    }

    function resetForm() {
        playerIdInput.value = '';
        state.selectedInfractions = [];
        limitAlertShown = false; 
        document.querySelectorAll('.infraction-card.selected').forEach(card => card.classList.remove('selected'));
        setStatus('ONLINE');
        updateSummary();
        playerIdInput.focus();
    }

    function copyCommand() {
        navigator.clipboard.writeText(commandOutput.textContent).then(() => {
            copyBtn.textContent = 'Copiado';
            copyBtn.style.backgroundColor = 'var(--success-color)';
            setTimeout(() => {
                copyBtn.textContent = 'Copiar';
                copyBtn.style.backgroundColor = 'var(--accent-color)';
            }, 2000);
        });
    }

    function populateGrid() {
        infractions.forEach(infraction => {
            const card = document.createElement('div');
            card.classList.add('infraction-card');
            card.innerHTML = `<h3 class="infraction-title">${infraction.title}</h3><p class="infraction-time">${infraction.time} min</p>`;
            card.addEventListener('click', () => handleCardClick(card, infraction));
            grid.appendChild(card);
        });
    }
    
    function closeAllModals() {
        commandModal.classList.remove('visible');
        alertModal.classList.remove('visible');
    }

    // --- INICIALIZACIÓN Y EVENT LISTENERS ---
    onlineBtn.addEventListener('click', () => setStatus('ONLINE'));
    offlineBtn.addEventListener('click', () => setStatus('OFFLINE'));
    resetBtn.addEventListener('click', resetForm);
    generateBtn.addEventListener('click', generateCommand);
    copyBtn.addEventListener('click', copyCommand);
    
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
    alertOkBtn.addEventListener('click', closeAllModals);
    commandModal.addEventListener('click', (e) => { if (e.target === commandModal) closeAllModals(); });
    alertModal.addEventListener('click', (e) => { if (e.target === alertModal) closeAllModals(); });
    
    window.addEventListener('resize', moveSlider);

    populateGrid();
    updateStatusUI();
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { particles: { number: { value: 60 }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.5, random: true }, size: { value: 2, random: true }, move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out" } }, retina_detect: true });
    }
});