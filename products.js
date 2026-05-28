// Расширенная база данных ухода AURA для точной фильтрации
const products = [
    {
        id: 1,
        name: "Soft Touch Toner",
        category: "toner",
        categoryName: "Тоники",
        brand: "AURA Clean",
        skinType: "sensitive",
        skinTypeName: "Чувствительная",
        component: "centella",
        componentName: "Центелла",
        price: 1450,
        description: "Мягкий тонер бережно восстанавливает pH-баланс кожи после очищения, глубоко увлажняет и готовит её к нанесению последующего ухода.",
        volume: "200 мл",
        image: "images/toner.jpg",
        isNew: true,
        isPopular: false,
        inStock: true
    },
    {
        id: 2,
        name: "Vitamin C Glow Serum",
        category: "serum",
        categoryName: "Сыворотки",
        brand: "AURA Lab",
        skinType: "all",
        skinTypeName: "Для всех типов",
        component: "vit-c",
        componentName: "Витамин C",
        price: 2100,
        description: "Антиоксидантная сыворотка возвращает коже естественное сияние, выравнивает тон и борется с пигментацией.",
        volume: "30 мл",
        image: "images/serum.jpg",
        isNew: false,
        isPopular: true,
        inStock: true
    },
    {
        id: 3,
        name: "Night Recovery Mask",
        category: "mask",
        categoryName: "Маски",
        brand: "AURA Night",
        skinType: "dry",
        skinTypeName: "Сухая",
        component: "ceramides",
        componentName: "Керамиды",
        price: 1850,
        description: "Ночная восстанавливающая маска интенсивно питает кожу во время сна, стирая следы усталости к самому утру.",
        volume: "50 мл",
        image: "images/mask.jpg",
        isNew: true,
        isPopular: true,
        inStock: true
    },
    {
        id: 4,
        name: "Hydrophilic Cleansing Oil",
        category: "cleansing",
        categoryName: "Очищение",
        brand: "AURA Clean",
        skinType: "oily",
        skinTypeName: "Жирная и проблемная",
        component: "acids",
        componentName: "AHA/BHA Кислоты",
        price: 1600,
        description: "Гидрофильное масло мягко растворяет даже самый стойкий макияж и излишки себума, не оставляя жирной пленки.",
        volume: "150 мл",
        image: "images/cleansing-oil.jpg",
        isNew: false,
        isPopular: false,
        inStock: true
    },
    {
        id: 5,
        name: "Moisturizing Fluid Cream",
        category: "cream",
        categoryName: "Кремы",
        brand: "AURA Lab",
        skinType: "dry",
        skinTypeName: "Сухая",
        component: "hyaluronic",
        componentName: "Гиалуроновая кислота",
        price: 1950,
        description: "Легкий увлажняющий флюид мгновенно впитывается, насыщая клетки влагой на весь день. Отличная база под макияж.",
        volume: "50 мл",
        image: "images/cream.jpg",
        isNew: false,
        isPopular: true,
        inStock: true
    },
    {
        id: 6,
        name: "BHA Matte Essence",
        category: "serum",
        categoryName: "Сыворотки",
        brand: "AURA Lab",
        skinType: "oily",
        skinTypeName: "Жирная и проблемная",
        component: "acids",
        componentName: "AHA/BHA Кислоты",
        price: 2250,
        description: "Матирующая эссенция сужает поры, регулирует выработку себума и предотвращает появление воспалений.",
        volume: "40 мл",
        image: "images/essence.jpg",
        isNew: true,
        isPopular: false,
        inStock: true
    }
];

// Вспомогательные функции для работы с LocalStorage (Корзина и Избранное)
const AuraStorage = {
    getCart() {
        return JSON.parse(localStorage.getItem("aura_cart")) || [];
    },
    saveCart(cart) {
        localStorage.setItem("aura_cart", JSON.stringify(cart));
    },
    getWishlist() {
        return JSON.parse(localStorage.getItem("aura_wishlist")) || [];
    },
    saveWishlist(list) {
        localStorage.setItem("aura_wishlist", JSON.stringify(list));
    }
};

function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}
