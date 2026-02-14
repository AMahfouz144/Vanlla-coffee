const ProductCard = (product) => {
    return `
        <div class="product-card">
            <div class="product-image">
                <a href="#/details?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <a href="#/details?id=${product.id}">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                <div class="product-actions">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

export default ProductCard;
