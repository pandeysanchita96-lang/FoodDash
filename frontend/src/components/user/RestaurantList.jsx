import React, { useState, useEffect } from 'react';
import vendorService from '../../services/vendorService';
import favoriteService from '../../services/favoriteService';
import { Store, ArrowRight, Star, Clock, Search, Filter, ChevronRight, Heart } from 'lucide-react';
import { getVendorImage, getItemImage } from '../../utils/imageUtils';

const RestaurantList = ({ onSelectRestaurant }) => {
    const [vendors, setVendors] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSearching, setIsSearching] = useState(false);

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchVendors();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const data = await favoriteService.getFavorites();
            setFavorites(data.map(f => f.vendor.id));
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        }
    };

    const dummyVendors = [
        { id: 'd1', businessName: 'Rustic Sands', category: 'Pizza, Italian', rating: 4.8, time: '20-30 min', priceRange: '₹₹', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5' },
        { id: 'd2', businessName: 'Tettorica', category: 'Biryani, North Indian', rating: 4.6, time: '35-45 min', priceRange: '₹₹', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' },
        { id: 'd3', businessName: 'Momentt', category: 'Burgers, American', rating: 4.4, time: '15-25 min', priceRange: '₹', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288' },
        { id: 'd4', businessName: 'Intactu', category: 'Chinese, Asian', rating: 4.7, time: '25-35 min', priceRange: '₹₹', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c' },
        { id: 'd5', businessName: 'Sweet Indulgence', category: 'Desserts, Bakery', rating: 4.9, time: '10-20 min', priceRange: '₹', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e' },
        { id: 'd6', businessName: 'Dakshin Delights', category: 'South Indian', rating: 4.5, time: '20-30 min', priceRange: '₹', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
        { id: 'd7', businessName: 'Garden Fresh', category: 'Salads, Healthy', rating: 4.3, time: '15-25 min', priceRange: '₹₹', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
        { id: 'd8', businessName: 'Sushi Supreme', category: 'Japanese, Sushi', rating: 4.8, time: '40-50 min', priceRange: '₹₹₹', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c' },
    ];

    const fetchVendors = async (query = '', category = 'All') => {
        setLoading(true);
        try {
            if (query && category === 'All') {
                setIsSearching(true);
                const data = await vendorService.globalSearch(query);
                setVendors(data.vendors || []);
                setItems(data.items || []);
            } else {
                setIsSearching(false);
                let data;
                if (category !== 'All') {
                    data = await vendorService.searchVendors('', category);
                } else {
                    data = await vendorService.getApprovedVendors();
                }
                setVendors(data && data.length > 3 ? data : [...data, ...dummyVendors.slice(0, 8 - data.length)]);
                setItems([]);
            }
        } catch (err) {
            console.error("Failed to fetch search results", err);
            setVendors(dummyVendors);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        // Debounce search in a real app, but for now:
        if (val.length > 2 || val.length === 0) {
            fetchVendors(val, selectedCategory);
        }
    };

    const handleCategorySelect = (catName) => {
        const newCat = selectedCategory === catName ? 'All' : catName;
        setSelectedCategory(newCat);
        fetchVendors(searchQuery, newCat);
    };

    const toggleFavorite = async (e, vendorId) => {
        e.stopPropagation();
        try {
            await favoriteService.toggleFavorite(vendorId);
            setFavorites(prev =>
                prev.includes(vendorId)
                    ? prev.filter(id => id !== vendorId)
                    : [...prev, vendorId]
            );
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const categories = [
        { name: 'Pizza', icon: '🍕', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
        { name: 'Biryani', icon: '🍛', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0' },
        { name: 'Burger', icon: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
        { name: 'Chinese', icon: '🥢', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de' },
        { name: 'Desserts', icon: '🍨', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e' },
        { name: 'South Idn', icon: '🥞', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
        { name: 'Salads', icon: '🥗', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
    ];

    const filterChips = [
        { name: 'Veg', color: '#4CAF50' },
        { name: 'Rating 4.0+', color: '#FFB800' },
        { name: 'Price: Low-High', color: '#191919' },
        { name: 'Fast Delivery', color: '#EB1700' },
    ];

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                Loading top-rated restaurants...
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
            {/* Search & Filters */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{
                    display: 'flex', backgroundColor: 'var(--bg-white)', borderRadius: '16px',
                    padding: '6px 6px 6px 24px', alignItems: 'center', boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)', maxWidth: '800px', margin: '0 auto 24px'
                }}>
                    <Search size={22} color="var(--text-muted)" style={{ marginRight: '16px' }} />
                    <input
                        type="text"
                        placeholder="Search for Domino's, Paneer Pizza, or Italian..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ border: 'none', flex: 1, fontSize: '1.1rem', color: 'var(--text-main)', background: 'transparent', outline: 'none' }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); fetchVendors('', 'All'); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 15px', fontWeight: 'bold' }}
                        >
                            Clear
                        </button>
                    )}
                    <button className="btn-primary" onClick={() => fetchVendors(searchQuery, selectedCategory)} style={{ padding: '12px 28px', borderRadius: '12px' }}>Search</button>
                </div>

                {!isSearching && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', backgroundColor: 'var(--bg-white)' }}>
                            <Filter size={16} /> Filters
                        </div>
                        {filterChips.map(chip => (
                            <div key={chip.name} style={{
                                padding: '10px 20px', borderRadius: '99px', border: '1px solid var(--border)',
                                color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                                backgroundColor: 'var(--bg-white)', transition: 'var(--transition)'
                            }} className="hover-lift">
                                {chip.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isSearching ? (
                <div style={{ animation: 'slideUp 0.5s ease-out' }}>
                    {items.length > 0 && (
                        <div style={{ marginBottom: '48px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)' }}>Top Dish Matches</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className="premium-card hover-lift"
                                        onClick={() => onSelectRestaurant(item.vendor)}
                                        style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'center', backgroundColor: 'var(--bg-white)', borderRadius: '16px', cursor: 'pointer', border: '1px solid var(--border)' }}
                                    >
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-gray)' }}>
                                            <img
                                                src={getItemImage(item)}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                                <Store size={24} color="var(--text-muted)" />
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: '700', margin: '0 0 4px 0', fontSize: '1rem' }}>{item.name}</h4>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>from <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{item.vendor?.businessName}</span></p>
                                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>₹{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px' }}>{items.length > 0 ? 'Restaurant Matches' : `Search results for "${searchQuery}"`}</h2>
                    {vendors.length === 0 && items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <h3>No results found for "{searchQuery}"</h3>
                            <p>Try searching for different keywords or cuisines.</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Categories Section */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>What's on your mind?</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', backgroundColor: 'var(--bg-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /></button>
                                <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', backgroundColor: 'var(--bg-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ArrowRight size={20} /></button>
                            </div>
                        </div>

                        <div className="hide-scrollbar" style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
                            {categories.map((cat, i) => (
                                <div
                                    key={cat.name}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    style={{
                                        flex: '0 0 auto', textAlign: 'center', cursor: 'pointer',
                                        transition: 'var(--transition)', transform: selectedCategory === cat.name ? 'scale(1.05)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                                        marginBottom: '12px', border: selectedCategory === cat.name ? '3px solid var(--primary)' : '1px solid var(--border)',
                                        boxShadow: selectedCategory === cat.name ? '0 8px 16px rgba(235, 23, 0, 0.2)' : 'none'
                                    }}>
                                        <img src={`${cat.img}?auto=format&fit=crop&q=80&w=200`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <span style={{ fontWeight: '700', color: selectedCategory === cat.name ? 'var(--primary)' : 'var(--text-main)' }}>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Restaurants Section */}
                    <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Restaurants Near You</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Order from your favorite local spots in Hinjewadi.</p>
                        </div>
                        <div style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View all 240+ <ChevronRight size={18} />
                        </div>
                    </header>
                </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                {vendors.length > 0 ? vendors.map((vendor, i) => {
                    const bannerImg = vendor.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600';
                    return (
                        <div
                            key={vendor.id}
                            className="premium-card hover-lift"
                            style={{
                                cursor: 'pointer', overflow: 'hidden', display: 'flex',
                                flexDirection: 'column', animation: `slideUp 0.6s ease-out ${i * 0.1}s forwards`,
                                opacity: 0, backgroundColor: 'var(--bg-white)', border: '1px solid var(--border)'
                            }}
                            onClick={() => onSelectRestaurant(vendor)}
                        >
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <img
                                    src={getVendorImage(vendor)}
                                    alt={vendor.businessName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'var(--bg-gray)' }}>
                                    <Store size={48} color="var(--border)" />
                                </div>
                                <div style={{
                                    position: 'absolute', bottom: '16px', left: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '100px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: '700', fontSize: '0.85rem',
                                    display: 'flex', alignItems: 'center', gap: '6px', color: '#191919'
                                }}>
                                    <Clock size={14} color="var(--primary)" /> {vendor.time || '30-40 min'}
                                </div>
                                <div
                                    onClick={(e) => toggleFavorite(e, vendor.id)}
                                    style={{
                                        position: 'absolute', top: '16px', right: '16px',
                                        backgroundColor: 'rgba(255,255,255,0.9)', width: '40px', height: '40px',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: favorites.includes(vendor.id) ? 'var(--primary)' : '#6C6C6C',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Heart size={20} fill={favorites.includes(vendor.id) ? 'var(--primary)' : 'none'} />
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>{vendor.businessName}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--primary-light)', padding: '4px 10px', borderRadius: '100px' }}>
                                        <Star size={14} fill="var(--primary)" color="var(--primary)" />
                                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--primary)' }}>{vendor.rating || '4.2'}</span>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '16px', fontWeight: '500' }}>
                                    {vendor.category || 'Indian, Chinese, Fast Food'} • {vendor.priceRange || '₹₹'} • ₹0.99 delivery
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '700', fontSize: '1rem' }}>
                                    View Menu <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    );
                }) : null}
            </div>
        </div>
    );
};

export default RestaurantList;
