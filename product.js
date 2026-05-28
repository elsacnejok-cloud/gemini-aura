document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("product-page-container");
    if (!container) return;

    // 1. Получаем ID товара из строки запроса URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Ищем товар в базе данных (функция getProductById описана в products.js)
    const product = getProductById(productId);

    // 3. Если товар не найден, выводим ошибку
    if (!product) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Уход не найден</h2>
                <p style="margin: 15px 0 30px;">Возможно, этот продукт был временно убран из линейки AURA.</p>
                <a href="catalog.html" class="btn">Вернуться в каталог</a>
            </div>
        `;
        return;
    }

    // 4. Если продукт найден, рендерим всю страницу
    container.innerHTML = `
        <div class="product-view">
            <div class="product-view__gallery">
                <div class="product-view__image-wrapper">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x500/ffebeb/4a4a4a?text=${encodeURIComponent(product.name)}'">
                </div>
            </div>

            <div class="product-view__details">
                <span class="product-view__meta">${product.categoryName} | AURA Skincare</span>
                <h1 class="product-view__title">${product.name}</h1>
                <span class="product-view__volume">Объем: ${product.volume}</span>
                
                <p class="product-view__description">${product.description}</p>

                <div class="product-view__price-block">
                    <span class="product-view__price">${product.price} ₽</span>
                    <button class="btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag" style="margin-right: 10px;"></i> Добавить в ритуал
                    </button>
                </div>

                <div class="info-tabs">
                    <div style="margin-bottom: 15px;">
                        <h4 class="info-tabs__title"><i class="fas fa-feather-alt" style="color: #f3a3a3; margin-right: 5px;"></i> Способ применения</h4>
                        <p class="info-tabs__text">Нанесите небольшое количество средства на очищенную кожу мягкими похлопывающими движениями до полного впитывания. Используйте утром и вечером.</p>
                    </div>
                    <div>
                        <h4 class="info-tabs__title"><i class="fas fa-leaf" style="color: #f3a3a3; margin-right: 5px;"></i> Философия бренда</h4>
                        <p class="info-tabs__text">Формулы продуктов AURA разработаны без парабенов и искусственных красителей. Только чистые активы для естественного сияния.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
});
