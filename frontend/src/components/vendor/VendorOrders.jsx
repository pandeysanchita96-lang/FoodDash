import React, { useState, useEffect, useCallback } from 'react';
import orderService from '../../services/orderService';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, ShoppingBag, XCircle, User, RefreshCw } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const VendorOrders = ({ initialFilter = 'ALL', isGlobal = false }) => {
    const { showNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(initialFilter);

    useEffect(() => {
        setFilter(initialFilter);
    }, [initialFilter]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(`[VendorOrders] Fetching orders (Global: ${isGlobal})`);
            const data = isGlobal
                ? await orderService.getAllOrders()
                : await orderService.getVendorOrders();

            console.log(`[VendorOrders] Received ${data.length} orders`);

            const sortedOrders = Array.isArray(data) ? [...data].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
            }) : [];

            setOrders(sortedOrders);
        } catch (err) {
            console.error("[VendorOrders] Fetch error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            let errorMessage = "Failed to fetch orders";
            if (err.response?.status === 403) {
                errorMessage = "Access Denied: You don't have permission to view these orders.";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                errorMessage = err.response.data;
            } else {
                errorMessage = err.message || "An unexpected error occurred";
            }

            setError(errorMessage);
            showNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    }, [isGlobal, showNotification]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
            showNotification(`Order marked as ${status.toLowerCase()}`, "success");
            fetchOrders();
        } catch (err) {
            showNotification("Failed to update status", "error");
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'PENDING': {
                color: '#E63946',
                bg: 'rgba(230, 57, 70, 0.1)',
                icon: Clock,
                label: 'New Order',
                gradient: 'linear-gradient(135deg, #E63946, #FF7B7B)'
            },
            'CONFIRMED': {
                color: '#3B82F6',
                bg: 'rgba(59, 130, 246, 0.1)',
                icon: CheckCircle,
                label: 'Confirmed',
                gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
            },
            'PREPARING': {
                color: '#F59E0B',
                bg: 'rgba(245, 158, 11, 0.1)',
                icon: Package,
                label: 'Preparing',
                gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
            },
            'READY': {
                color: '#10B981',
                bg: 'rgba(16, 185, 129, 0.1)',
                icon: ShoppingBag,
                label: 'Ready',
                gradient: 'linear-gradient(135deg, #10B981, #34D399)'
            },
            'DELIVERED': {
                color: '#6366F1',
                bg: 'rgba(99, 102, 241, 0.1)',
                icon: Truck,
                label: 'Delivered',
                gradient: 'linear-gradient(135deg, #6366F1, #818CF8)'
            },
            'CANCELLED': {
                color: '#EF4444',
                bg: 'rgba(239, 68, 68, 0.1)',
                icon: XCircle,
                label: 'Cancelled',
                gradient: 'linear-gradient(135deg, #EF4444, #F87171)'
            }
        };
        return configs[status] || configs['PENDING'];
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'ALL') return true;
        if (filter === 'COMPLETED') return order.status === 'DELIVERED';
        if (filter === 'ACTIVE') return !['DELIVERED', 'CANCELLED'].includes(order.status);
        return true;
    });

    const filterButtons = [
        { id: 'ALL', label: 'All Orders' },
        { id: 'ACTIVE', label: 'Active' },
        { id: 'COMPLETED', label: 'Completed' }
    ];

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="pulse" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <XCircle size={48} style={{ color: '#EF4444', marginBottom: '16px', opacity: 0.8 }} />
                <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Oops! Something went wrong</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>
                <button onClick={fetchOrders} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} /> Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, marginBottom: '4px' }}>
                        Orders
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={fetchOrders}
                        style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Refresh Orders"
                    >
                        <RefreshCw size={18} />
                    </button>
                    {filterButtons.map(btn => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-xl)',
                                border: filter === btn.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: filter === btn.id ? 'var(--primary-light)' : 'var(--card-bg)',
                                color: filter === btn.id ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.length > 0 ? filteredOrders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div
                            key={order.id}
                            className={`card-premium glass-strong scale-in stagger-${(index % 4) + 1}`}
                            style={{
                                padding: '28px',
                                transition: 'var(--transition)',
                                position: 'relative',
                                overflow: 'hidden',
                                borderLeft: `6px solid ${statusConfig.color}`
                            }}
                        >

                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {/* Status Badge */}
                                        <div style={{
                                            padding: '8px 16px',
                                            borderRadius: 'var(--radius-xl)',
                                            background: statusConfig.bg,
                                            color: statusConfig.color,
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            <StatusIcon size={14} /> {statusConfig.label}
                                        </div>

                                        {/* Restaurant Badge (Global View Only) */}
                                        {isGlobal && order.vendor && (
                                            <div style={{
                                                padding: '4px 12px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-gray)',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <ShoppingBag size={12} /> {order.vendor.businessName}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            Order #{order.id} • {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-gray)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{order.user.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={12} /> {order.deliveryAddress}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{order.totalAmount.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{
                                background: 'var(--bg-gray)',
                                borderRadius: 'var(--radius-md)',
                                padding: '16px',
                                marginBottom: '20px'
                            }}>
                                {order.orderItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: idx < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                fontSize: '0.85rem'
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.item.name}</span>
                                        </div>
                                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {order.status === 'PENDING' && (
                                    <button onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')} className="btn-primary">
                                        Confirm Order <ChevronRight size={18} />
                                    </button>
                                )}
                                {order.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                        style={{
                                            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: 'var(--radius-xl)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                                        }}
                                    >
                                        Start Preparing <ChevronRight size={18} />
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                                        style={{
                                            background: 'linear-gradient(135deg, #10B981, #34D399)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: 'var(--radius-xl)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        Mark as Ready <ChevronRight size={18} />
                                    </button>
                                )}
                                {order.status === 'READY' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                        style={{
                                            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: 'var(--radius-xl)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        Complete Delivery <CheckCircle size={18} />
                                    </button>
                                )}
                                {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-muted)',
                                            padding: '12px 24px',
                                            borderRadius: 'var(--radius-xl)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 0',
                        color: 'var(--text-muted)'
                    }}>
                        <ShoppingBag size={56} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No orders found</p>
                        <p style={{ fontSize: '0.9rem' }}>Orders will appear here when customers place them.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;
