document.addEventListener("DOMContentLoaded", () => {
    // Инициализируем счетчики в шапке сайта
    updateHeaderCounters();
    // Рендерим товары на главной странице
    renderHomePageProducts();
    // Инициализируем живой поиск
    initLiveSearch();
});

// 1. СИНХРОНИЗАЦИЯ И ОБНОВЛЕНИЕ СЧЕТЧИКОВ В ШАПКЕ
function updateHeaderCounters() {
    const cartCountElement = document.getElementById("cart-count");
    const wishlistCountElement = document.getElementById("wishlist-count");

    if (cartCountElement) {
        const cart = AuraStorage.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    if (wishlistCountElement) {
        const wishlist = AuraStorage.getWishlist();
        wishlistCountElement.textContent = wishlist.length;
    }
}

// 2. РЕНДЕРИНГ КАРТОЧЕК НА ГЛАВНОЙ СТРАНИЦЕ
function renderHomePageProducts() {
    const newContainer = document.getElementById("new-products-container");
    const popularContainer = document.getElementById("popular-products-container");

    if (!newContainer || !popularContainer) return;

    newContainer.innerHTML = "";
    popularContainer.innerHTML = "";

    const wishlist = AuraStorage.getWishlist();

    products.forEach(product => {
        const isFavorite = wishlist.includes(product.id);
        
        // Шаблон сложной карточки товара точь-в-точь как в каталогах
        const productHtml = `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card__badges">
                    ${product.isNew ? '<span class="badge-new">New</span>' : ''}
                </div>
                
                <button class="product-card__wishlist-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id}, this)" 
                        title="${isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
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
                        <button class="product-card__add-btn" onclick="addToCart(${product.id})" title="Добавить в ритуал ухода">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (product.isNew) {
            newContainer.insertAdjacentHTML("beforeend", productHtml);
        }
        if (product.isPopular) {
            popularContainer.insertAdjacentHTML("beforeend", productHtml);
        }
    });
}

// 3. ДОБАВЛЕНИЕ В КОРЗИНУ С ВСПЛЫВАЮЩИМ TOAST-УВЕДОМЛЕНИЕМ
window.addToCart = function(productId) {
    let cart = AuraStorage.getCart();
    const product = getProductById(productId);
    if (!product) return;

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    AuraStorage.saveCart(cart);
    updateHeaderCounters();
    
    // Вызываем красивое уведомление вместо серого alert
    showToast(`<i class="fas fa-shopping-bag"></i> ${product.name} добавлен в корзину`);
};

// 4. ИНТЕРАКТИВНОЕ ДОБАВЛЕНИЕ / УДАЛЕНИЕ ИЗ ИЗБРАННОГО
window.toggleWishlist = function(productId, buttonElement) {
    let wishlist = AuraStorage.getWishlist();
    const product = getProductById(productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);

    if (index > -1) {
        // Если уже есть в избранном — удаляем
        wishlist.splice(index, 1);
        buttonElement.classList.remove("active");
        buttonElement.querySelector("i").className = "far fa-heart";
        buttonElement.title = "Добавить в избранное";
        showToast(`<i class="far fa-heart"></i> Средство удалено из избранного`);
    } else {
        // Если нет — добавляем
        wishlist.push(productId);
        buttonElement.classList.add("active");
        buttonElement.querySelector("i").className = "fas fa-heart";
        buttonElement.title = "Убрать из избранного";
        showToast(`<i class="fas fa-heart" style="color: #f3a3a3;"></i> ${product.name} в списке Избранного`);
    }

    AuraStorage.saveWishlist(wishlist);
    updateHeaderCounters();
};

// 5. КРАСИВЫЕ КЛИЕНТСКИЕ TOAST-НОТИФИКАЦИИ
function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = message;

    container.appendChild(toast);

    // Плавно удаляем уведомление через 3,5 секунды
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s ease reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// 6. ИНТЕГРАЦИЯ СТРОКИ ПОИСКА
function initLiveSearch() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (!searchInput) return;

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            // Перенаправляем на страницу каталога с параметром поиска
            window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
    }

    searchBtn?.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
}
