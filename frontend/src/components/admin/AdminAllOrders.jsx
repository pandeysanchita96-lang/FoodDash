import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Search, Filter, ArrowUpDown, MoreVertical, MapPin } from 'lucide-react';

const AdminAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await adminService.getAllOrders();
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Failed to fetch all orders", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return { color: '#EB1700', bg: '#FFF1F0' };
            case 'CONFIRMED': return { color: '#0070F3', bg: '#F0F7FF' };
            case 'PREPARING': return { color: '#FF8A00', bg: '#FFF8F0' };
            case 'READY': return { color: '#22C55E', bg: '#F0FFF4' };
            case 'DELIVERED': return { color: '#6C6C6C', bg: '#F7F7F7' };
            default: return { color: '#191919', bg: '#F7F7F7' };
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#6C6C6C' }}>Loading all orders...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>System Orders</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6C6C6C' }} />
                        <input
                            type="text"
                            placeholder="Search order ID, customer or vendor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 10px 10px 40px',
                                borderRadius: '10px', border: '1px solid #E8E8E8',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <button style={{ backgroundColor: 'white', border: '1px solid #E8E8E8', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <Filter size={18} /> Filter
                    </button>
                    <button style={{ backgroundColor: 'white', border: '1px solid #E8E8E8', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <ArrowUpDown size={18} /> Export
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E8E8E8' }}>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>ORDER ID</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>CUSTOMER</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>RESTAURANT</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>AMOUNT</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>STATUS</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#6C6C6C', fontWeight: '700' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map(order => {
                            const style = getStatusStyle(order.status);
                            return (
                                <tr key={order.id} style={{ borderBottom: '1px solid #F0F0F0', verticalAlign: 'middle' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '700', color: '#191919' }}>#{order.id}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6C6C6C', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#191919' }}>{order.user.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6C6C6C', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <MapPin size={12} /> {order.deliveryAddress.substring(0, 20)}...
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#191919' }}>{order.vendor.businessName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6C6C6C', marginTop: '2px' }}>{order.vendor.category}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: '700', color: '#191919' }}>
                                        ₹{order.totalAmount.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{
                                            padding: '4px 12px', borderRadius: '99px',
                                            backgroundColor: style.bg, color: style.color,
                                            fontSize: '0.75rem', fontWeight: '800', display: 'inline-block'
                                        }}>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer' }}>
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#6C6C6C' }}>
                                    No orders found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAllOrders;
