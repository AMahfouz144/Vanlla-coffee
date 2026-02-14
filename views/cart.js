import store from '../js/state.js';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';

const Cart = {
    render: async () => {
        const state = store.getState();
        const cart = state.cart;
        const navbar = await Navbar.render();
        const footer = await Footer.render();

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const cartItems = cart.length === 0 
            ? '<p class="text-center">Your cart is empty.</p>' 
            : cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div>
                        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="update-qty" style="width: 50px; padding: 5px;">
                    </div>
                    <div>
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div>
                        <button class="remove-btn" data-id="${item.id}" style="color: red;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

        return `
            ${navbar}
            <div class="container cart-page">
                <h1 class="mb-8 text-center" style="color: var(--primary-color);">Shopping Cart</h1>
                <div id="cart-items">
                    ${cartItems}
                </div>
                ${cart.length > 0 ? `
                    <div class="cart-total">
                        Total: $${total.toFixed(2)}
                    </div>
                    <div class="text-center mt-8">
                        <a href="#/order" class="btn btn-primary">Proceed to Checkout</a>
                    </div>
                ` : ''}
            </div>
            ${footer}
        `;
    },

    afterRender: async () => {
        await Navbar.afterRender();

        const updateInputs = document.querySelectorAll('.update-qty');
        const removeBtns = document.querySelectorAll('.remove-btn');

        updateInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const qty = parseInt(e.target.value);
                store.updateCartQuantity(id, qty);
                Cart.refresh();
            });
        });

        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id); // Use currentTarget for button with icon
                store.removeFromCart(id);
                Cart.refresh();
            });
        });
    },

    refresh: async () => {
        // Simple re-render logic. ideally invoke router or re-render component in place
        // For simplicity, reload the route
        window.location.reload(); 
        // Or re-render the app:
        // const content = await Cart.render();
        // document.getElementById('app').innerHTML = content;
        // await Cart.afterRender();
    }
};

export default Cart;
