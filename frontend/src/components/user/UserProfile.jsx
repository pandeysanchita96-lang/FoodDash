import React from 'react';
import authService from '../../services/authService';
import { Mail, MapPin, Edit3, ShieldCheck, Bell, CreditCard, Home, Shield } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const UserProfile = () => {
    const user = authService.getCurrentUser();
    const { showNotification } = useNotification();

    const accountSettings = [
        { id: 'notif', text: 'Notification Preferences', icon: Bell },
        { id: 'payment', text: 'Payment Methods', icon: CreditCard },
        { id: 'address', text: 'Manage Addresses', icon: Home },
        { id: 'privacy', text: 'Privacy & Security', icon: Shield }
    ];

    const handleSettingClick = (setting) => {
        showNotification(`${setting} module is coming soon!`, 'info');
    };

    return (
        <div style={{ animation: 'slideUp 0.6s ease-out' }}>
            <header style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>My Profile</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your account settings and delivery addresses.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                {/* Profile Card */}
                <div className="premium-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2rem' }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{user?.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4CAF50', backgroundColor: '#E8F5E9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', marginTop: '4px', width: 'fit-content' }}>
                                <ShieldCheck size={14} /> Verified Customer
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--bg-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{user?.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--bg-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={18} color="var(--text-muted)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Default Delivery Address</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600' }}>Hinjewadi Phase 1, Pune, MH</div>
                            </div>
                        </div>
                    </div>

                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                        <Edit3 size={18} /> Edit Profile
                    </button>
                </div>

                {/* Account Settings */}
                <div className="premium-card" style={{
                    padding: '32px',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '32px', color: 'var(--text-main)' }}>Account Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {accountSettings.map(({ id, text, icon: Icon }) => (
                            <div
                                key={id}
                                onClick={() => handleSettingClick(text)}
                                style={{
                                    padding: '20px 24px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-gray)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                    color: 'var(--text-main)'
                                }}
                                className="settings-item-hover"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        <Icon size={20} />
                                    </div>
                                    <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{text}</span>
                                </div>
                                <Edit3 size={18} style={{ opacity: 0.4, color: 'var(--text-muted)' }} />
                            </div>
                        ))}
                    </div>

                    <style>{`
                        .settings-item-hover:hover {
                            background: var(--bg-white) !important;
                            border-color: var(--primary) !important;
                            transform: translateX(4px);
                            box-shadow: var(--shadow-md);
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
