import api from '../js/api.js';
import ProductCard from '../components/productCard.js';
import ProductSlider from '../components/productSlider.js';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import store from '../js/state.js';

const Home = {
    render: async () => {
        const products = await api.getProducts();
        const navbar = await Navbar.render();
        const footer = await Footer.render();

        return `
            ${navbar}

            ${ProductSlider.render(products)}

            <div class="container mb-8" id="menu">
                <h2 class="text-center mb-8" style="font-size: 2rem; color: var(--primary-color);">Our Products</h2>
                
                <div class="filters">
                    <button class="filter-btn active" data-filter="All">All</button>
                    <button class="filter-btn" data-filter="Coffee">Coffee</button>
                    <button class="filter-btn" data-filter="Desserts">Desserts</button>
                    <button class="filter-btn" data-filter="Drinks">Drinks</button>
                </div>

                <div class="product-grid" id="grid-container">
                    ${products.map(product => ProductCard(product)).join('')}
                </div>
            </div>

            <!-- About Section -->
            <section id="about">
                <div class="container">
                    <h2 class="section-title">Our Story</h2>
                    <div class="about-content">
                        <p class="mb-4">
                            At Vanilla Coffee, we believe that every cup tells a story. Founded in 2026, our mission has been simple: 
                            to source the finest beans from sustainable farms and roast them to perfection.
                        </p>
                        <p>
                            We are more than just a coffee shop; we are a community of coffee lovers dedicated to the craft 
                            of brewing. Whether you're here for a quick espresso or a relaxing afternoon with a latte, 
                            we promise an experience that awakens your senses.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section id="contact">
                <div class="container">
                    <h2 class="section-title">Contact Us</h2>
                    <div class="contact-form">
                        <form id="contact-form">
                            <div class="form-group">
                                <label for="contact-name">Name</label>
                                <input type="text" id="contact-name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email</label>
                                <input type="email" id="contact-email" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-message">Message</label>
                                <textarea id="contact-message" required></textarea>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();
        ProductSlider.afterRender();

        // Shop Now Scroll Logic
        const shopBtn = document.getElementById('shop-now-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const menuSection = document.getElementById('menu');
                if (menuSection) {
                    menuSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Handle URL params for scrolling (e.g. ?section=about)
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const section = urlParams.get('section');
        if (section) {
            setTimeout(() => {
                const target = document.getElementById(section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100); // Slight delay to ensure render
        }

        // Contact Form Logic
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('contact-name').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                const message = document.getElementById('contact-message').value.trim();
                const submitBtn = contactForm.querySelector('button[type="submit"]');

                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                try {
                    await api.sendContact(name, email, message);
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    alert('Message sent successfully! We will get back to you soon.');
                } catch (err) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    alert('Failed to send message. Please try again.');
                }
            });
        }

        // Filter Logic
        const gridContainer = document.getElementById('grid-container');
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const category = e.target.dataset.filter;
                const products = await api.getProductsByCategory(category);
                
                gridContainer.innerHTML = products.map(product => ProductCard(product)).join('');
                
                // Re-attach listeners for new elements
                Home.attachCartListeners();
            });
        });

        Home.attachCartListeners();
    },

    attachCartListeners: () => {
        const addBtns = document.querySelectorAll('.add-to-cart-btn');
        addBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                // find product details
                // To avoid fetching again, we could store current products in state or closure
                // For simplicity, fetch by ID or use the data we have if accessible
                
                // Better approach: Since we rendered them, we can get data from API again or passed props
                // Let's fetch by ID to be safe and clean
                try {
                    const product = await api.getProductById(id);
                    store.addToCart(product);
                    
                    // visual feedback could be added here
                    const icon = btn.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        icon.className = 'fas fa-plus';
                    }, 1000);

                } catch (err) {
                    console.error(err);
                }
            });
        });
    }
};

export default Home;
