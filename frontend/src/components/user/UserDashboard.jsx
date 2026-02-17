import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import RestaurantList from './RestaurantList';
import FoodExplorer from './FoodExplorer';
import UserOrders from './UserOrders';
import UserProfile from './UserProfile';
import { Utensils, History, LogOut, MapPin, Bell, Sun, Moon, User, Search, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

const UserDashboard = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('explore');
    const [selectedVendor, setSelectedVendor] = useState(null);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleSelectRestaurant = (vendor) => {
        setSelectedVendor(vendor);
        setActiveTab('menu');
    };

    const handleBackToRestaurants = () => {
        setSelectedVendor(null);
        setActiveTab('explore');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-gray)', color: 'var(--text-main)', transition: 'var(--transition)' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px', backgroundColor: 'var(--bg-white)', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
            }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--primary)"><path d="M21.5 11.2c-.1-.5-.4-.9-.8-1.2L13 3.5c-.6-.5-1.4-.5-2 0L3.3 10c-.4.3-.7.7-.8 1.2-.1.5 0 1 .3 1.4l7.7 6.5c.3.3.7.4 1.1.4.4 0 .8-.1 1.1-.4l7.7-6.5c.3-.4.5-.9.4-1.4z" /></svg>
                    <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>FoodDash</h1>
                </div>

                <div style={{ padding: '0 16px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                            onClick={() => { setActiveTab('explore'); setSelectedVendor(null); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: (activeTab === 'explore' || activeTab === 'menu') ? 'var(--primary-light)' : 'transparent',
                                color: (activeTab === 'explore' || activeTab === 'menu') ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: (activeTab === 'explore' || activeTab === 'menu') ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <Utensils size={20} /> Browse Food
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? 'var(--primary-light)' : 'transparent',
                                color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: activeTab === 'orders' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <History size={20} /> My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'profile' ? 'var(--primary-light)' : 'transparent',
                                color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: activeTab === 'profile' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <User size={20} /> Profile
                        </button>
                    </div>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid var(--border)',
                            borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', fontWeight: '600', transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <header style={{
                    height: '80px', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
                    position: 'sticky', top: 0, zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} color="var(--primary)" />
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivering to</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>Pune, Hinjewadi Phase 1 <span style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '8px' }}>Change</span></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => showNotification("No new notifications", "info")}>
                            <Bell size={22} color="var(--text-main)" />
                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg-white)' }} />
                        </div>

                        <div
                            onClick={toggleTheme}
                            style={{
                                width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-gray)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)'
                            }}
                        >
                            {isDarkMode ? <Sun size={20} color="#FFB800" /> : <Moon size={20} color="#6C6C6C" />}
                        </div>

                        <div
                            onClick={() => setActiveTab('profile')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', backgroundColor: 'var(--bg-gray)', padding: '6px 14px', borderRadius: '99px' }}
                        >
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name?.split(' ')[0]}</span>
                            <User size={18} />
                        </div>
                    </div>
                </header>

                <main style={{ padding: '40px', flex: 1 }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {activeTab === 'explore' && <RestaurantList onSelectRestaurant={handleSelectRestaurant} />}
                        {activeTab === 'menu' && <FoodExplorer selectedVendor={selectedVendor} onBack={handleBackToRestaurants} />}
                        {activeTab === 'orders' && <UserOrders />}
                        {activeTab === 'profile' && <UserProfile />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
