
export const getItemImage = (item) => {
    // Priority 1: User-provided URL (if valid)
    if (item.imageUrl &&
        item.imageUrl.trim() !== '' &&
        !item.imageUrl.includes('placeholder') &&
        (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/api/'))
    ) {
        return item.imageUrl;
    }

    // Priority 2: Keyword-based high-quality Unsplash fallbacks
    const name = (item.name || '').toLowerCase();
    const category = (item.category || '').toLowerCase();

    // Fast Food & Burgers
    if (name.includes('burger') || name.includes('swiss') || name.includes('mushroom') || category.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop';
    if (name.includes('pizza') || category.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop';
    if (name.includes('sandwich') || name.includes('sub') || name.includes('wrap') || name.includes('panini') || category.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop';

    // Appetizers & Sides
    if (name.includes('onion ring') || name.includes('rings') || name.includes('calamari')) return 'https://images.unsplash.com/photo-1639024471283-035188835118?q=80&w=800&auto=format&fit=crop';
    if (name.includes('nugget') || name.includes('tender') || name.includes('strips') || name.includes('finger')) return 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop';
    if (name.includes('fries') || name.includes('fry') || name.includes('chips') || name.includes('potato') || category.includes('side')) {
        if (name.includes('peri') || name.includes('spice') || name.includes('fire')) return 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop';
        return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop';
    }
    if (name.includes('mozzarella') || name.includes('stick') || name.includes('wing')) return 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop';

    // Asian & Indian
    if (name.includes('biryani') || name.includes('pulao') || category.includes('indian') || name.includes('curry')) return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop';
    if (name.includes('sushi') || category.includes('japanese') || name.includes('roll')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop';
    if (name.includes('noodle') || name.includes('chow mein') || category.includes('chinese') || name.includes('ramen')) return 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop';

    // Healthy & Salads
    if (name.includes('salad') || category.includes('healthy') || name.includes('bowl')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop';
    if (name.includes('soup') || name.includes('stew') || name.includes('minestrone')) return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop';

    // Desserts & Beverages
    if (name.includes('shake') || name.includes('smoothie')) return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop';
    if (name.includes('coffee') || name.includes('latte') || name.includes('cappuccino')) return 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop';
    if (category.includes('dessert') || name.includes('cake') || name.includes('sweet') || name.includes('ice cream') || name.includes('brownie')) return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop';
    if (category.includes('beverage') || name.includes('drink') || name.includes('juice') || name.includes('tea') || name.includes('coke')) return 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?q=80&w=800&auto=format&fit=crop';

    // Generic fallback for any other food (varied spread)
    return 'https://images.unsplash.com/photo-1540189549036-447054726c90?q=80&w=800&auto=format&fit=crop';
};

export const getVendorImage = (vendor) => {
    // Priority 1: User-provided URL (if valid)
    if (vendor.imageUrl &&
        vendor.imageUrl.trim() !== '' &&
        !vendor.imageUrl.includes('placeholder')
    ) {
        return vendor.imageUrl;
    }

    // Priority 2: Cuisine-based interior shots
    const category = (vendor.category || '').toLowerCase();
    const name = (vendor.businessName || '').toLowerCase();

    if (category.includes('pizza')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop';
    if (category.includes('burger') || name.includes('burger')) return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop';
    if (category.includes('indian') || category.includes('biryani')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';
    if (category.includes('chinese') || category.includes('asian')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop';
    if (category.includes('dessert') || category.includes('bakery')) return 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop';

    // Generic premium restaurant interior
    return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop';
};
