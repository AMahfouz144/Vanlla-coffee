import products from '../data/products.js';

const api = {
    getProducts: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(products);
            }, 300); // Simulate network latency
        });
    },

    getProductById: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = products.find(p => p.id === parseInt(id));
                if (product) {
                    resolve(product);
                } else {
                    reject(new Error('Product not found'));
                }
            }, 300);
        });
    },

    getProductsByCategory: (category) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!category || category === 'All') {
                    resolve(products);
                } else {
                    const filtered = products.filter(p => p.category === category);
                    resolve(filtered);
                }
            }, 300);
        });
    }
};

export default api;
