import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';
import orderService from '../../services/orderService';
import reviewService from '../../services/reviewService';
import favoriteService from '../../services/favoriteService';
import authService from '../../services/authService';
import { ShoppingCart, ShoppingBag, X, Search, Store, Trash2, ArrowLeft, Star, Heart, MessageSquare, Plus, Minus, CheckCircle, MapPin, Send } from 'lucide-react';
import { getItemImage, getVendorImage } from '../../utils/imageUtils';
import { useNotification } from '../../context/NotificationContext';

const FoodExplorer = ({ selectedVendor, onBack }) => {
    const { showNotification } = useNotification();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('Hinjewadi Phase 1, Pune');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (selectedVendor) {
            fetchItems();
            fetchCategories();
            fetchReviews();
            checkFavoriteStatus();
        }
    }, [selectedVendor]);

    const checkFavoriteStatus = async () => {
        try {
            const favorites = await favoriteService.getFavorites();
            setIsFavorite(favorites.some(f => f.vendor.id === selectedVendor.id));
        } catch (err) {
            console.error("Failed to check favorite status", err);
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getVendorReviews(selectedVendor.id);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await itemService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchItems = async (search = '', category = '') => {
        try {
            let data;
            if (selectedVendor) {
                data = await itemService.getVendorItemsPublic(selectedVendor.id);
                if (search) {
                    data = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase()));
                }
                if (category) {
                    data = data.filter(item => item.category === category);
                }
            } else {
                data = await itemService.getAllItems(search, category);
            }
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch items", err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        fetchItems(e.target.value, selectedCategory);
    };

    const handleCategoryClick = (category) => {
        const newCategory = selectedCategory === category ? '' : category;
        setSelectedCategory(newCategory);
        fetchItems(searchQuery, newCategory);
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(0, item.quantity + delta);
                return newQty === 0 ? null : { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!deliveryAddress) {
            showNotification("Please enter a delivery address", "error");
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            showNotification('Razorpay SDK failed to load. Are you online?', 'error');
            return;
        }

        // 1. Create Order on Backend
        const amount = totalAmount + 0.99; // Total including fee
        let orderData;
        try {
            const data = await orderService.createPaymentOrder(amount);
            orderData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (err) {
            showNotification("Failed to initiate payment", "error");
            return;
        }

        // 2. Open Razorpay Checkout
        const currentUser = authService.getCurrentUser();
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_SDg7h1MERcqljv", // Enter the Key ID generated from the Dashboard
            amount: orderData.amount,
            currency: orderData.currency,
            name: selectedVendor.businessName,
            description: "Food Delivery Order",
            order_id: orderData.id,
            handler: async function (response) {
                // 3. On Success, Create Order in Backend
                const vendorId = cart[0].vendor.id;
                console.log("Creating order with vendorId:", vendorId);
                console.log("Cart Sample:", cart[0]);

                const backendOrderData = {
                    vendorId,
                    deliveryAddress,
                    notes: '',
                    transactionId: response.razorpay_payment_id,
                    items: cart.map(item => ({
                        itemId: item.id,
                        quantity: item.quantity
                    }))
                };
                console.log("Backend Order Data:", backendOrderData);

                try {
                    await orderService.createOrder(backendOrderData);
                    setOrderSuccess(true);
                    setCart([]);
                    setTimeout(() => {
                        setOrderSuccess(false);
                        setIsCartOpen(false);
                    }, 3000);
                } catch (err) {
                    console.error("Order creation failed:", err);
                    const errorMessage = err.response?.data || "Payment successful but failed to place order. Please contact support.";
                    showNotification(typeof errorMessage === 'string' ? errorMessage : "Payment successful but failed to place order.", "error");
                }
            },
            prefill: {
                name: currentUser?.name || "FoodDash User",
                email: currentUser?.email || "user@fooddash.com",
                contact: currentUser?.phone || "9999999999"
            },
            theme: {
                color: "#EB1700"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleFavoriteToggle = async () => {
        try {
            await favoriteService.toggleFavorite(selectedVendor.id);
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) return;

        setIsSubmittingReview(true);
        try {
            await reviewService.addReview({
                vendor: { id: selectedVendor.id },
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews(); // Refresh reviews and vendor rating
        } catch (err) {
            console.error("Failed to submit review", err);
            showNotification("Failed to submit review. Are you logged in?", "error");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const dummyReviews = [
        { id: 1, user: "Aarav S.", rating: 5, comment: "Absolutely delicious! The best in Pune.", date: "2 days ago" },
        { id: 2, user: "Meera K.", rating: 4, comment: "Authentic flavors. Packaging was great too!", date: "1 week ago" },
        { id: 3, user: "Rohan D.", rating: 5, comment: "Quick delivery and hot food. Highly recommend.", date: "3 days ago" },
    ];

    return (
        <div style={{ position: 'relative', animation: 'fadeIn 0.6s ease-out' }}>
            <header style={{ marginBottom: '48px' }}>
                <button
                    onClick={onBack}
                    className="hover-lift"
                    style={{
                        background: 'var(--bg-white)', border: '1px solid var(--border)',
                        color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        borderRadius: '12px', marginBottom: '32px'
                    }}
                >
                    <ArrowLeft size={18} /> Back to All Restaurants
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={getVendorImage(selectedVendor)}
                                alt={selectedVendor?.businessName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                <Store size={40} color="white" />
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-1px' }}>
                                {selectedVendor ? selectedVendor.businessName : 'Restaurant Menu'}
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFB800' }}>
                                    <Star size={18} fill="#FFB800" /> {selectedVendor?.rating?.toFixed(1) || '4.2'} ({selectedVendor?.ratingCount || '0'} Ratings)
                                </div>
                                <span>• {selectedVendor?.category || 'Indian, Fast Food, Chinese'}</span>
                                <span>• 35-45 min</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleFavoriteToggle}
                            style={{
                                width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--border)',
                                backgroundColor: isFavorite ? 'var(--primary-light)' : 'var(--bg-white)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)'
                            }}
                        >
                            <Heart size={24} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'var(--text-muted)'} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="btn-primary"
                            style={{ height: '56px', padding: '0 32px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}
                        >
                            <ShoppingCart size={22} /> {cart.length > 0 ? `View Cart (${cart.length})` : 'Cart is Empty'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '320px', position: 'relative' }}>
                        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search within this menu..."
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{
                                width: '100%', padding: '16px 20px 16px 56px', borderRadius: '16px',
                                border: '1px solid var(--border)', backgroundColor: 'var(--bg-white)',
                                fontSize: '1.1rem', color: 'var(--text-main)', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
                        <button
                            onClick={() => handleCategoryClick('')}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap',
                                backgroundColor: selectedCategory === '' ? 'var(--primary)' : 'var(--bg-white)',
                                color: selectedCategory === '' ? 'white' : 'var(--text-main)', fontWeight: '700', transition: 'all 0.2s'
                            }}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                style={{
                                    padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap',
                                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-white)',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-main)', fontWeight: '700', transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Categorized Menu Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'flex-start' }}>
                {/* Menu Navigation Sidebar */}
                <aside style={{ position: 'sticky', top: '100px', backgroundColor: 'var(--bg-white)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Menu</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Object.keys(items.reduce((acc, item) => {
                            acc[item.category] = (acc[item.category] || 0) + 1;
                            return acc;
                        }, {})).map(catName => {
                            const count = items.filter(i => i.category === catName).length;
                            return (
                                <div
                                    key={catName}
                                    onClick={() => {
                                        const element = document.getElementById(`category-${catName}`);
                                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        transition: 'all 0.2s', fontWeight: '600', fontSize: '0.95rem',
                                        color: selectedCategory === catName ? 'var(--primary)' : 'var(--text-main)',
                                        backgroundColor: selectedCategory === catName ? 'var(--primary-light)' : 'transparent'
                                    }}
                                    className="menu-nav-item"
                                >
                                    <span>{catName}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Menu Listing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {Object.entries(items.reduce((acc, item) => {
                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                    }, {})).map(([category, catItems]) => (
                        <section key={category} id={`category-${category}`} style={{ scrollMarginTop: '100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>{category}</h3>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, var(--border), transparent)' }}></div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>{catItems.length} Dishes</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                {catItems.map((item, i) => {
                                    return (
                                        <div key={item.id} className="premium-card hover-lift" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border)', animation: `scaleIn 0.5s ease-out forwards`, opacity: 1 }}>
                                            <div style={{ position: 'relative', height: '160px' }}>
                                                <img
                                                    src={getItemImage(item)}
                                                    alt={item.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div style={{
                                                    display: 'none',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'var(--bg-gray)'
                                                }}>
                                                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                                                </div>
                                            </div>
                                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>{item.name}</h3>
                                                    <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{item.price.toFixed(2)}</span>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5', flex: 1 }}>{item.description}</p>

                                                {/* Nutritional Info Grid */}
                                                {(item.calories || item.protein || item.fat || item.carbs) && (
                                                    <div style={{
                                                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px',
                                                        marginBottom: '20px', padding: '12px', borderRadius: '12px',
                                                        backgroundColor: 'var(--bg-gray)', border: '1px solid var(--border)'
                                                    }}>
                                                        {item.calories && (
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Calories</span>
                                                                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.calories} kcal</span>
                                                            </div>
                                                        )}
                                                        {item.protein && (
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Protein</span>
                                                                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.protein}g</span>
                                                            </div>
                                                        )}
                                                        {item.fat && (
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Fat</span>
                                                                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.fat}g</span>
                                                            </div>
                                                        )}
                                                        {item.carbs && (
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Carbs</span>
                                                                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.carbs}g</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button onClick={() => addToCart(item)} className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: '700' }}>Add to Cart</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    {items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No items match your search.</div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MessageSquare size={28} color="var(--primary)" /> Reviews & Ratings
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="premium-card" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border)', animation: 'fadeIn 0.5s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{review.user?.name || 'Anonymous'}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFB800' }}>
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#FFB800" />)}
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '12px' }}>"{review.comment}"</p>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No reviews yet. Be the first to share your experience!</div>
                    )}

                    <div className="premium-card" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', border: '2px dashed var(--primary-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--primary)" /> Rate your experience</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={24}
                                    fill={newReview.rating >= star ? "#FFB800" : "none"}
                                    color={newReview.rating >= star ? "#FFB800" : "var(--border)"}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Tell us what you loved..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', minHeight: '80px', resize: 'none' }}
                        />
                        <button
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview || !newReview.comment.trim()}
                            className="btn-primary"
                            style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px', opacity: (isSubmittingReview || !newReview.comment.trim()) ? 0.6 : 1 }}
                        >
                            {isSubmittingReview ? 'Submitting...' : <><Send size={16} /> Submit</>}
                        </button>
                    </div>
                </div>
            </section>

            {/* Premium Cart Drawer (Glassmorphism) */}
            {isCartOpen && (
                <>
                    <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }} />
                    <div style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', zIndex: 1001, display: 'flex', flexDirection: 'column',
                        animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderLeft: '1px solid rgba(255,255,255,0.3)'
                    }} className="dark-theme-cart">
                        <style>{`
                            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                            .dark-theme .dark-theme-cart { background: rgba(30, 30, 30, 0.85); }
                        `}</style>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Review Cart</h3>
                            <button onClick={() => setIsCartOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--bg-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={20} color="var(--text-main)" />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            {orderSuccess ? (
                                <div style={{ textAlign: 'center', animation: 'scaleIn 0.5s forwards' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                        <CheckCircle size={40} />
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Order Placed!</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>Sit back and relax while we handle the rest.</p>
                                </div>
                            ) : cart.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '64px' }}>
                                    <ShoppingBag size={64} color="var(--border)" style={{ marginBottom: '20px' }} />
                                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Hungry? Add some food!</h4>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {cart.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</div>
                                                <div style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-gray)', padding: '6px 14px', borderRadius: '12px' }}>
                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}><Minus size={16} /></button>
                                                <span style={{ fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}><Plus size={16} /></button>
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{ marginTop: '32px', padding: '24px', borderRadius: '20px', backgroundColor: 'var(--bg-gray)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <MapPin size={18} color="var(--primary)" />
                                            <h4 style={{ fontWeight: '800' }}>Delivery Details</h4>
                                        </div>
                                        <textarea
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)',
                                                backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', fontSize: '0.9rem', resize: 'none', height: '80px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {!orderSuccess && cart.length > 0 && (
                            <div style={{ padding: '32px', borderTop: '1px solid var(--border)', backgroundColor: 'transparent' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-main)', fontWeight: '800', fontSize: '1.4rem' }}>
                                    <span>Order Total</span>
                                    <span>₹{(totalAmount + 0.99).toFixed(2)}</span>
                                </div>
                                <button onClick={handlePlaceOrder} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '800' }}>
                                    Complete Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FoodExplorer;
