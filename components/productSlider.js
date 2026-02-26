/**
 * ProductSlider – Infinite Autoplay (CSS-only animation)
 *
 * Technique:
 *   • Render the card list TWICE in the track (double-list clone).
 *   • CSS @keyframes translates the track by -50 % → seamless loop.
 *   • Hover pauses the animation (animation-play-state: paused).
 *   • No JavaScript drives the motion — only CSS.
 */

const ProductSlider = {

    render(products) {
        // Build a single card's HTML
        const card = (p) => `
            <article class="inf-card">
                <div class="inf-card__img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="inf-card__body">
                    <span class="inf-card__cat">${p.category}</span>
                    <h3 class="inf-card__name">${p.name}</h3>
                    <p class="inf-card__price">$${p.price.toFixed(2)}</p>
                    <a href="#/details?id=${p.id}" class="inf-card__btn">
                        <i class="fas fa-shopping-bag"></i> Buy Now
                    </a>
                </div>
            </article>`;

        // Double the list for a seamless infinite loop
        const allCards = [...products, ...products].map(card).join('');

        return `
        <section class="inf-slider" style="--total:${products.length}">
            <div class="inf-slider__header">
                <span class="inf-slider__tag">☕ Hand-Picked</span>
                <h2 class="inf-slider__title">Featured Brews</h2>
                <p class="inf-slider__sub">Our finest selections, crafted for perfection.</p>
            </div>

            <div class="inf-slider__window">
                <div class="inf-slider__track">
                    ${allCards}
                </div>
            </div>
        </section>`;
    },

    afterRender() {
        // Pure CSS animation — nothing needed here
    }
};

export default ProductSlider;
