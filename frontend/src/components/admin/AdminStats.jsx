import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Users, Store, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminService.getPlatformStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch admin stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#6C6C6C' }}>Loading platform statistics...</div>;

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: '#0070F3', bg: '#F0F7FF' },
        { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: <Store size={24} />, color: '#7928CA', bg: '#F5F0FF' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag size={24} />, color: '#FF0080', bg: '#FFF0F5' },
        { label: 'Gross Revenue', value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: <IndianRupee size={24} />, color: '#22C55E', bg: '#F0FFF4' }
    ];

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {cards.map((card, idx) => (
                    <div key={idx} className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            backgroundColor: card.bg, color: card.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#6C6C6C', fontWeight: '500' }}>{card.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#191919' }}>{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card" style={{ padding: '32px', textAlign: 'center', backgroundColor: 'white' }}>
                <TrendingUp size={48} color="#EB1700" style={{ marginBottom: '16px', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Platform Growth</h3>
                <p style={{ color: '#6C6C6C', maxWidth: '500px', margin: '0 auto' }}>
                    Your platform is scaling. Monitor key performance indicators to ensure operational excellence across all vendor partners.
                </p>
            </div>
        </div>
    );
};

export default AdminStats;
