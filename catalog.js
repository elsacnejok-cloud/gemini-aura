document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("catalog-products-container");
    const sortSelect = document.getElementById("sort-select");
    const resetButton = document.getElementById("reset-filters");
    const sidebar = document.getElementById("catalog-sidebar");
    const catalogTitle = document.getElementById("catalog-title");

    if (!container) return;

    // 1. Считываем параметры из URL (для переходов из шапки, поиска или меню)
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get("category");
    const initialComponent = urlParams.get("component");
    const initialSkinType = urlParams.get("skinType");
    const searchQuery = urlParams.get("search");

    // Выставляем галочки на основе параметров URL при первой загрузке
    if (initialCategory) checkCheckbox("category", initialCategory);
    if (initialComponent) checkCheckbox("component", initialComponent);
    if (initialSkinType) checkCheckbox("skinType", initialSkinType);

    if (searchQuery) {
        catalogTitle.textContent = `Поиск: "${searchQuery}"`;
    }

    // Запускаем первичный рендеринг
    applyFilters();

    // 2. ОБРАБОТЧИК ИЗМЕНЕНИЙ В СИСТЕМЕ ФИЛЬТРОВ (Слушаем клики по чекбоксам)
    sidebar.addEventListener("change", () => {
        // Очищаем заголовок поиска, если пользователь начал кликать фильтры вручную
        if (urlParams.has("search")) {
            window.history.replaceState({}, document.title, "catalog.html");
            catalogTitle.textContent = "Выбранные средства";
        }
        applyFilters();
    });

    // 3. ОБРАБОТЧИК СОРТИРОВКИ ПО ЦЕНЕ
    sortSelect.addEventListener("change", applyFilters);

    // 4. КНОПКА ПОЛНОГО СБРОСА ГАЛОЧЕК
    resetButton.addEventListener("click", () => {
        const checkboxes = sidebar.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => cb.checked = false);
        window.history.replaceState({}, document.title, "catalog.html");
        catalogTitle.textContent = "Все средства";
        applyFilters();
    });

    // 5. ГЛАВНАЯ ФУНКЦИЯ МНОЖЕСТВЕННОЙ ФИЛЬТРАЦИИ И СОРТИРОВКИ
    function applyFilters() {
        let filtered = [...products];

        // А) Если есть активный поисковый запрос в URL — фильтруем по тексту
        const currentUrlParams = new URLSearchParams(window.location.search);
        const activeSearch = currentUrlParams.get("search");
        
        if (activeSearch) {
            const query = activeSearch.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query)
            );
        }

        // Б) Собираем все отмеченные чекбоксы по группам
        const activeFilters = {
            category: getCheckedValues("category"),
            brand: getCheckedValues("brand"),
            component: getCheckedValues("component"),
            skinType: getCheckedValues("skinType")
        };

        // В) Фильтруем массив по каждой активной группе (Логика "И")
        if (activeFilters.category.length > 0) {
            filtered = filtered.filter(p => activeFilters.category.includes(p.category));
        }
        if (activeFilters.brand.length > 0) {
            filtered = filtered.filter(p => activeFilters.brand.includes(p.brand));
        }
        if (activeFilters.component.length > 0) {
            filtered = filtered.filter(p => activeFilters.component.includes(p.component));
        }
        if (activeFilters.skinType.length > 0) {
            filtered = filtered.filter(p => activeFilters.skinType.includes(p.skinType));
        }

        // Г) Сортировка полученного результата
        const sortValue = sortSelect.value;
        if (sortValue === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        // Д) Вывод карточек на экран
        renderCatalogGrid(filtered);
    }

    // Вспомогательная функция сбора значений отмеченных чекбоксов
    function getCheckedValues(name) {
        const checked = sidebar.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checked).map(cb => cb.value);
    }

    // Вспомогательная функция для проставления галочек из URL параметров
    function checkCheckbox(name, value) {
        const cb = sidebar.querySelector(`input[name="${name}"][value="${value}"]`);
        if (cb) cb.checked = true;
    }

    // 6. ОТРИСОВКА СЕТКИ ТОВАРОВ С СИНХРОНИЗАЦИЕЙ СЕРДЕЧЕК
    function renderCatalogGrid(items) {
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #999999;">
                    <i class="fas fa-filter" style="font-size: 32px; margin-bottom: 15px; color: #e5e5e5;"></i>
                    <p>Средств с такими параметрами не найдено. Попробуйте смягчить фильтры.</p>
                </div>
            `;
            return;
        }

        const wishlist = AuraStorage.getWishlist();

        items.forEach(product => {
            const isFavorite = wishlist.includes(product.id);

            const cardHtml = `
                <div class="product-card">
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
                            <button class="product-card__add-btn" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-bag"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cardHtml);
        });
    }
});
