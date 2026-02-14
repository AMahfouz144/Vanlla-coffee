const Modal = {
    init: () => {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modal-container')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }
    },

    show: ({ title, message, onClose }) => {
        Modal.init();
        const container = document.getElementById('modal-container');
        
        container.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="modal-title">${title}</h2>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" id="modal-ok-btn">OK</button>
                </div>
            </div>
        `;

        // Trigger reflow to enable transition
        container.offsetHeight;
        container.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        const close = () => {
            container.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                container.innerHTML = '';
                if (onClose) onClose();
            }, 300); // Wait for transition
        };

        const overlay = container.querySelector('.modal-overlay');
        const okBtn = document.getElementById('modal-ok-btn');

        overlay.addEventListener('click', close);
        okBtn.addEventListener('click', close);

        // Auto close (optional)
        // setTimeout(close, 3000);
    }
};

export default Modal;
