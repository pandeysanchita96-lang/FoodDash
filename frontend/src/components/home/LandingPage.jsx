import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Store, Bike, Smartphone, Search, Star, Clock } from 'lucide-react';
import Footer from '../layout/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const trendingFoods = [
        { name: 'Artisan Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', rating: 4.9, time: '20-30 min' },
        { name: 'Gourmet Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', rating: 4.8, time: '15-25 min' },
        { name: 'Premium Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400', rating: 4.9, time: '30-40 min' },
        { name: 'Fresh Salad', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', rating: 4.7, time: '10-20 min' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', transition: 'var(--transition)' }}>
            {/* Nav */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 60px', position: 'fixed', top: 0, width: '100%', zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isScrolled ? 'var(--bg-white)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
                opacity: isScrolled ? 0.95 : 1
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#EB1700"><path d="M21.5 11.2c-.1-.5-.4-.9-.8-1.2L13 3.5c-.6-.5-1.4-.5-2 0L3.3 10c-.4.3-.7.7-.8 1.2-.1.5 0 1 .3 1.4l7.7 6.5c.3.3.7.4 1.1.4.4 0 .8-.1 1.1-.4l7.7-6.5c.3-.4.5-.9.4-1.4z" /></svg>
                    <h1 style={{ color: isScrolled ? '#EB1700' : 'white', margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>FoodDash</h1>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', color: isScrolled ? 'var(--text-main)' : 'white', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn-primary"
                        style={{ padding: '12px 28px', boxShadow: '0 4px 15px rgba(235, 23, 0, 0.3)' }}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section - Hybrid Redesign */}
            <header style={{
                height: '90vh', position: 'relative', display: 'flex', alignItems: 'center',
                color: 'white', overflow: 'hidden', padding: '0 60px'
            }}>
                {/* Background Image Layer */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&q=80&w=2000")',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transform: 'scale(1.02)', filter: 'brightness(0.45)'
                }} />

                {/* Visual Overlay for contrast */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
                    zIndex: 1
                }} />

                <div className="fade-in" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '0 40px', width: '100%', textAlign: 'center', margin: '0 auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', margin: '0 auto' }}>
                            <div style={{ padding: '6px 16px', backgroundColor: '#EB1700', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '800', letterSpacing: '1px' }}>
                                NEW
                            </div>
                            <span style={{ fontWeight: '600', opacity: 0.9 }}>Super Fast Delivery</span>
                        </div>

                        <h1 style={{
                            fontSize: '6rem',
                            fontWeight: '900',
                            lineHeight: 1.1,
                            margin: '0 0 32px 0',
                            letterSpacing: '-3px',
                            textShadow: '0 4px 15px rgba(0,0,0,0.5)'
                        }}>
                            Har Craving <br />
                            <span style={{ color: '#FFD700' }}>Ka Jawab.</span>
                        </h1>
                    </div>

                    <p style={{ fontSize: '1.5rem', marginBottom: '48px', fontWeight: '500', opacity: 0.95, margin: '0 auto 48px', maxWidth: '600px', color: 'white' }}>
                        The restaurants you love, delivered to your doorstep.
                    </p>

                    <div className="slide-up" style={{
                        display: 'flex', margin: '0 auto', maxWidth: '700px', backgroundColor: 'white',
                        borderRadius: '100px', padding: '10px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '0 24px' }}>
                            <MapPin size={24} color="#EB1700" style={{ marginRight: '16px' }} />
                            <input
                                type="text"
                                placeholder="Where are we delivering today?"
                                style={{
                                    border: 'none', background: 'none', flex: 1, color: '#333',
                                    fontSize: '1.2rem', fontWeight: '600', outline: 'none'
                                }}
                            />
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                backgroundColor: '#EB1700', border: 'none', borderRadius: '100px',
                                padding: '14px 40px', color: 'white', fontSize: '1.1rem', fontWeight: '700',
                                cursor: 'pointer', transition: 'all 0.3s'
                            }}
                            className="hover-lift"
                        >
                            Find Food
                        </button>
                    </div>

                </div>
            </header>

            {/* Trending Section */}
            <section style={{ padding: '100px 60px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Trending Near You</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Curated flavors from top local chefs</p>
                    </div>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        See all <ArrowRight size={18} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    {trendingFoods.map((food, i) => (
                        <div key={i} className="premium-card hover-lift" style={{ overflow: 'hidden', cursor: 'pointer', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border)' }} onClick={() => navigate('/login')}>
                            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                <img src={food.img} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #eee' }}>
                                    <Star size={14} fill="#FFB800" color="#FFB800" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#191919' }}>{food.rating}</span>
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>{food.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    <Clock size={16} /> {food.time} • Free Delivery
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What you get to enjoy Section */}
            <section style={{ padding: '100px 40px', backgroundColor: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1.5px' }}>What you get to enjoy</h2>
                    <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '64px', fontWeight: '500' }}>Experience the best of FoodDash, tailored for your every craving.</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '32px'
                    }}>
                        {/* Card 1: Offline Prices */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            border: '1px solid #f0f0f0'
                        }} className="hover-lift">
                            <div style={{ width: '100%', height: '240px', marginBottom: '32px', borderRadius: '24px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600"
                                    alt="Restaurant Menu"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2', color: '#1a1a1a' }}>Offline Prices</h3>
                            <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.5' }}>Pay exactly what you see in the restaurant menu. No hidden markups, ever.</p>
                        </div>

                        {/* Card 2: Lowest Prices */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            border: '1px solid #f0f0f0'
                        }} className="hover-lift">
                            <div style={{ width: '100%', height: '240px', marginBottom: '32px', borderRadius: '24px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"
                                    alt="Delicious Food Spread"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2', color: '#1a1a1a' }}>Best Value Items</h3>
                            <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.5' }}>Discover delicious meals starting at just ₹49. Premium quality at pocket-friendly prices.</p>
                        </div>

                        {/* Card 3: Free Delivery */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            border: '1px solid #f0f0f0'
                        }} className="hover-lift">
                            <div style={{ width: '100%', height: '240px', marginBottom: '32px', borderRadius: '24px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=600&cb=1"
                                    alt="Professional Delivery Service"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2', color: '#1a1a1a' }}>Unlimited Free Delivery</h3>
                            <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.5' }}>Enjoy free delivery on all orders above ₹99. We bring the restaurant to you at no extra cost.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
