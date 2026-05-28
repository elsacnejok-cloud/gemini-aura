const products = [
    {
        id: 1,
        name: "Pure Cleansing Oil",
        brand: "MANYO FACTORY",
        category: "cleansing",
        categoryName: "Очищение",
        price: 2350,
        image: "https://hollyshop.ru/upload/resize_cache/iblock/34b/400_400_1/34b2fde5e317e0ef71caefda06a4bc20.jpg", 
        isNew: true,
        isPopular: true
    },
    {
        id: 2,
        name: "Advanced Snail 96 Mucin Power Essence",
        brand: "COSRX",
        category: "serum",
        categoryName: "Сыворотки",
        price: 1980,
        image: "https://hollyshop.ru/upload/resize_cache/iblock/b3b/400_400_1/b3b65ef3dfc8cba099cb6333ea64516a.jpg",
        isNew: false,
        isPopular: true
    },
    {
        id: 3,
        name: "Heartleaf 77% Soothing Toner",
        brand: "ANUA",
        category: "toner",
        categoryName: "Тоники",
        price: 2100,
        image: "https://hollyshop.ru/upload/resize_cache/iblock/ae3/400_400_1/ae30fc832d2dfcc420fc4d38bb1bd0ef.jpeg",
        isNew: true,
        isPopular: false
    },
    {
        id: 4,
        name: "Budge Bio Retinol Cream",
        brand: "MEDI-PEEL",
        category: "cream",
        categoryName: "Кремы",
        price: 3100,
        image: "https://hollyshop.ru/upload/resize_cache/iblock/c34/400_400_1/c342f0a5be7fd187a54bd2de6203cf65.jpg",
        isNew: false,
        isPopular: true
    }
];

const AuraStorage = {
    getCart() { return JSON.parse(localStorage.getItem("hs_cart")) || []; },
    saveCart(cart) { localStorage.setItem("hs_cart", JSON.stringify(cart)); },
    getWishlist() { return JSON.parse(localStorage.getItem("hs_wishlist")) || []; },
    saveWishlist(list) { localStorage.setItem("hs_wishlist", JSON.stringify(list)); }
};

function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}
