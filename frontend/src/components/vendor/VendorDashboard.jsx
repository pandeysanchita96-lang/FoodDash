import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import ItemManager from './ItemManager';
import VendorOrders from './VendorOrders';
import VendorAnalytics from './VendorAnalytics';
import orderService from '../../services/orderService';
import { useTheme } from '../../context/ThemeContext';
import useWebSocket from '../../hooks/useWebSocket';
import { LayoutGrid, ClipboardList, LogOut, TrendingUp, ShoppingBag, Clock, CheckCircle, PieChart, Moon, Sun, Sparkles, Bell, X, Wifi, WifiOff } from 'lucide-react';

const VendorDashboard = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('orders');
    const [stats, setStats] = useState(null);
    const [orderFilter] = useState('ALL');
    const [selectedMetric, setSelectedMetric] = useState('earnings');
    const [notifications, setNotifications] = useState([]);
    const [ordersKey, setOrdersKey] = useState(0);
    const [isGlobalView, setIsGlobalView] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const data = isGlobalView
                ? await orderService.getAllStats()
                : await orderService.getVendorStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch statistics", err);
        }
    }, [isGlobalView]);

    // Handle new order from WebSocket
    const handleNewOrder = useCallback((orderData) => {
        // Add notification
        const newNotification = {
            id: Date.now(),
            ...orderData,
            timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 5));

        // Play notification sound (optional)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+Onp2dm5ybmJeUkoyLhoF9eXVxbGZiX1tXVVNRUE9PT09PT09PT09PT09QUFFSVFZaXWFkZ2xwdXqAhYqOkpWYmpydnp6dnJqXlJGNiIR/endzbmllYV1aV1RST05NTExMTExMTExMTExMTExNTk9QUlVYW15hZGhrbnF0d3l7fX5/f39/fn18enl3dXJwbWpmY19bWFVTUE5MSklIR0dHR0dHR0dIR0hISUpLTE5QUldaXWBjZ2pucHJzdXZ2dnZ1dXRzcW9sa2hla2trbWpmaWZiaGdiY2RjYGFfXFxcW1ZVWFZSVFVSUFNQT1FPTk9OTU1NTU1NTU1OTU1OTk5PT1BQUVFSUlRUVFVWVlZXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1ZWVlZWVlZWVlZWVVVVVVVVVVVVVVVVVVVVVVRUVFRUVFRUVFRUU1NTUFBQUFBQUFBNT01NTU1NTU1NTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0xMTExMTE1NTU5OTk9PT1BQUFFRUVJSU1NUVFVWVldYWFlaWltbXF1eXl9gYGFiY2RlZWZnaGlqa2xtbm9wbQ==');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch (e) { }

        // Refresh stats and orders after a short delay to ensure DB transaction has committed
        setTimeout(() => {
            fetchStats();
            setOrdersKey(prev => prev + 1);
        }, 500);
    }, [fetchStats]);

    // Setup WebSocket connection - subscribe to both for admins/global view
    const topics = [`/topic/vendor/${user?.vendorId}/orders`, '/topic/all-orders'];
    const { isConnected } = useWebSocket(topics, handleNewOrder);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleChipClick = (metric, tab = 'analytics') => {
        setSelectedMetric(metric);
        setActiveTab(tab);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const menuItems = [
        { id: 'items', icon: LayoutGrid, label: 'Menu Items' },
        { id: 'orders', icon: ClipboardList, label: 'Orders' },
        { id: 'analytics', icon: PieChart, label: 'Analytics' }
    ];

    const statCards = [
        {
            id: 'earnings',
            icon: TrendingUp,
            label: 'Total Earnings',
            value: `₹${stats?.totalEarnings?.toFixed(2) || '0.00'}`,
            gradient: 'linear-gradient(135deg, #E63946 0%, #FF7B7B 100%)',
            lightBg: 'rgba(230, 57, 70, 0.08)',
            color: '#E63946'
        },
        {
            id: 'orders',
            icon: ShoppingBag,
            label: 'Total Orders',
            value: stats?.totalOrders || '0',
            gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
            lightBg: 'rgba(59, 130, 246, 0.08)',
            color: '#3B82F6'
        },
        {
            id: 'status',
            icon: Clock,
            label: 'Active Orders',
            value: stats?.activeOrders || '0',
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            lightBg: 'rgba(245, 158, 11, 0.08)',
            color: '#F59E0B'
        },
        {
            id: 'completed',
            icon: CheckCircle,
            label: 'Completed',
            value: stats?.completedOrders || '0',
            gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
            lightBg: 'rgba(16, 185, 129, 0.08)',
            color: '#10B981'
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gray)' }}>
            {/* Toast Notifications */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '400px'
            }}>
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        style={{
                            background: 'linear-gradient(135deg, #10B981, #34D399)',
                            color: 'white',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                            animation: 'slideDown 0.4s ease-out'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Bell size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', marginBottom: '4px' }}>New Order #{notif.orderId}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                {notif.customerName} • ₹{notif.totalAmount?.toFixed(2)} • {notif.itemCount} items
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>{notif.timestamp}</div>
                        </div>
                        <button
                            onClick={() => dismissNotification(notif.id)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)'
            }}>
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    style={{
                        padding: '28px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)'
                    }}
                >
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, var(--primary), #FF7B7B)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)'
                    }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            {isGlobalView ? 'FoodDash' : (user?.businessName || 'Vendor Hub')}
                        </h1>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                            {isGlobalView ? 'Admin Control' : 'Partner Dashboard'}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: '24px 16px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '14px 18px',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    background: activeTab === item.id
                                        ? 'linear-gradient(135deg, var(--primary), #FF7B7B)'
                                        : 'transparent',
                                    color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                                    fontWeight: activeTab === item.id ? '700' : '500',
                                    fontSize: '0.95rem',
                                    textAlign: 'left',
                                    transition: 'var(--transition)',
                                    boxShadow: activeTab === item.id ? '0 4px 12px rgba(230, 57, 70, 0.25)' : 'none'
                                }}
                            >
                                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Global View Toggle */}
                    <div style={{ marginTop: '20px', padding: '0 8px' }}>
                        <button
                            onClick={() => setIsGlobalView(!isGlobalView)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                border: `1px solid ${isGlobalView ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: 'var(--radius-md)',
                                background: isGlobalView ? 'var(--primary-light)' : 'transparent',
                                color: isGlobalView ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            <TrendingUp size={18} />
                            {isGlobalView ? 'Global View ON' : 'Global View OFF'}
                        </button>
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                    {/* Connection Status */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        marginBottom: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: isConnected ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {isConnected ? (
                            <>
                                <Wifi size={16} style={{ color: '#10B981' }} />
                                <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '600' }}>Live Updates Active</span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={16} style={{ color: '#EF4444' }} />
                                <span style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: '600' }}>Connecting...</span>
                            </>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '12px',
                            marginBottom: '16px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            background: 'var(--bg-gray)',
                            color: 'var(--text-main)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'var(--transition)'
                        }}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    {/* User Profile */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        padding: '12px',
                        background: 'var(--bg-gray)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--primary), #FF7B7B)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '1.1rem'
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {isGlobalView ? 'FoodDash Admin' : (user?.businessName || user?.name)}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {isGlobalView ? 'Platform Manager' : 'Vendor Partner'}
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            background: 'rgba(239, 68, 68, 0.05)',
                            color: '#EF4444',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'var(--transition)'
                        }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '40px 48px', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header */}
                    <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="slide-up">
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                                {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                            </span>
                            <h2 style={{
                                fontSize: '2.4rem',
                                fontWeight: '800',
                                color: 'var(--text-main)',
                                letterSpacing: '-0.03em',
                                margin: 0
                            }}>
                                {isGlobalView ? 'FoodDash Overview' : (user?.businessName || 'Dashboard')}
                            </h2>
                        </div>
                        <div className="slide-down" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            background: 'var(--card-bg)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: isConnected ? '#10B981' : '#EF4444',
                                boxShadow: isConnected ? '0 0 8px rgba(16, 185, 129, 0.5)' : '0 0 8px rgba(239, 68, 68, 0.5)'
                            }} />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        {statCards.map((card, index) => (
                            <div
                                key={card.id}
                                onClick={() => card.id !== 'completed' && handleChipClick(card.id)}
                                className={`scale-in stagger-${index + 1}`}
                                style={{
                                    padding: '24px',
                                    background: 'var(--card-bg)',
                                    borderRadius: 'var(--radius-xl)',
                                    border: selectedMetric === card.id ? `2px solid ${card.color}` : '1px solid var(--border)',
                                    boxShadow: selectedMetric === card.id ? `0 8px 24px ${card.color}20` : 'var(--shadow-md)',
                                    cursor: card.id !== 'completed' ? 'pointer' : 'default',
                                    transition: 'var(--transition)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Accent bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: card.gradient,
                                    opacity: selectedMetric === card.id ? 1 : 0,
                                    transition: 'var(--transition)'
                                }} />

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: 'var(--radius-md)',
                                        background: card.lightBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: card.color
                                    }}>
                                        <card.icon size={26} strokeWidth={2} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>
                                    {card.label}
                                </div>
                                <div style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '800',
                                    color: 'var(--text-main)',
                                    letterSpacing: '-0.5px'
                                }}>
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="card-premium scale-in stagger-4" style={{
                        padding: '32px',
                        background: 'var(--card-bg)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                        minHeight: '400px'
                    }}>
                        {activeTab === 'items' && <ItemManager />}
                        {activeTab === 'orders' && <VendorOrders key={`${ordersKey}-${isGlobalView}`} isGlobal={isGlobalView} initialFilter={orderFilter} />}
                        {activeTab === 'analytics' && <VendorAnalytics selectedMetric={selectedMetric} isGlobal={isGlobalView} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
