document.addEventListener("DOMContentLoaded", () => {
    // Переменные для отслеживания текущего состояния каталога
    let currentCategory = "all";
    let currentSort = "default";

    // Элементы интерфейса
    const container = document.getElementById("catalog-products-container");
    const pageTitle = document.getElementById("page-category-title");
    const sortSelect = document.getElementById("sort-select");
    const filterLinks = document.querySelectorAll(".filter-link");

    // 1. ИНИЦИАЛИЗАЦИЯ: Проверяем, нет ли категории в URL (например: catalog.html?category=serum)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam && products.some(p => p.category === categoryParam)) {
        currentCategory = categoryParam;
        // Подсвечиваем правильный пункт в боковом меню
        filterLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-category") === currentCategory) {
                link.classList.add("active");
            }
        });
    }

    // Запускаем первичный рендеринг
    renderCatalog();

    // 2. ОБРАБОТЧИК КЛИКОВ ПО ФИЛЬТРАМ (Боковое меню)
    filterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Убираем активный класс у всех и добавляем текущему
            filterLinks.forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");

            // Обновляем текущую категорию и перерисовываем каталог
            currentCategory = e.target.getAttribute("data-category");
            renderCatalog();
        });
    });

    // 3. ОБРАБОТЧИК СОРТИРОВКИ ПО ЦЕНЕ
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderCatalog();
    });

    // 4. ГЛАВНАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ И ВЫВОДА ТОВАРОВ
    function renderCatalog() {
        if (!container) return;
        container.innerHTML = "";

        // Фильтруем массив по категории
        let filteredProducts = [...products]; // создаем копию базы данных
        if (currentCategory !== "all") {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }

        // Обновляем заголовок страницы
        if (currentCategory === "all") {
            pageTitle.textContent = "Все средства";
        } else if (filteredProducts.length > 0) {
            pageTitle.textContent = filteredProducts[0].categoryName;
        }

        // Сортируем отфильтрованные товары
        if (currentSort === "price-asc") {
            filteredProducts.sort((a, b) => a.price - b.price); // Сначала дешевле
        } else if (currentSort === "price-desc") {
            filteredProducts.sort((a, b) => b.price - a.price); // Сначала дороже
        }

        // Если товаров в категории нет
        if (filteredProducts.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a0a0a0; padding: 40px 0;">В этой категории ухода пока нет новинок.</p>`;
            return;
        }

        // Генерируем HTML для карточек
        filteredProducts.forEach(product => {
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
            container.insertAdjacentHTML("beforeend", productHtml);
        });
    }
});
