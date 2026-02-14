import store from '../js/state.js';

const Navbar = {
    render: async () => {
        const cartCount = store.getState().cart.reduce((total, item) => total + item.quantity, 0);

        return `
            <nav class="navbar">
                <div class="container flex justify-between items-center" style="position: relative;">
                    <a href="#/" class="logo" data-scroll="#top">
                        <h2 style="color: var(--primary-color);">Vanilla <span style="color: var(--secondary-color);">Coffee</span></h2>
                    </a>
                    
                    <div class="hamburger" id="hamburger">
                        <i class="fas fa-bars"></i>
                    </div>

                    <ul class="nav-links flex" id="nav-links">
                        <li><a href="#/" class="nav-link" data-scroll="#top">Home</a></li>
                        <li><a href="#/" class="nav-link" data-scroll="#about">About</a></li>
                        <li><a href="#/" class="nav-link" data-scroll="#menu">Menu</a></li>
                        <li><a href="#/" class="nav-link" data-scroll="#contact">Contact</a></li>
                    </ul>

                    <div class="nav-icons flex items-center">
                        <a href="#/login"><i class="fas fa-user"></i></a>
                        <a href="#/cart" class="cart-icon">
                            <i class="fas fa-shopping-bag"></i>
                            <span class="cart-count" id="cart-badge">${cartCount}</span>
                        </a>
                    </div>
                </div>
            </nav>
        `;
    },

    afterRender: async () => {
        store.subscribe((state) => {
            const count = state.cart.reduce((total, item) => total + item.quantity, 0);
            const badge = document.getElementById('cart-badge');
            if (badge) badge.textContent = count;
        });

        // Mobile Menu Logic
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Smooth Scroll & Link Click Logic
        const links = document.querySelectorAll('a[data-scroll]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                const targetId = link.getAttribute('data-scroll');
                const isHome = window.location.hash === '' || window.location.hash === '#/';

                // If on home page, prevent default and scroll
                if (isHome) {
                    e.preventDefault();
                    const target = document.querySelector(targetId === '#top' ? 'body' : targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // If not on home, route with query param
                    if (targetId !== '#top') {
                        e.preventDefault();
                        window.location.hash = `/?section=${targetId.substring(1)}`;
                    } 
                }
            });
        });
    }
};

export default Navbar;
