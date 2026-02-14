import api from '../js/api.js';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import store from '../js/state.js';

const Details = {
    render: async (props) => {
        const id = props.id;
        const product = await api.getProductById(id);
        const navbar = await Navbar.render();
        const footer = await Footer.render();

        return `
            ${navbar}
            <div class="container product-details">
                <div class="details-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="details-info">
                    <h1>${product.name}</h1>
                    <p class="product-category">${product.category}</p>
                    <p class="details-price">$${product.price.toFixed(2)}</p>
                    <p class="mb-4">${product.description}</p>
                    
                    <div class="quantity-selector">
                        <button class="qty-btn" id="qty-minus">-</button>
                        <span id="qty-val">1</span>
                        <button class="qty-btn" id="qty-plus">+</button>
                    </div>

                    <button class="btn btn-primary" id="add-cart-detail">Add to Cart</button>
                    
                    <div id="success-msg" style="display:none; color: green; margin-top: 10px;">
                        Added to cart!
                    </div>
                </div>
            </div>
            ${footer}
        `;
    },

    afterRender: async (props) => {
        await Navbar.afterRender();
        const id = props.id;
        const product = await api.getProductById(id);
        
        // Quantity Logic
        let quantity = 1;
        const qtyVal = document.getElementById('qty-val');
        const minusBtn = document.getElementById('qty-minus');
        const plusBtn = document.getElementById('qty-plus');
        const addBtn = document.getElementById('add-cart-detail');
        const successMsg = document.getElementById('success-msg');

        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyVal.textContent = quantity;
            }
        });

        plusBtn.addEventListener('click', () => {
            quantity++;
            qtyVal.textContent = quantity;
        });

        addBtn.addEventListener('click', () => {
            store.addToCart(product, quantity);
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 2000);
        });
    }
};

export default Details;
