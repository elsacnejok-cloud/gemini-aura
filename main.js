document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCounters();
    renderHSProducts();
});

function updateHeaderCounters() {
    const cartCount = document.getElementById("cart-count");
    const wishCount = document.getElementById("wishlist-count");

    if (cartCount) {
        const cart = AuraStorage.getCart();
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    if (wishCount) {
        wishCount.textContent = AuraStorage.getWishlist().length;
    }
}

function renderHSProducts() {
    const newCont = document.getElementById("new-products-container");
    const popCont = document.getElementById("popular-products-container");

    if (!newCont || !popCont) return;

    const wishlist = AuraStorage.getWishlist();

    products.forEach(product => {
        const isFav = wishlist.includes(product.id);
        const html = `
            <div class="hs-card">
                <div class="hs-card__img-holder">
                    <button class="hs-card__wish-btn ${isFav ? 'active' : ''}" onclick="toggleWish(${product.id}, this)">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <span class="hs-card__brand">${product.brand}</span>
                <h3 class="hs-card__title">${product.name}</h3>
                <div class="hs-card__price-section">
                    <span class="hs-card__price">${product.price} ₽</span>
                    <button class="hs-card__buy-btn" onclick="addCart(${product.id})">В корзину</button>
                </div>
            </div>
        `;

        if (product.isNew) newCont.insertAdjacentHTML("beforeend", html);
        if (product.isPopular) popCont.insertAdjacentHTML("beforeend", html);
    });
}

window.addCart = function(id) {
    let cart = AuraStorage.getCart();
    let exist = cart.find(item => item.id === id);
    if (exist) exist.quantity++; else cart.push({id: id, quantity: 1});
    AuraStorage.saveCart(cart);
    updateHeaderCounters();
    showHsToast("Товар добавлен в корзину");
};

window.toggleWish = function(id, btn) {
    let wish = AuraStorage.getWishlist();
    let idx = wish.indexOf(id);
    if (idx > -1) {
        wish.splice(idx, 1);
        btn.classList.remove("active");
        btn.querySelector("i").className = "far fa-heart";
    } else {
        wish.push(id);
        btn.classList.add("active");
        btn.querySelector("i").className = "fas fa-heart";
    }
    AuraStorage.saveWishlist(wish);
    updateHeaderCounters();
};

function showHsToast(msg) {
    const box = document.getElementById("toast-container");
    if (!box) return;
    const t = document.createElement("div");
    t.className = "hs-toast";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => { t.remove(); }, 2500);
}
