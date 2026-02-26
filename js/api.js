const BASE_URL = 'http://localhost:3000/api';

const api = {
    /**
     * Fetch all products. Pass a category string to filter.
     * Mirrors: GET /api/products or GET /api/products?category=Coffee
     */
    getProducts: async () => {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    },

    /**
     * Fetch a single product by id.
     * Mirrors: GET /api/products/:id
     */
    getProductById: async (id) => {
        const res = await fetch(`${BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Product ${id} not found`);
        return res.json();
    },

    /**
     * Fetch products filtered by category.
     * Passes ?category= query param to the backend.
     * Mirrors: GET /api/products?category=Coffee
     */
    getProductsByCategory: async (category) => {
        const url = (!category || category === 'All')
            ? `${BASE_URL}/products`
            : `${BASE_URL}/products?category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products by category');
        return res.json();
    },

    /**
     * POST /api/auth/register
     * Body: { name, email, password }
     */
    register: async (name, email, password) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        return data;
    },

    /**
     * POST /api/auth/login
     * Body: { email, password }
     */
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        return data;
    },

    /**
     * POST /api/orders
     * Body: { items: [...], shipping: { name, address, city } }
     */
    placeOrder: async (items, shipping) => {
        const res = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, shipping })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order failed');
        return data;
    },

    /**
     * POST /api/contact
     * Body: { name, email, message }
     */
    sendContact: async (name, email, message) => {
        const res = await fetch(`${BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send message');
        return data;
    }
};

export default api;
