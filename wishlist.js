document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
});

function renderWishlist() {
    const container = document.getElementById("wishlist-products-container");
    if (!container) return;

    // Берем ID избранных товаров
    const wishlist = AuraStorage.getWishlist();

    // Если ничего не добавлено, выводим красивую бьюти-заглушку
    if (wishlist.length === 0) {
        container.style.display = "block"; // Ломаем сетку ради центрирования текста
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart" style="font-size: 50px; color: #fbebeb; margin-bottom: 20px;"></i>
                <h2 style="font-weight: 300; margin-bottom: 12px;">Ваш список желаний пуст</h2>
                <p style="color: #888888; margin-bottom: 30px;">Отмечайте понравившиеся средства сердечком, чтобы они всегда были под рукой.</p>
                <a href="catalog.html" class="btn">Перейти к покупкам</a>
            </div>
        `;
        return;
    }

    // Возвращаем сетку, если товары есть
    container.style.display = "grid";
    container.innerHTML = "";

    // Отрисовываем каждую баночку из списка избранного
    wishlist.forEach(productId => {
        const product = getProductById(productId);

        if (product) {
            const productHtml = `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-card__badges">
                        ${product.isNew ? '<span class="badge-new">New</span>' : ''}
                    </div>
                    
                    <button class="product-card__wishlist-btn active" 
                            onclick="removeAndRefreshWishlist(${product.id}, this)" 
                            title="Убрать из избранного">
                        <i class="fas fa-heart"></i>
                    </button>

                    <div class="product-card__image">
                        <a href="product.html?id=${product.id}">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
                        </a>
                    </div>
                    
                    <div class="product-card__info">
                        <span class="product-card__meta">${product.brand} | ${product.categoryName}</span>
                        <a href="product.html?id=${product.id}">
                            <h3 class="product-card__title">${product.name}</h3>
                        </a>
                        <div class="product-card__footer">
                            <span class="product-card__price">${product.price} ₽</span>
                            <button class="product-card__add-btn" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-bag"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", productHtml);
        }
    });
}

// Специальная функция для страницы Избранного, чтобы карточка исчезала сразу при отжатии сердечка
window.removeAndRefreshWishlist = function(productId, buttonElement) {
    // Вызываем глобальную функцию переключения из main.js
    if (typeof toggleWishlist === "function") {
        toggleWishlist(productId, buttonElement);
        // Перерисовываем страницу, чтобы удаленный товар исчез с экрана
        renderWishlist();
    }
};
