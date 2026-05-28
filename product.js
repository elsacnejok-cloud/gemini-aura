document.addEventListener("DOMContentLoaded", () => {
    const zone = document.getElementById("product-view-zone");
    if (!zone) return;

    // Считываем ID средства из адресной строки
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    const product = getProductById(productId);

    // Если товар не найден в products.js
    if (!product) {
        zone.innerHTML = `
            <div style="text-align: center; padding: 60px 0;">
                <h2>Бьюти-средство не найдено</h2>
                <p style="color: #888888; margin-top: 10px;">Возможно, этот ритуал ухода еще находится в разработке.</p>
                <a href="catalog.html" class="btn" style="margin-top: 25px;">Вернуться в каталог</a>
            </div>
        `;
        return;
    }

    // Проверяем, находится ли этот товар в списке желаний
    const wishlist = AuraStorage.getWishlist();
    const isFavorite = wishlist.includes(product.id);

    // Меняем заголовок вкладки браузера на название баночки
    document.title = `${product.name} — AURA`;

    // Отрисовываем роскошный интерфейс карточки
    zone.innerHTML = `
        <div class="product-view">
            <div class="product-view__gallery">
                <button class="product-card__wishlist-btn ${isFavorite ? 'active' : ''}" 
                        style="top: 20px; right: 20px; width: 44px; height: 44px; font-size: 16px;" 
                        onclick="toggleProductPageWishlist(${product.id}, this)">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x600/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
            </div>
            
            <div class="product-view__content">
                <span class="product-view__brand">${product.brand}</span>
                <h1 class="product-view__title">${product.name}</h1>
                <div class="product-view__price">${product.price} ₽</div>
                
                <p class="product-view__description">${product.description}</p>
                
                <div class="product-view__specs">
                    <div class="spec-row">
                        <span class="spec-label">Категория:</span>
                        <span class="spec-value">${product.categoryName}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Объем:</span>
                        <span class="spec-value">${product.volume}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Тип кожи:</span>
                        <span class="spec-value">${product.skinTypeName}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Главный актив:</span>
                        <span class="spec-value">${product.componentName}</span>
                    </div>
                </div>
                
                <div class="product-view__actions">
                    <button class="btn" style="padding: 16px 50px;" onclick="addToCart(${product.id})">Добавить в ритуал</button>
                </div>
            </div>
        </div>
    `;
});

// Кастомный переключатель сердца для страницы карточки товара
window.toggleProductPageWishlist = function(productId, buttonElement) {
    if (typeof toggleWishlist === "function") {
        toggleWishlist(productId, buttonElement);
    }
};
