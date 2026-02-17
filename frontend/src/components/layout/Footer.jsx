import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--bg-gray)', color: 'var(--text-main)', padding: '40px 60px', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
                    {/* Branding */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#EB1700"><path d="M21.5 11.2c-.1-.5-.4-.9-.8-1.2L13 3.5c-.6-.5-1.4-.5-2 0L3.3 10c-.4.3-.7.7-.8 1.2-.1.5 0 1 .3 1.4l7.7 6.5c.3.3.7.4 1.1.4.4 0 .8-.1 1.1-.4l7.7-6.5c.3-.4.5-.9.4-1.4z" /></svg>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>FoodDash</h2>
                    </div>

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
                        {/* Links */}
                        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', color: 'var(--text-main)' }}>Privacy</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', color: 'var(--text-main)' }}>Terms & Conditions</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', color: 'var(--text-main)' }}>Help & Support</span>
                        </div>

                        {/* App Badges */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                style={{ height: '36px', cursor: 'pointer' }}
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                alt="App Store"
                                style={{ height: '36px', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <Facebook size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                        <Twitter size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                        <Instagram size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                        <Linkedin size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        © {new Date().getFullYear()} FoodDash
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
