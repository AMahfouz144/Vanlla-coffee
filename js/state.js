const initialState = {
    user: null,
    cart: [],
    products: []
};

class Store {
    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // specific actions
    addToCart(product, quantity = 1) {
        const currentCart = this.state.cart;
        const existingItem = currentCart.find(item => item.id === product.id);

        let newCart;
        if (existingItem) {
            newCart = currentCart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...currentCart, { ...product, quantity }];
        }

        this.setState({ cart: newCart });
    }

    removeFromCart(productId) {
        const newCart = this.state.cart.filter(item => item.id !== productId);
        this.setState({ cart: newCart });
    }
    
    updateCartQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        const newCart = this.state.cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
        );
        this.setState({ cart: newCart });
    }

    clearCart() {
        this.setState({ cart: [] });
    }
}

const store = new Store(initialState);
export default store;
