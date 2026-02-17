import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { Mail, Lock, User, Phone, Building2, MapPin, Sparkles } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const Register = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        isVendor: false,
        businessName: '',
        category: '',
        address: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.register(formData);
            console.log('Registration successful:', response);
            showNotification('Registration successful! Welcome to FoodDash.', 'success');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Decorative Background Elements */}
            <div style={styles.bubble1}></div>
            <div style={styles.bubble2}></div>
            <div style={styles.bubble3}></div>

            <div style={{ ...styles.card, animation: 'cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <Sparkles size={32} color="#E63946" />
                    </div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join us and start ordering delicious food</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <div style={styles.inputWrapper}>
                            <User size={18} style={styles.icon} />
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.icon} />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <div style={styles.inputWrapper}>
                            <Phone size={18} style={styles.icon} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Vendor Toggle */}
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="isVendor"
                            id="isVendor"
                            checked={formData.isVendor}
                            onChange={handleChange}
                            style={styles.checkbox}
                        />
                        <label htmlFor="isVendor" style={styles.checkboxLabel}>
                            Register as Vendor
                            <span style={styles.checkboxSubtext}>List your restaurant on FoodDash</span>
                        </label>
                    </div>

                    {/* Vendor Fields */}
                    {formData.isVendor && (
                        <div style={styles.vendorSection}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Business Name</label>
                                <div style={styles.inputWrapper}>
                                    <Building2 size={18} style={styles.icon} />
                                    <input
                                        type="text"
                                        name="businessName"
                                        placeholder="Your Restaurant Name"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required={formData.isVendor}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required={formData.isVendor}
                                    style={styles.select}
                                >
                                    <option value="">Select Category</option>
                                    <option value="INDIAN">Indian</option>
                                    <option value="CHINESE">Chinese</option>
                                    <option value="ITALIAN">Italian</option>
                                    <option value="FAST_FOOD">Fast Food</option>
                                    <option value="DESSERTS">Desserts</option>
                                    <option value="BEVERAGES">Beverages</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Address</label>
                                <div style={styles.inputWrapper}>
                                    <MapPin size={18} style={styles.icon} />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Restaurant Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required={formData.isVendor}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Tell us about your restaurant..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Business Image URL</label>
                                <div style={styles.inputWrapper}>
                                    <Sparkles size={18} style={styles.icon} />
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                                    A stunning photo makes your restaurant stand out!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Login Link */}
                    <div style={styles.footer}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={styles.link}
                        >
                            Sign in
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #0f172a, #1E293B, #E63946, #1E293B)',
        backgroundSize: '400% 400%',
        animation: 'meshGradient 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
    },
    bubble1: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(230, 57, 70, 0.1)',
        borderRadius: '50%',
        top: '-150px',
        left: '-150px',
        filter: 'blur(100px)',
        animation: 'float 25s infinite ease-in-out'
    },
    bubble2: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'rgba(69, 123, 157, 0.1)',
        borderRadius: '50%',
        bottom: '-200px',
        right: '-150px',
        filter: 'blur(120px)',
        animation: 'float 30s infinite ease-in-out reverse'
    },
    bubble3: {
        position: 'absolute',
        width: '250px',
        height: '250px',
        background: 'rgba(230, 57, 70, 0.05)',
        borderRadius: '50%',
        top: '20%',
        right: '10%',
        filter: 'blur(60px)',
        animation: 'float 20s infinite ease-in-out'
    },
    card: {
        width: '100%',
        maxWidth: '550px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    logoContainer: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1E293B',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748B',
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    error: {
        padding: '12px 16px',
        background: '#FEE2E2',
        color: '#DC2626',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #FECACA'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1E293B'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '14px',
        color: '#94A3B8',
        pointerEvents: 'none'
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 44px',
        fontSize: '15px',
        border: '2px solid #E2E8F0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
        color: '#1E293B',
        background: 'white'
    },
    select: {
        width: '100%',
        padding: '12px 14px',
        fontSize: '15px',
        border: '2px solid #E2E8F0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
        color: '#1E293B',
        background: 'white',
        cursor: 'pointer'
    },
    textarea: {
        width: '100%',
        padding: '12px 14px',
        fontSize: '15px',
        border: '2px solid #E2E8F0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
        color: '#1E293B',
        background: 'white',
        resize: 'vertical'
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '2px solid #E2E8F0'
    },
    checkbox: {
        width: '20px',
        height: '20px',
        marginTop: '2px',
        cursor: 'pointer',
        accentColor: '#E63946'
    },
    checkboxLabel: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1E293B',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    checkboxSubtext: {
        fontSize: '13px',
        fontWeight: '400',
        color: '#64748B'
    },
    vendorSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '2px dashed #CBD5E1'
    },
    button: {
        width: '100%',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '700',
        color: 'white',
        background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '8px'
    },
    footer: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748B'
    },
    link: {
        color: '#E63946',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none'
    }
};

// Add focus styles via CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes meshGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(40px, -60px) scale(1.1); }
        66% { transform: translate(-30px, 30px) scale(0.9); }
    }
    @keyframes cardEntrance {
        from { 
            opacity: 0; 
            transform: translateY(40px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    input:focus, select:focus, textarea:focus {
        border-color: #E63946 !important;
        box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.1) !important;
        transform: translateY(-1px);
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 25px rgba(230, 57, 70, 0.4);
    }
    button:active:not(:disabled) {
        transform: translateY(0) scale(0.98);
    }
`;
document.head.appendChild(styleSheet);

export default Register;
