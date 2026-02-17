import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import AdminStats from './AdminStats';
import AdminAllOrders from './AdminAllOrders';
import UserManager from './UserManager';
import VendorApproval from './VendorApproval';
import { Users, Store, LogOut, Shield, BarChart3, ListOrdered } from 'lucide-react';

const AdminDashboard = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
            {/* Sidebar */}
            <div style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid #E8E8E8', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <Shield size={28} color="#EB1700" />
                    <h1 style={{ color: '#EB1700', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Admin Dash</h1>
                </div>

                <div style={{ padding: '0 16px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                            onClick={() => setActiveTab('stats')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'stats' ? '#FFF1F0' : 'transparent',
                                color: activeTab === 'stats' ? '#EB1700' : '#191919', fontWeight: activeTab === 'stats' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <BarChart3 size={20} /> Statistics
                        </button>
                        <button
                            onClick={() => setActiveTab('vendors')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'vendors' ? '#FFF1F0' : 'transparent',
                                color: activeTab === 'vendors' ? '#EB1700' : '#191919', fontWeight: activeTab === 'vendors' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <Shield size={20} /> Vendor Approval
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'users' ? '#FFF1F0' : 'transparent',
                                color: activeTab === 'users' ? '#EB1700' : '#191919', fontWeight: activeTab === 'users' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <Users size={20} /> User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#FFF1F0' : 'transparent',
                                color: activeTab === 'orders' ? '#EB1700' : '#191919', fontWeight: activeTab === 'orders' ? '700' : '500',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            <ListOrdered size={20} /> All Orders
                        </button>
                    </div>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid #E8E8E8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#191919', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6C6C6C' }}>Super Admin</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid #E8E8E8',
                            borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white', color: '#191919', fontWeight: '600', transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Administrative Controls</h2>
                        <p style={{ color: '#6C6C6C' }}>Monitor users, approve vendors, and manage platform security.</p>
                    </header>
                    {activeTab === 'stats' && <AdminStats />}
                    {activeTab === 'vendors' && <div className="premium-card" style={{ padding: '32px' }}><VendorApproval /></div>}
                    {activeTab === 'users' && <div className="premium-card" style={{ padding: '32px' }}><UserManager /></div>}
                    {activeTab === 'orders' && <AdminAllOrders />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
