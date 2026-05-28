document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById("cart-items-container");
    const layoutZone = document.getElementById("cart-layout-zone");
    const summaryInfo = document.getElementById("cart-summary-info");

    if (!container) return;

    const cart = AuraStorage.getCart();

    // Если корзина пуста, убираем сайдбар и выводим эстетичную бьюти-заглушку
    if (cart.length === 0) {
        layoutZone.style.display = "block";
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag" style="font-size: 50px; color: #fbebeb; margin-bottom: 20px;"></i>
                <h2 style="font-weight: 300; margin-bottom: 12px;">Ваша сумочка ухода пуста</h2>
                <p style="color: #888888; margin-bottom: 30px;">Вы еще не выбрали ни одного бьюти-ритуала от AURA.</p>
                <a href="catalog.html" class="btn">Заглянуть в каталог</a>
            </div>
        `;
        const sidebar = document.getElementById("cart-summary-sidebar");
        if (sidebar) sidebar.style.display = "none";
        return;
    }

    // Возвращаем стандартное двухколоночное расположение
    layoutZone.style.display = "flex";
    const sidebar = document.getElementById("cart-summary-sidebar");
    if (sidebar) sidebar.style.display = "block";

    container.innerHTML = "";
    let totalPrice = 0;
    let totalCount = 0;

    // Рендерим товары
    cart.forEach(item => {
        const product = getProductById(item.id);

        if (product) {
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;
            totalCount += item.quantity;

            const itemHtml = `
                <div class="cart-item">
                    <img class="cart-item__img" src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150x150/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
                    <div class="cart-item__info">
                        <span class="cart-item__meta">${product.brand} | ${product.volume}</span>
                        <h3 class="cart-item__name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
                        <p style="font-size: 13px; color: #888888;">Компонент: ${product.componentName}</p>
                    </div>
                    
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)"><i class="fas fa-minus"></i></button>
                        <span class="quantity-num">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)"><i class="fas fa-plus"></i></button>
                    </div>

                    <span class="cart-item__price">${itemTotal} ₽</span>
                    
                    <button class="cart-item__delete" onclick="removeFromCart(${product.id})" title="Удалить из корзины">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", itemHtml);
        }
    });

    // Заполняем расчетный листок в сайдбаре
    if (summaryInfo) {
        summaryInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #666666;">
                <span>Выбрано средств</span>
                <span>${totalCount} шт.</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #666666;">
                <span>Доставка по России</span>
                <span style="color: #f3a3a3; font-weight: 600;">Бесплатно</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #1a1a1a; border-top: 1px solid #f5f5f5; padding-top: 18px; margin-top: 18px;">
                <span>Общая стоимость:</span>
                <span>${totalPrice} ₽</span>
            </div>
        `;
    }
}

// Изменение количества (+1 или -1)
window.changeQuantity = function(productId, direction) {
    let cart = AuraStorage.getCart();
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += direction;
        
        // Если опустились до 0 — удаляем вещь
        if (existingProduct.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        AuraStorage.saveCart(cart);
        // Обновляем шапку из main.js
        if (typeof updateHeaderCounters === "function") updateHeaderCounters();
        // Перерисовываем страницу корзины
        renderCart();
    }
};

// Полное удаление строчки кнопкой "ведро"
window.removeFromCart = function(productId) {
    let cart = AuraStorage.getCart();
    cart = cart.filter(item => item.id !== productId);
    
    AuraStorage.saveCart(cart);
    if (typeof updateHeaderCounters === "function") updateHeaderCounters();
    renderCart();
};
