// База данных товаров бренда AURA
const products = [
    {
        id: 1,
        name: "Soft Touch Toner",
        category: "toner",
        categoryName: "Тоники",
        price: 1450,
        description: "Мягкий тонер для лица бережно восстанавливает pH-баланс кожи после очищения, глубоко увлажняет и готовит её к нанесению последующего ухода. Идеально подходит для чувствительной кожи.",
        volume: "200 мл",
        image: "images/toner.jpg",
        isNew: true,
        isPopular: false
    },
    {
        id: 2,
        name: "Vitamin C Serum",
        category: "serum",
        categoryName: "Сыворотки",
        price: 2100,
        description: "Антиоксидантная сыворотка с витамином C возвращает коже естественное сияние, выравнивает тон, борется с пигментацией и следами постакне. Стимулирует синтез коллагена.",
        volume: "30 мл",
        image: "images/serum.jpg",
        isNew: false,
        isPopular: true
    },
    {
        id: 3,
        name: "Night Recovery Mask",
        category: "mask",
        categoryName: "Маски",
        price: 1850,
        description: "Ночная восстанавливающая маска интенсивно питает кожу во время сна. Стирает следы усталости, заполняет мелкие морщинки и укрепляет защитный барьер к самому утру.",
        volume: "50 мл",
        image: "images/mask.jpg",
        isNew: true,
        isPopular: true
    },
    {
        id: 4,
        name: "Hydrophilic Cleansing Oil",
        category: "cleansing",
        categoryName: "Очищение",
        price: 1600,
        description: "Гидрофильное масло мягко растворяет даже самый стойкий макияж, солнцезащитные средства и излишки себума, не оставляя жирной пленки и не пересушивая кожу.",
        volume: "150 мл",
        image: "images/cleansing-oil.jpg",
        isNew: false,
        isPopular: false
    },
    {
        id: 5,
        name: "Moisturizing Fluid Cream",
        category: "cream",
        categoryName: "Кремы",
        price: 1950,
        description: "Легкий увлажняющий флюид мгновенно впитывается, насыщая клетки влагой на весь день. Отличная база под макияж, которая не забивает поры.",
        volume: "50 мл",
        image: "images/cream.jpg",
        isNew: false,
        isPopular: true
    }
];

// Функция для получения одного товара по ID (пригодится для страницы товара)
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}
