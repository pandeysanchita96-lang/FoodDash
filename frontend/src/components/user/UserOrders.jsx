import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import { Clock, CheckCircle, Package, Truck, AlertCircle, RefreshCcw, Store, FileText } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import InvoiceModal from './InvoiceModal';

const UserOrders = () => {
    const { showNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getUserOrders();
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING': return { color: '#E63946', bg: 'rgba(230, 57, 70, 0.1)', icon: <Clock size={16} />, gradient: 'linear-gradient(135deg, #E63946, #FF7B7B)' };
            case 'CONFIRMED': return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: <CheckCircle size={16} />, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' };
            case 'PREPARING': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <Package size={16} />, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' };
            case 'READY': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <Truck size={16} />, gradient: 'linear-gradient(135deg, #10B981, #34D399)' };
            case 'DELIVERED': return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', icon: <CheckCircle size={16} />, gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' };
            case 'CANCELLED': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertCircle size={16} />, gradient: 'linear-gradient(135deg, #EF4444, #F87171)' };
            default: return { color: '#64748B', bg: 'rgba(148, 163, 184, 0.1)', icon: <Clock size={16} />, gradient: 'linear-gradient(135deg, #64748B, #94A3B8)' };
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="pulse" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Loading your orders...</div>
            </div>
        );
    }

    const handleReorder = async (order) => {
        const orderData = {
            vendorId: order.vendor.id,
            deliveryAddress: order.deliveryAddress,
            notes: `Reorder of #${order.id}`,
            items: order.orderItems.map(item => ({
                itemId: item.item.id,
                quantity: item.quantity
            }))
        };

        try {
            await orderService.createOrder(orderData);
            showNotification("Order placed successfully! Redirecting...", "success");
            fetchOrders();
        } catch (err) {
            console.error("Failed to reorder", err);
            showNotification("Failed to reorder. Please try again.", "error");
        }
    };

    return (
        <div style={{ animation: 'slideUp 0.6s ease-out' }}>
            <header style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>
                    My <span className="gradient-text">Orders</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Track your delicious moments and quick reorders.</p>
            </header>

            {orders.length === 0 ? (
                <div className="card-premium glass" style={{ textAlign: 'center', padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <Package size={40} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', marginBottom: '32px' }}>Hungry? Discover the best flavors from top-rated restaurants!</p>
                    <button className="btn-primary" onClick={() => window.location.hash = '#explorer'}>Start Exploring</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {orders.map((order, index) => {
                        const styles = getStatusStyles(order.status);
                        return (
                            <div
                                key={order.id}
                                className={`card-premium glass-strong scale-in stagger-${(index % 4) + 1}`}
                                style={{ padding: '28px', borderLeft: `4px solid ${styles.color}` }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '20px',
                                            padding: '2px',
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '18px',
                                                backgroundColor: 'var(--bg-white)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Store size={32} color="var(--primary)" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>{order.vendor.businessName}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                <span style={{ backgroundColor: 'var(--bg-gray)', padding: '2px 8px', borderRadius: '6px' }}>#{order.id}</span>
                                                <span>•</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px',
                                        borderRadius: '100px', backgroundColor: styles.bg, color: styles.color,
                                        fontSize: '0.85rem', fontWeight: '800', border: `1px solid ${styles.color}20`,
                                        boxShadow: `0 4px 12px ${styles.color}15`
                                    }}>
                                        {styles.icon} {order.status}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '20px',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    marginBottom: '24px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                                        {order.orderItems.map(item => (
                                            <div key={item.id} style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '8px',
                                                    backgroundColor: 'var(--primary-light)',
                                                    color: 'var(--primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {item.quantity}x
                                                </span>
                                                <span className="truncate">{item.item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => handleReorder(order)}
                                            className="btn-primary"
                                            style={{ padding: '12px 24px', borderRadius: '14px' }}
                                        >
                                            <RefreshCcw size={18} /> Reorder
                                        </button>
                                        <button
                                            onClick={() => setSelectedOrderForInvoice(order)}
                                            className="btn-secondary"
                                            style={{ padding: '12px 24px', borderRadius: '14px' }}
                                        >
                                            <FileText size={18} /> Receipt
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Amount</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1' }}>₹{order.totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedOrderForInvoice && (
                <InvoiceModal
                    order={selectedOrderForInvoice}
                    onClose={() => setSelectedOrderForInvoice(null)}
                />
            )}
        </div>
    );
};

export default UserOrders;
