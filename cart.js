document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function renderCart() {
    const wrapper = document.getElementById("cart-content-wrapper");
    if (!wrapper) return;

    // Получаем список товаров из LocalStorage
    let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];

    // Если корзина пуста, выводим красивую заглушку
    if (cart.length === 0) {
        wrapper.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #e0e0e0; margin-bottom: 20px;"></i>
                <h2 style="font-weight: 300; margin-bottom: 15px;">Ваша корзина пуста</h2>
                <p style="color: #8a8a8a; margin-bottom: 30px;">Вы еще не добавили ни одного средства в свой ежедневный уход.</p>
                <a href="catalog.html" class="btn">Заполнить корзину</a>
            </div>
        `;
        return;
    }

    // Собираем разметку корзины: левая часть (список) + правая часть (итог)
    let cartItemsHtml = "";
    let totalPrice = 0;

    cart.forEach(cartItem => {
        // Находим полную информацию о продукте из products.js по ID
        const product = products.find(p => p.id === cartItem.id);
        
        if (product) {
            const itemSum = product.price * cartItem.quantity;
            totalPrice += itemSum;

            cartItemsHtml += `
                <div class="cart-item">
                    <div class="cart-item__image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150x150/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
                    </div>
                    <div class="cart-item__info">
                        <h3 class="cart-item__name">${product.name}</h3>
                        <span class="cart-item__category">${product.categoryName} (${product.volume})</span>
                    </div>
                    <div class="cart-item__quantity">
                        <button class="cart-item__qbtn" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="cart-item__qbtn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                    <div class="cart-item__price">${itemSum} ₽</div>
                    <button class="cart-item__remove" onclick="removeFromCart(${product.id})" title="Удалить">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
    });

    // Формируем общую структуру страницы
    wrapper.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${cartItemsHtml}
            </div>

            <div class="cart-summary">
                <h2 class="summary-title">Ваш заказ</h2>
                <div class="summary-row">
                    <span>Товары (${cart.reduce((sum, i) => sum + i.quantity, 0)} шт.)</span>
                    <span>${totalPrice} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Доставка</span>
                    <span style="color: #f3a3a3; font-weight: 500;">Бесплатно</span>
                </div>
                <div class="summary-row total">
                    <span>Итого:</span>
                    <span>${totalPrice} ₽</span>
                </div>
                <a href="checkout.html" class="btn" style="display: block; text-align: center; margin-top: 25px; width: 100%;">Перейти к оформлению</a>
            </div>
        </div>
    `;
}

// ФУНКЦИЯ ИЗМЕНЕНИЯ КОЛИЧЕСТВА ТОВАРА (+ / -)
window.changeQuantity = function(productId, direction) {
    let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += direction;
        
        // Если количество стало 0 или меньше, удаляем товар полностью
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }

        localStorage.setItem("aura_cart", JSON.stringify(cart));
        
        // Перерисовываем страницу корзины и обновляем счетчик в шапке
        renderCart();
        if (typeof updateCartCount === "function") updateCartCount();
    }
};

// ФУНКЦИЯ ПОЛНОГО УДАЛЕНИЯ ТОВАРА ИЗ КОРЗИНЫ (Иконка крестика)
window.removeFromCart = function(productId) {
    let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
    cart = cart.filter(i => i.id !== productId);
    
    localStorage.setItem("aura_cart", JSON.stringify(cart));
    
    renderCart();
    if (typeof updateCartCount === "function") updateCartCount();
};
