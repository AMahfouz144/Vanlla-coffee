import store from '../js/state.js';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import Modal from '../components/modal.js';

const Order = {
    render: async () => {
        const state = store.getState();
        const cart = state.cart;
        const navbar = await Navbar.render();
        const footer = await Footer.render();
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cart.length === 0) {
             return `
                ${navbar}
                <div class="container text-center" style="padding: 4rem 0;">
                    <h2>Your cart is empty.</h2>
                    <p class="mb-4">Add some products before checkout.</p>
                    <a href="#/" class="btn btn-primary">Go Shopping</a>
                </div>
                ${footer}
            `;
        }

        return `
            ${navbar}
            <div class="container order-page" style="margin: 4rem auto;">
                <h1 class="mb-8 text-center" style="color: var(--primary-color);">Checkout</h1>
                <div class="flex" style="gap: 4rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <h3 class="mb-4">Shipping Information</h3>
                        <form id="order-form">
                            <div class="mb-4">
                                <label style="display: block; margin-bottom: 0.5rem;">Full Name</label>
                                <input type="text" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                            </div>
                            <div class="mb-4">
                                <label style="display: block; margin-bottom: 0.5rem;">Address</label>
                                <input type="text" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                            </div>
                            <div class="mb-4">
                                <label style="display: block; margin-bottom: 0.5rem;">City</label>
                                <input type="text" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                            </div>
                             <div class="mb-4">
                                <label style="display: block; margin-bottom: 0.5rem;">Card Number (Fake)</label>
                                <input type="text" placeholder="0000 0000 0000 0000" style="width: 100%; padding: 0.8rem; border: 1px solid var(--gray-light); border-radius: var(--radius);" required>
                            </div>
                             <button type="submit" class="btn btn-primary" style="width: 100%;">Place Order ($${total.toFixed(2)})</button>
                        </form>
                    </div>
                    <div style="flex: 1; min-width: 300px; background: var(--white); padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); height: fit-content;">
                        <h3 class="mb-4">Order Summary</h3>
                        ${cart.map(item => `
                            <div class="flex justify-between items-center mb-4" style="border-bottom: 1px solid var(--gray-light); padding-bottom: 1rem;">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="flex justify-between items-center" style="font-weight: 700; font-size: 1.2rem; margin-top: 1rem;">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();
        const form = document.getElementById('order-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                store.clearCart();
                
                Modal.show({
                    title: 'Order Successfully Placed!',
                    message: "Your order has been successfully added. We’re preparing it with care ☕",
                    onClose: () => {
                        window.location.hash = '/';
                    }
                });
            });
        }
    }
};

export default Order;
