// Ждем полной загрузки DOM-дерева страницы
document.addEventListener("DOMContentLoaded", () => {
    initCartCount();
    renderHomePageProducts();
});

// 1. ФУНКЦИЯ ДЛЯ ВЫВОДА ТОВАРОВ НА ГЛАВНОЙ СТРАНИЦЕ
function renderHomePageProducts() {
    const newContainer = document.getElementById("new-products-container");
    const popularContainer = document.getElementById("popular-products-container");

    // Проверяем, есть ли эти контейнеры на текущей странице (чтобы скрипт не выдавал ошибки на других страницах)
    if (!newContainer || !popularContainer) return;

    // Очищаем контейнеры перед заполнением
    newContainer.innerHTML = "";
    popularContainer.innerHTML = "";

    // Перебираем массив продуктов из products.js
    products.forEach(product => {
        // Создаем HTML-разметку карточки товара
        const productHtml = `
            <div class="product-card">
                ${product.isNew ? '<span class="product-card__badge">New</span>' : ''}
                <div class="product-card__image">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
                    </a>
                </div>
                <div class="product-card__info">
                    <span class="product-card__category">${product.categoryName}</span>
                    <a href="product.html?id=${product.id}">
                        <h3 class="product-card__title">${product.name}</h3>
                    </a>
                    <div class="product-card__footer">
                        <span class="product-card__price">${product.price} ₽</span>
                        <button class="product-card__btn" onclick="addToCart(${product.id})" title="Добавить в корзину">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Распределяем товары по соответствующим секциям
        if (product.isNew) {
            newContainer.insertAdjacentHTML("beforeend", productHtml);
        }
        if (product.isPopular) {
            popularContainer.insertAdjacentHTML("beforeend", productHtml);
        }
    });
}

// 2. ФУНКЦИЯ ДОБАВЛЕНИЯ ТОВАРА В КОРЗИНУ (LocalStorage)
window.addToCart = function(productId) {
    // Получаем текущую корзину из памяти браузера или создаем пустой массив, если корзина пуста
    let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];

    // Проверяем, есть ли уже такой товар в корзине
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // Если есть, увеличиваем его количество на 1
        existingProduct.quantity += 1;
    } else {
        // Если нет, добавляем объект товара с начальным количеством 1
        cart.push({ id: productId, quantity: 1 });
    }

    // Сохраняем обновленную корзину обратно в LocalStorage
    localStorage.setItem("aura_cart", JSON.stringify(cart));

    // Обновляем счетчик на иконке корзины в шапке
    updateCartCount();

    // Небольшое фиктивное уведомление для пользователя
    alert("Товар успешно добавлен в вашу корзину AURA!");
};

// 3. ФУНКЦИИ УПРАВЛЕНИЯ СЧЕТЧИКОМ КОРЗИНЫ
function initCartCount() {
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
    
    // Считаем общее количество всех товаров в корзине
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Выводим цифру в шапку сайта
    cartCountElement.textContent = totalItems;
}
